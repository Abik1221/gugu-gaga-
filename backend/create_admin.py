#!/usr/bin/env python3
"""
Script to generate admin credentials and store them in the database.
"""

import secrets
import string
import sys
import os
from pathlib import Path

# Add the backend directory to Python path
backend_dir = Path(__file__).parent
sys.path.insert(0, str(backend_dir))

# Import your backend modules
try:
    from app.db.session import SessionLocal
    from app.models.user import User
    from app.core.security import hash_password
except ImportError as e:
    print(f"Error importing backend modules: {e}")
    print("Please ensure the backend is properly set up and imports are correct.")
    sys.exit(1)

def get_db_session():
    """Get a database session."""
    return SessionLocal()

def generate_password(length=12):
    """Generate a secure random password."""
    characters = string.ascii_letters + string.digits + "!@#$%^&*"
    return ''.join(secrets.choice(characters) for _ in range(length))

def generate_admin_email():
    """Generate a default admin email."""
    return "admin@zemensystem.com"

def create_admin_user(email=None, password=None):
    """Create an admin user in the database."""
    if not email:
        email = generate_admin_email()
    if not password:
        password = generate_password()

    session = get_db_session()
    try:
        # Check if admin already exists
        existing_admin = session.query(User).filter(
            User.email == email,
            User.role == 'admin'
        ).first()

        if existing_admin:
            print(f"Admin user with email '{email}' already exists.")
            return False

        # Create new admin user
        hashed_password = hash_password(password)

        admin_user = User(
            email=email,
            password_hash=hashed_password,
            role='admin',
            is_active=True,
            is_approved=True,
            is_verified=True,
            # tenant_id can be None for admin
        )

        session.add(admin_user)
        session.commit()

        print("Admin user created successfully!")
        print(f"Email: {email}")
        print(f"Password: {password}")
        print("IMPORTANT: Save these credentials securely and change the password after first login.")

        return True

    except Exception as e:
        session.rollback()
        print(f"Error creating admin user: {e}")
        return False
    finally:
        session.close()

def main():
    """Main function to run the script."""
    print("Admin User Creation Script")
    print("=" * 30)

    # Ask for email and password or use defaults
    use_defaults = input("Use default admin email and generate random password? (y/n): ").lower().strip()

    if use_defaults == 'y':
        email = None
        password = None
    else:
        email = input("Enter admin email (leave blank for default): ").strip() or None
        password = input("Enter admin password (leave blank to generate): ").strip() or None

    success = create_admin_user(email, password)
    if success:
        print("\nAdmin user setup complete!")
    else:
        print("\nFailed to create admin user.")

if __name__ == "__main__":
    main()
