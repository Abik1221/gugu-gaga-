#!/usr/bin/env bash
set -euo pipefail

# Wait for the database to be ready
python /app/wait_for_db.py

# Run migrations if available; if none exist yet, fallback to creating tables
if alembic upgrade head; then
  echo "Alembic migrations applied."
else
  echo "Alembic upgrade failed or no migrations found. Attempting metadata create_all fallback..."
  python - <<'PY'
from app.db.session import Base, get_engine
engine = get_engine()
Base.metadata.create_all(bind=engine)
print("Created tables via metadata.create_all fallback.")
PY
fi

# Start the API server
exec uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 2
