import importlib.util
import os
import sys
from pathlib import Path
from typing import List

from shraga_common.models import FlowBase
from shraga_common.preprocessing.loaders import (get_module_classes,
                                                 load_flow_modules)

PACKAGE_BASE_PATH = Path(__file__).parent.parent.parent

flow_classes = []

def get_flows(shraga_config):
    global flow_classes
    
    base_flows_path = str(PACKAGE_BASE_PATH) + "/flows"
    
    paths = [base_flows_path, os.getenv("SHRAGA_FLOWS_PATH", "flows")]

    if len(flow_classes) == 0:
        modules = load_flow_modules(paths)
        flow_classes = get_module_classes(modules, FlowBase)
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
