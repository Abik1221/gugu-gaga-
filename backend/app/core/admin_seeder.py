import os
from sqlalchemy.orm import Session
from app.models.user import User
from app.core.security import hash_password
from app.core.roles import Role


def seed_admin_user(db: Session) -> bool:
    """Seed admin user from environment variables if not exists"""
    admin_email = os.getenv("ADMIN_EMAIL")
    admin_password = os.getenv("ADMIN_PASSWORD")
    
    if not admin_email or not admin_password:
        return False
    
    # Check if admin already exists
    existing_admin = db.query(User).filter(
        User.email == admin_email,
        User.role == Role.admin.value
    ).first()
    
    if existing_admin:
        print(f"Admin user {admin_email} already exists")
        return True
    
    # Create admin user
    admin_user = User(
        email=admin_email,
        password_hash=hash_password(admin_password),
        role=Role.admin.value,
        is_active=True,
        is_approved=True,
        is_verified=True
    )
    
    db.add(admin_user)
    db.commit()
    db.refresh(admin_user)
    
    print(f"✅ Admin user created: {admin_email}")
    return True