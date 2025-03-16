import importlib.util
import logging
import sys
from pathlib import Path
from typing import List

logger = logging.getLogger(__name__)

#TODO improve this
PACKAGE_BASE_PATH = Path(__file__).parent.parent.parent

flow_classes = []

def load_flow_modules(paths: List[str]):
    """
    Recursively loads all Python modules that start with 'flow_' 
    from the given paths. These paths can be inside the package 
    or the main project.

    Args:
        paths (List[str]): A list of base directories to search for modules.

    Returns:
        dict: A dictionary of loaded modules {module_name: module}.
    """
    loaded_modules = {}

    for base_path in paths:
        base_path = Path(base_path).resolve()

        if not base_path.exists():
            logger.warn(f"⚠️ Path does not exist: {base_path}")
            continue
        
        if str(base_path) not in sys.path:
            sys.path.insert(0, str(base_path)) 
            
        # Recursively find all Python files that start with "flow_"
        for file_path in base_path.rglob("flow_*.py"):
            module_parent = file_path.parent
            relative_path = file_path.relative_to(base_path)
            module_name = ".".join(relative_path.with_suffix("").parts)
            
            # Ensure Python recognizes the parent directory for relative imports
            if str(module_parent) not in sys.path:
                sys.path.insert(0, str(module_parent))  # Add parent directory to sys.path

            try:
                # Dynamically load the module
                spec = importlib.util.spec_from_file_location(module_name, file_path)
                if spec and spec.loader:
                    module = importlib.util.module_from_spec(spec)
                    sys.modules[module_name] = module
                    spec.loader.exec_module(module)
                    loaded_modules[module_name] = module
                    logger.info(f"✅ Loaded module: {module_name}")
            except Exception as e:
                logger.error(f"❌ Failed to load {module_name}: {e}")

    return loaded_modules

def get_module_classes(modules, clazz):
    ret = []
    for module in modules.values():
        classes = [
            getattr(module, x) for x in dir(module) if isinstance(getattr(module, x), type)
        ]
        for cls in classes:
            if cls != clazz and issubclass(cls, clazz):
                setattr(sys.modules[__name__], cls.__name__, cls)
                ret.append(cls)
    return ret


