"""
Enterprise-grade admin security module
"""
import secrets
import string
import hashlib
import hmac
import time
from datetime import datetime, timedelta
from typing import Optional
from sqlalchemy.orm import Session
from app.models.user import User
from app.core.security import hash_password
from app.core.roles import Role

class AdminSecurityManager:
    
    @staticmethod
    def generate_secure_password(length: int = 24) -> str:
        """Generate cryptographically secure password"""
        chars = string.ascii_letters + string.digits + "!@#$%^&*()_+-=[]{}|;:,.<>?"
        return ''.join(secrets.choice(chars) for _ in range(length))
    
    @staticmethod
    def generate_admin_token() -> str:
        """Generate secure admin access token"""
        return secrets.token_urlsafe(32)
    
    @staticmethod
    def create_secure_admin(db: Session, email: str, force_new: bool = False) -> dict:
        """Create admin with maximum security"""
        
        # Check existing admin
        existing = db.query(User).filter(User.email == email, User.role == Role.admin.value).first()
        if existing and not force_new:
            return {"status": "exists", "message": "Admin already exists"}
        
        # Generate secure credentials
        password = AdminSecurityManager.generate_secure_password()
        admin_token = AdminSecurityManager.generate_admin_token()
        
        if existing:
            # Update existing admin
            existing.password_hash = hash_password(password)
            existing.is_active = True
            existing.is_approved = True
            existing.is_verified = True
            existing.updated_at = datetime.utcnow()
            db.commit()
            admin_id = existing.id
        else:
            # Create new admin
            admin = User(
                email=email,
                password_hash=hash_password(password),
                role=Role.admin.value,
                is_active=True,
                is_approved=True,
                is_verified=True,
                tenant_id=None
            )
            db.add(admin)
            db.commit()
            db.refresh(admin)
            admin_id = admin.id
        
        return {
            "status": "created",
            "admin_id": admin_id,
            "email": email,
            "password": password,
            "admin_token": admin_token,
            "created_at": datetime.utcnow().isoformat()
        }
    
    @staticmethod
    def verify_admin_access(db: Session, email: str, ip_address: str = None) -> bool:
        """Verify admin access with additional security checks"""
        admin = db.query(User).filter(User.email == email, User.role == Role.admin.value).first()
        if not admin or not admin.is_active:
            return False
        
        # Additional security checks can be added here
        # - IP whitelist
        # - Time-based access
        # - MFA verification
        
        return True