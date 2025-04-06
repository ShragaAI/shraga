from pathlib import Path

from shraga_common.models import FlowBase

PACKAGE_BASE_PATH = Path(__file__).parent.parent.parent

flow_classes = []
flows = {}
available_flows = {}

def register_flows(flws: list[FlowBase], shraga_config):
    global flows, available_flows, flow_classes
    for flow in flws:
        if not issubclass(flow, FlowBase):
            raise TypeError(
                f"Flow class {flow.__name__} must be a subclass of FlowBase"
            )
    flow_classes = flws  
    flows = get_flows(shraga_config)
    available_flows = {k: v.get("obj") for k, v in flows.items() if v and v.get("obj")}
    
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
    
def get_flow(flow_id):
    global flows
    flow = flows.get(flow_id)
    if not flow:
        raise RuntimeError(f"No flow found with id {flow_id}")
    return flow

def get_available_flows():
    global available_flows
    return available_flows
    