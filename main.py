import os

import uvicorn

from shraga_common.app import get_config, setup_app

config_path = os.getenv("CONFIG_PATH", "config.demo.yaml")
app = setup_app(config_path)

if __name__ == "__main__":

    # Run uvicorn - this will block the current thread
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=os.environ.get("PORT") or get_config("server.port") or 8000,
        reload=bool(os.environ.get("ENABLE_RELOAD", False)),
        log_config=None,
        server_header=False,
    )
