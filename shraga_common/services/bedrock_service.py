import asyncio
import json
import time
from json import JSONDecodeError
from typing import List, Literal, Optional, TypedDict

import boto3
import botocore

from shraga_common import ShragaConfig, LLMServiceUnavailableException
from shraga_common.models import FlowStats
from shraga_common.utils import safe_to_int
from .common import LLMModelResponse
from .llm_service import LLMService, LLMServiceOptions
from pydantic import BaseModel


class InvokeConfig(BaseModel):
    model_id: Optional[str] = None
    parse_json: Optional[bool] = False
    is_retry: Optional[bool] = False



class BedrockChatModelId(TypedDict):
    cohere_command: str
    haiku: str
    haiku_3_5_us: str
    sonnet_3: str
    sonnet_3_5: str
    sonnet_3_5_v2_us: str
    sonnet_3_7: str
    sonnet_4_eu: str
    nova_pro: str


BedrockModelNames = Literal[tuple(BedrockChatModelId.__annotations__.keys())]

BEDROCK_CHAT_MODEL_IDS: BedrockChatModelId = {
    # "cohere_command": "cohere.command-text-v14",
    "haiku": "anthropic.claude-3-haiku-20240307-v1:0",
    "sonnet_3": "anthropic.claude-3-sonnet-20240229-v1:0",
    "sonnet_3_5": "anthropic.claude-3-5-sonnet-20240620-v1:0",
    "sonnet_3_7": "anthropic.claude-3-7-sonnet-20250219-v1:0",
    "nova_pro": "amazon.nova-pro-v1:0",
    # cross region routing
    "haiku_3_5_us": "us.anthropic.claude-3-5-haiku-20241022-v1:0",
    "sonnet_3_5_v2_us": "us.anthropic.claude-3-5-sonnet-20241022-v2:0",
    "sonnet_4_eu": "eu.anthropic.claude-sonnet-4-20250514-v1:0"
}


