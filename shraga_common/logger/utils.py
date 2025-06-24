import platform
import socket
import subprocess

from user_agents import parse

from shraga_common.shraga_config import ShragaConfig
from shraga_common.utils import is_prod_env


def get_git_commit():
    try:
        # Run git command to get the short commit hash
        commit_hash = (
            subprocess.check_output(["git", "rev-parse", "--short", "HEAD"])
            .strip()
            .decode("utf-8")
        )
        return commit_hash
    except subprocess.CalledProcessError:
        return None


def get_git_branch():
    try:
        # Run git command to get the current branch name
        branch_name = (
            subprocess.check_output(["git", "rev-parse", "--abbrev-ref", "HEAD"])
            .strip()
            .decode("utf-8")
        )
        return branch_name
    except subprocess.CalledProcessError:
        return None


def get_user_agent_info(user_agent: str):
    if not user_agent:
        return None

    ua = parse(user_agent)
    device_type = (
        "pc"
        if ua.is_pc
        else "tablet" if ua.is_tablet else "mobile" if ua.is_mobile else "other"
    )

    return {
        "browser": ua.browser.family,
        "browser_version": ua.browser.version_string,
        "os": ua.os.family,
        "os_version": ua.os.version_string,
        "device": ua.device.family,
        "device_type": device_type,
        "device_brand": ua.device.brand,
        "device_model": ua.device.model,
        "original": user_agent,
    }


def get_platform_info():
    return {
        "system": platform.system(),
        "node_name": platform.node(),
        "release": platform.release(),
        "version": platform.version(),
        "architecture": platform.architecture(),
        "processor": platform.processor(),
        "platform_details": platform.platform(),
        "python_version": platform.python_version(),
        "machine_name": socket.gethostname(),
        "git_commit": get_git_commit(),
        "git_branch": get_git_branch(),
    }


def get_config_info(shraga_config: ShragaConfig):
    return {
        "debug.enabled": shraga_config.get("debug.enabled"),
        "ui.default_flow": shraga_config.get("ui.default_flow"),
        "prod": is_prod_env(),
    }
