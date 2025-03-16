import logging

from opensearchpy import NotFoundError
from pydash import _

from ..config import get_config, shraga_config
from ..models import AnalyticsRequest
from .get_history_client import get_history_client

logger = logging.getLogger(__name__)


def is_analytics_authorized(email: str):
    if not get_config("history.analytics") or not email or "@" not in email:
        return False
    if email in get_config("history.analytics.users", []):
        return True
    _, domain = email.split("@")
    if domain in get_config("history.analytics.domains", []):
        return True
    return False


async def get_step_stats(filters, steps) -> list:
    if not steps:
        return dict()

    try:
        client, index = get_history_client(shraga_config)
        if not client:
            return dict()

        query = {"size": 0, "query": {"bool": {"filter": filters}}}

        aggs = {}
        for step in steps:
            aggs[step] = {
                "filter": {"term": {"steps": step}},
                "aggs": {
                    f"time_took": {
                        "percentiles": {
                            "field": f"{step}_stats.time_took",
                            "percents": [50, 75, 95, 99, 99.9],
                        }
                    },
                },
            }

        query["aggs"] = aggs
        response = client.search(index=index, body=query)

        step_stats = []
        for step in steps:
            step_stats.append(
                {
                    "step": step,
                    "total_count": _.get(response, f"aggregations.{step}.doc_count"),
                    "input_tokens": _.get(
                        response, f"aggregations.{step}.input_tokens.values"
                    ),
                    "output_tokens": _.get(
                        response, f"aggregations.{step}.output_tokens.values"
                    ),
                    "latency": _.get(response, f"aggregations.{step}.latency.values"),
                }
            )

        return step_stats
    except NotFoundError:
        logger.error("Error retrieving analytics (index not found)")
        return dict()
    except Exception as e:
        logger.exception("Error retrieving analytics", exc_info=e)
        return dict()


async def get_analytics(request: AnalyticsRequest) -> dict:
    try:
        client, index = get_history_client(shraga_config)
        if not client:
            return dict()

        filters = []
        if request.start and request.end:
            filters.append(
                {
                    "range": {
                        "@timestamp": {
                            "gte": request.start,
                            "lte": request.end,
                        }
                    }
                }
            )
        elif request.start:
            filters.append(
                {
                    "range": {
                        "@timestamp": {
                            "gte": request.start,
                        }
                    }
                }
            )
        elif request.end:
            filters.append(
                {
                    "range": {
                        "@timestamp": {
                            "lte": request.end,
                        }
                    }
                }
            )

        query = {"size": 0, "query": {"bool": {"filter": filters}}}

        query["aggs"] = {
            "steps": {"terms": {"field": "steps", "size": 50}},
            "feedback": {
                "terms": {"field": "total_stats.feedback", "missing": "none", "size": 5}
            },
            "latency_percentiles": {
                "percentiles": {
                    "field": "total_stats.latency",
                    "percents": [50, 75, 95, 99, 99.9],
                }
            },
            "input_tokens_percentiles": {
                "percentiles": {
                    "field": "total_stats.input_tokens",
                    "percents": [50, 75, 95, 99, 99.9],
                }
            },
            "output_tokens_percentiles": {
                "percentiles": {
                    "field": "total_stats.output_tokens",
                    "percents": [50, 75, 95, 99, 99.9],
                }
            },
        }

        response = client.search(index=index, body=query)
        steps = [x.get("key") for x in _.get(response, "aggregations.steps.buckets")]
        feedback = _.get(response, "aggregations.feedback.buckets")

        step_stats = await get_step_stats(filters, steps)

        return {
            "steps": step_stats,
            "feedback": {x.get("key"): x.get("doc_count") for x in feedback},
        }
    except NotFoundError:
        logger.error("Error retrieving analytics (index not found)")
        return dict()
    except Exception as e:
        logger.exception("Error retrieving analytics", exc_info=e)
        return dict()