class BedrockService(LLMService):
    def __init__(
        self,
        shraga_config: Optional[ShragaConfig] = None,
        aws_access_key_id: Optional[str] = None,
        aws_secret_access_key: Optional[str] = None,
        profile_name: Optional[str] = None,
        region_name: str = "us-east-1",
    ):

        if shraga_config:
            aws_access_key_id = aws_access_key_id or shraga_config.get(
                "aws.access_key_id"
            )
            aws_secret_access_key = aws_secret_access_key or shraga_config.get(
                "aws.secret_access_key"
            )
            profile_name = profile_name or shraga_config.get("aws.profile")
            region_name = shraga_config.get("aws.region") or region_name
        if aws_access_key_id == "":
            aws_access_key_id = None
        if aws_secret_access_key == "":
            aws_secret_access_key = None
        self.boto = boto3.client(
            service_name="bedrock-runtime",
            aws_access_key_id=aws_access_key_id if aws_access_key_id else None,
            aws_secret_access_key=(
                aws_secret_access_key if aws_secret_access_key else None
            ),
            # profile=profile_name,
            region_name=region_name,
        )

    def __new__(cls, *args, **kwargs):
        if not hasattr(cls, "instance"):
            cls.instance = super(BedrockService, cls).__new__(cls)
        return cls.instance

    async def invoke_model(
        self, prompt: str, options: Optional[LLMServiceOptions] = None
    ):
        return await self.invoke_chat_model(prompt, options)

    async def invoke_converse_model(
        self, system_prompt: List[str], prompt: str, tool_config: Optional[dict] = {}, options: Optional[InvokeConfig] = None
    ):
        if not options:
            options = InvokeConfig(
                model_id="sonnet_3",
            )

        model_name: BedrockModelNames = options.model_id
        model_id = BEDROCK_CHAT_MODEL_IDS[model_name]

        system_messages = [{"text": msg} for msg in system_prompt]
        messages = [{"role": "user", "content": [{"text": prompt}]}]

        converse_params = {
                "modelId": model_id,
                "system": system_messages,
                "messages": messages,
                "inferenceConfig": {"temperature": 0.0, "maxTokens": 8192},
            }
        
        if tool_config:
            converse_params["toolConfig"] = tool_config
        
        try:
            start_time = time.time()
            response = await asyncio.get_event_loop().run_in_executor(
                None,
                lambda: self.boto.converse(
                    **converse_params,
                ),
            )
            
            if response.get('Error'):
                error_code = response['Error'].get('Code')
                error_message = response['Error'].get('Message')
                raise LLMServiceUnavailableException(f"Bedrock error ({error_code}, {error_message})")

            stats = FlowStats(
                llm_model_id=model_id,
                time_took=time.time() - start_time,
                latency=response['metrics']['latencyMs'],
                input_tokens=response['usage']['inputTokens'],
                output_tokens=response['usage']['outputTokens'],
                total_tokens=response['usage']['totalTokens'],
            )

            text = LLMModelResponse.clean_text(response["output"]["message"]["content"][0]["text"])

            parsed_json = None
            if options.parse_json:
                parsed_json = json.loads(text, strict=False)

            return LLMModelResponse(text=text, json=parsed_json, stats=stats)

        except JSONDecodeError:
            if not options.is_retry:
                options.is_retry = True
                return await self.invoke_converse_model(system_prompt, prompt, tool_config, options)
            else:
                raise
            
        except LLMServiceUnavailableException:
            raise
        except (
            boto3.exceptions.Boto3Error,
            boto3.exceptions.RetriesExceededError,
            botocore.exceptions.BotoCoreError,
            botocore.exceptions.ClientError,
            asyncio.TimeoutError,
        ) as e:
            raise LLMServiceUnavailableException("Bedrock error", e)
        except Exception as e:
            raise Exception(f"Error invoking Bedrock model: {str(e)}")
        

    async def invoke_chat_model(
        self, prompt: str, options: Optional[LLMServiceOptions] = None
    ) -> LLMModelResponse:
        if not options:
            options = {
                "model_id": "sonnet_3",
            }

        model_name: BedrockModelNames = options.get("model_id")
        model_id = BEDROCK_CHAT_MODEL_IDS[model_name]

        body = json.dumps(
            {
                "anthropic_version": "bedrock-2023-05-31",
                "max_tokens": 9182,
                "temperature": 0.0,
                "messages": [
                    {
                        "role": "user",
                        "content": [{"type": "text", "text": prompt}],
                    }
                ],
            }
        )

        try:
            start_time = time.time()
            response = await asyncio.get_event_loop().run_in_executor(
                None,
                lambda: self.boto.invoke_model(
                    body=body,
                    modelId=model_id,
                    accept="application/json",
                    contentType="application/json",
                ),
            )
            time_took = time.time() - start_time
            headers = response.get("ResponseMetadata").get("HTTPHeaders")
            stats = FlowStats(
                llm_model_id=model_id,
                time_took=time_took,
                latency=safe_to_int(headers.get("x-amzn-bedrock-invocation-latency")),
                input_tokens=safe_to_int(headers.get("x-amzn-bedrock-input-token-count")),
                output_tokens=safe_to_int(headers.get("x-amzn-bedrock-output-token-count")),
            )
            body = response.get("body").read()
            text = json.loads(body).get("content")[0].get("text")
            return LLMModelResponse(text=text, stats=stats)
        
        except (
            boto3.exceptions.Boto3Error,
            boto3.exceptions.RetriesExceededError,
            botocore.exceptions.BotoCoreError,
            botocore.exceptions.ClientError,
            asyncio.TimeoutError,
        ) as e:
            raise LLMServiceUnavailableException("Bedrock error", e)
        except Exception as e:
            raise Exception(f"Error invoking Bedrock model: {str(e)}")

