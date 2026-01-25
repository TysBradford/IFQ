# IFQ Backend

FastAPI backend for the IFQ project.

## Setup

### Prerequisites
- Python 3.12+
- Poetry

### Installation

```bash
# Install dependencies
poetry install

# Activate virtual environment
poetry shell
```

### Environment Variables

Create a `.env` file:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
```

## Development

### Running the server

```bash
poetry run uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`.

### API Documentation

- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

### Testing

```bash
poetry run pytest
```

### Linting

```bash
poetry run ruff check .
poetry run mypy app
```

## Deployment

Deployed to Vercel. See `vercel.json` for configuration.
