import os
import re
import sys

import yaml
from pydash import _


class ShragaConfig:
    path_matcher = re.compile(r"\$\{([^}^{]+)}")

    def __init__(self):
        self.all_configs = None

    def path_constructor(self, loader, node):
        """Extract the matched value, expand env variable, and replace the match"""
        value = node.value
        match = self.path_matcher.match(value)
        env_var = match.group()[2:-1]
        env_var_val = os.environ.get(env_var)
        if env_var_val:
            return env_var_val + value[match.end() :]
        return ""
    
    def validate_config(self):
        """Validate configuration according to business rules"""
        list_flows = self.get("ui.list_flows")
        default_flow = self.get("ui.default_flow")
        
        if list_flows is None:
            raise ValueError("ui.list_flows must be explicitly set to true or false when UI is enabled", file=sys.stderr)
            
        if list_flows is True:
            pass
        elif list_flows is False:
            if not isinstance(default_flow, str) or not default_flow.strip():
                raise ValueError("When ui.list_flows is false, ui.default_flow must be a non-empty string")
        else:
            raise ValueError(f"ui.list_flows must be true or false, got: {list_flows}")

    def load(self, config_path: str = None):
        if not config_path:
            config_path = os.getenv("CONFIG_PATH") or "config.yaml"
        print(f"Loading config from {config_path}")

        try:
            with open(config_path) as stream:
                yaml.add_implicit_resolver("!path", self.path_matcher)
                yaml.add_constructor("!path", self.path_constructor)
                self.all_configs = yaml.load(stream, Loader=yaml.FullLoader)

                self.validate_config()

                return self
            
        except ValueError as e:
            print(f"ERROR: Configuration validation failed: {e}", file=sys.stderr)
            return None
        except Exception as e:
            print(f"ERROR: Failed to load config from {config_path}: {e}", file=sys.stderr)
            return None

    def get(self, k: str, default=None):
        v = _.get(self.all_configs, k)
        if v is None:
            return default
        return v

    def set(self, k: str, v):
        _.set(self.all_configs, k, v)

    def auth_realms(self):
        return _.get(self.all_configs, "auth.realms") or dict()

    def auth_users(self):
        return set(_.get(self.all_configs, "auth.users") or [])

    def retrievers(self) -> dict:
        return _.get(self.all_configs, "retrievers") or dict()
