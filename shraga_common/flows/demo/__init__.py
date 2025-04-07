from .flow_chat_demo import ChatDemoFlow
from .flow_demo_default import DemoDefaultFlow

flows = [
    DemoDefaultFlow,
    ChatDemoFlow
]

__all__ = ["flows"]
