import os
import re

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

    def load(self, config_path: str = None):
        if not config_path:
            config_path = os.getenv("CONFIG_PATH") or "config.yaml"
        print(f"Loading config from {config_path}")
        with open(config_path) as stream:
            yaml.add_implicit_resolver("!path", self.path_matcher)
            yaml.add_constructor("!path", self.path_constructor)
            self.all_configs = yaml.load(stream, Loader=yaml.FullLoader)
            return self

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
