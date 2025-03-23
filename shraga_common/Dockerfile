FROM --platform=linux/amd64 python:3.11 as base

WORKDIR /app/

ENV POETRY_HOME=/opt/poetry
EXPOSE 8000

RUN apt-get update && apt-get install -y python3-cffi \
    && apt-get remove -y libpq-dev libtiff-dev imagemagick mariadb-common \
    && apt-get autoremove -y \
    && apt-get autoclean clean

# Install Poetry
RUN curl -sSL https://install.python-poetry.org | python3 - --version 1.7.0

RUN cd /usr/local/bin && \
    ln -s /opt/poetry/bin/poetry && \
    poetry config virtualenvs.create false

# Copy poetry.lock* in case it doesn't exist in the repo
COPY ./pyproject.toml ./poetry.lock* /app/
RUN poetry install --no-root --compile

COPY . /app
RUN rm -rf /app/frontend
ENV PYTHONPATH=/app

# Build stage for the React app
FROM node:20 AS frontend-builder

WORKDIR /app/

COPY ./frontend/package.json ./frontend/pnpm-lock.yaml /app/frontend/
RUN cd frontend && npm install -g pnpm && pnpm install

COPY ./frontend /app/frontend/

RUN cd frontend && pnpm run build

# Final stage for the complete application
FROM base

# Copy the built React app to the final image
COPY --from=frontend-builder /app/frontend/dist/ /app/frontend/dist/

ENV SHRAGA_FLOWS_PATH=flows
ARG buildtime_BUILD_TAG=''
ENV SHRAGA_BUILD_TAG=$buildtime_BUILD_TAG

CMD ["python", "/app/main.py"]