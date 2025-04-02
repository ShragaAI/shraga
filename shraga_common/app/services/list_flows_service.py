from pathlib import Path

from shraga_common.models import FlowBase

PACKAGE_BASE_PATH = Path(__file__).parent.parent.parent

flow_classes = []

def register_flow(flow_class: FlowBase):
    global flow_classes
    if flow_class not in flow_classes:
        flow_classes.append(flow_class)

def get_flows(shraga_config):
    global flow_classes
    return {
        f.id(): {
            "description": f.description(),
            "preferences": f.available_preferences(shraga_config),
            "obj": f,
        }
        for f in flow_classes
    }

def get_available_flows(shraga_config):
    flows = get_flows(shraga_config)
    return {k: v.get("obj") for k, v in flows.items() if v and v.get("obj")}
