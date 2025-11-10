import os
import sys
import time
from sqlalchemy import create_engine, text

DB_URL = os.getenv("DATABASE_URL")
if not DB_URL or DB_URL.startswith("sqlite"):
    # No remote DB or using sqlite; nothing to wait for
    sys.exit(0)

attempts = 0
while True:
    attempts += 1
    try:
        engine = create_engine(DB_URL)
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        print("Database is ready.")
        sys.exit(0)
    except Exception as e:
        print(f"Waiting for database... attempt {attempts}: {e}")
        time.sleep(2)
