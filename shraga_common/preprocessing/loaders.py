import logging
import os
import sys


logger = logging.getLogger(__name__)


def dynamically_load_recursive(path: str, clazz):
    ret = []
    if not path.endswith("/"):
        path = path + "/"
    folders = [x for x in os.walk(path)]
    for folder in folders:
        ret += dynamically_load(path, folder[0].replace(path, ""), clazz)
    return ret


def dynamically_load(base_path: str, path: str, clazz):
    full_path = os.path.join(base_path, path)
    ret = []
    files = [
        f[:-3]
        for f in os.listdir(full_path)
        if f.endswith(".py") and f != "__init__.py"
    ]
    for py in files:
        try:
            mod = __import__(
                ".".join(["flows", path.replace("/", "."), py]), fromlist=[py]
            )
            classes = [
                getattr(mod, x) for x in dir(mod) if isinstance(getattr(mod, x), type)
            ]
            for cls in classes:
                if cls != clazz and issubclass(cls, clazz):
                    setattr(sys.modules[__name__], cls.__name__, cls)
                    ret.append(cls)
        except ModuleNotFoundError as e:
            logger.exception("Error loading flow " + str(py))
        except Exception:
            logger.exception("Error loading flow " + str(py))
    return ret
