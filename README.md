## Shraga

The backend is based on FastAPI and frontend is based on React.

## Backend setup:

Requirements:

1. Python3.11
2. Pip
3. Poetry

Install poetry and add it to $PATH run

```bash
pipx install poetry
```

Once poetry is installed, install dependencies:

```bash
poetry install --no-root
poetry run pre-commit install
```

To activate the virtualenv run the following:

```bash
poetry shell
which python
```


## Running the app

To run the app use:

```bash
SHRAGA_FLOWS_PATH=flows CONFIG_PATH=config.demo.yaml uvicorn main:app --reload

cd frontend
pnpm run dev

```

## demo flow

Run demo flow without an LLM \ Elasticsearch \ Opensearch:

1) use config.demo.yaml for settings
2) To run the backend use:

```bash
SHRAGA_FLOWS_PATH=flows CONFIG_PATH=config.demo.yaml uvicorn main:app --reload
```

