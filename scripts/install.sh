#!/bin/bash

# Clear Poetry cache
echo "Clearing Poetry cache..."
poetry cache clear pypi --all

echo "Deleting poetry.lock file..."
rm poetry.lock

# Update all dependencies in pyproject.toml to latest versions
echo "Updating Poetry dependencies to latest versions..."
poetry update --no-cache

# Run poetry install to ensure all dependencies are installed
echo "Running Poetry install without cache..."
poetry install --no-cache --no-root

# Change directory to frontend
echo "Changing directory to frontend..."
cd frontend || exit

# Run pnpm install to install the latest versions of packages
echo "Running pnpm install in frontend..."
pnpm update

echo "Script execution completed!"