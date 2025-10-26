#!/usr/bin/env python3
"""Utility script to create or update an admin user in the database."""

from __future__ import annotations

import argparse
import secrets
import string
import sys
from pathlib import Path

# Ensure the backend package is importable when running this file directly
PROJECT_ROOT = Path(__file__).resolve().parents[1]
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from app.core.roles import Role  # noqa: E402
from app.core.security import hash_password  # noqa: E402
from app.db.session import Base, SessionLocal, get_engine  # noqa: E402
from app.models.user import User  # noqa: E402


def generate_email(domain: str) -> str:
    """Generate a unique admin email using the current timestamp."""
    from datetime import datetime

    timestamp = datetime.utcnow().strftime("%Y%m%d%H%M%S")
    return f"admin+{timestamp}@{domain}"


def generate_password(length: int) -> str:
    """Generate a password that includes upper/lowercase letters, digits, and symbols."""
    alphabet = string.ascii_letters + string.digits + "!@#$%^&*()-_=+"
    while True:
        password = "".join(secrets.choice(alphabet) for _ in range(length))
        if (
            any(c.islower() for c in password)
            and any(c.isupper() for c in password)
            and any(c.isdigit() for c in password)
            and any(c in "!@#$%^&*()-_=+" for c in password)
        ):
            return password


def ensure_schema(create_tables: bool) -> None:
    """Optionally create database tables before inserting records."""
    if create_tables:
        engine = get_engine()
        Base.metadata.create_all(bind=engine)


def upsert_admin(email: str, password: str, force_update: bool) -> str:
    """Create a new admin or update the existing one if force_update is True."""
    session = SessionLocal()
    try:
        user = session.query(User).filter(User.email == email).first()
        password_hash = hash_password(password)

        if user:
            if not force_update:
                return "exists"
            user.password_hash = password_hash
            user.role = Role.admin.value
            user.is_active = True
            user.is_verified = True
            user.is_approved = True
            session.add(user)
            session.commit()
            return "updated"

        user = User(
            email=email,
            password_hash=password_hash,
            role=Role.admin.value,
            is_active=True,
            is_verified=True,
            is_approved=True,
        )
        session.add(user)
        session.commit()
        return "created"
    finally:
        session.close()


def main() -> None:
    parser = argparse.ArgumentParser(description="Create or update an admin user.")
    parser.add_argument("--email", help="Admin email. If omitted, one is generated with the provided domain.")
    parser.add_argument("--domain", default="example.com", help="Domain to use when auto-generating the email.")
    parser.add_argument("--password", help="Admin password. If omitted, a secure one is generated.")
    parser.add_argument("--length", type=int, default=20, help="Password length when auto-generating.")
    parser.add_argument(
        "--force",
        action="store_true",
        help="Update the existing admin if the email already exists.",
    )
    parser.add_argument(
        "--create-tables",
        action="store_true",
        help="Create tables before inserting (useful for fresh databases).",
    )
    args = parser.parse_args()

    ensure_schema(args.create_tables)

    email = args.email or generate_email(args.domain)
    password = args.password or generate_password(args.length)

    outcome = upsert_admin(email=email, password=password, force_update=args.force)

    if outcome == "exists":
        print(f"Admin with email {email} already exists. Use --force to update the password.")
    else:
        action = "created" if outcome == "created" else "updated"
        print(f"Admin {action} successfully.")
        print(f"ADMIN_EMAIL={email}")
        print(f"ADMIN_PASSWORD={password}")


if __name__ == "__main__":
    main()
