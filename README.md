# Shraga

Shraga is a modern AI application with a backend based on FastAPI and a frontend built with React.

## Installation and Setup

### Requirements

1. Python 3.11 or higher
2. Pip
3. Poetry (for dependency management)
4. Node.js and pnpm (for frontend)

### Backend Setup

First, install Poetry if you don't have it already:

```bash
pipx install poetry
```

Clone the repository and install dependencies:

```bash
git clone <repository-url>
cd shraga
poetry install --no-root
poetry run pre-commit install
```

To activate the virtual environment:

```bash
poetry shell
which python  # Verify the correct Python interpreter is being used
```

## Running the Application

### Backend

To run the backend server with hot-reloading enabled:

```bash
SHRAGA_FLOWS_PATH=flows CONFIG_PATH=config.demo.yaml uvicorn main:app --reload
```

### Frontend

To run the frontend development server:

```bash
cd frontend
pnpm install  # Only needed first time or when dependencies change
pnpm run dev
```

By default, the frontend will be available at http://localhost:5000 and will connect to the backend API running on http://localhost:8000.

## Configuration

Shraga uses YAML configuration files to manage its settings. The repository includes:

- `config.example.yaml`: A template configuration file with documentation

You can specify which configuration file to use with the `CONFIG_PATH` environment variable.

## Demo Flow

To run the demo flow without requiring an LLM, Elasticsearch, or Opensearch:

1. Use the demo configuration file:
   ```bash
   export CONFIG_PATH=config.demo.yaml
   ```

2. Run the backend with the demo flows:
   ```bash
   export SHRAGA_FLOWS_PATH=flows
   uvicorn main:app --reload
   ```

## Development Tools

Several command-line tools are included with this package to help with development and management tasks:

### User Management

```bash
# Create a user with basic authentication (interactive mode)
poetry run create-basic-auth-user

# Create a user with command-line arguments
poetry run create-basic-auth-user <email> <password> <config_file>

# Example
poetry run create-basic-auth-user user@example.com mypassword123 config.demo.yaml
```

This tool will:
- Prompt you to enter a user email address (with validation)
- Securely collect and validate a password
- Ask for the configuration file to update
- Generate a bcrypt hash of the password
- Save the credentials to a text file for reference
- Update the specified configuration file with the new user

### Code Style

This project uses pre-commit hooks to enforce code style. They're installed with:

```bash
poetry run pre-commit install
```

## API Documentation

### Authentication

To authenticate with the API, you need to obtain an auth token using basic authentication.

#### Getting an Auth Token

To get `YOUR_TOKEN_HERE`, encode your credentials using base64:

```bash
# Replace user@domain.com and your_password with actual credentials
echo -n "user@domain.com:your_password" | base64
# This outputs the token to use in the Authorization header
```

### Flow Run API

To generate a response programmatically, use the flow run endpoint:

```bash
curl -X POST "http://myhost/api/flows/run" \
  -H "Content-Type: application/json" \
  -H "Authorization: Basic YOUR_TOKEN_HERE" \
  -d '{
    "flow_id": "flow name",
    "question": "this is my question?"
  }'
```

### Report API

For generating chat reports, use the `/api/report/export` endpoint:

```bash
curl -X POST "http://myhost/api/report/export" \
  -H "Content-Type: application/json" \
  -H "Authorization: Basic YOUR_TOKEN_HERE" \
  -d '{
    "report_type": "history",
    "start": "2025-04-01 00:00:00",
    "end": "2025-06-01 00:00:00",
    "user_id": "user@domain.ltd",
    "user_org": "company_name"
  }'
```

#### Parameters

- `report_type`: "history" (required)
- `start`: "YYYY-MM-DD HH:MM:SS" (optional)
- `end`: "YYYY-MM-DD HH:MM:SS" (optional)
- `user_id`: string (optional)
- `user_org`: string (optional)

#### Prerequisites

The endpoint is available for users with `analytics` permission and `history` must be enabled in config.yaml.

Analytics permission can be configured in config.yaml:

**Option 1: Domain-based access**
```yaml
history:
   enabled: true
   analytics: 
     domains:
       - domain.ltd
```

**Option 2: User-based access**
```yaml
history:
   enabled: true
   analytics: 
      users:
         - username_from_auth.users
```

## Project Structure

- `/shraga_common`: Core library with reusable components
- `/scripts`: Command-line utilities and helper scripts
- `/frontend`: React-based web interface
- `/flows`: Flow definitions for different use cases
- `/terraform`: Infrastructure as code for deployment

## License

This project is licensed under the Apache License 2.0 - see the LICENSE file for details.

