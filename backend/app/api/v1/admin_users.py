from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.core.roles import Role
from app.core.security import hash_password
from app.db.deps import get_db
from app.deps.auth import get_current_user
from app.models.user import User
from app.schemas.admin import AdminUserCreate, AdminUserOut
from app.services.tenant_activity import log_activity

router = APIRouter(prefix="/admin/users", tags=["admin"])

def require_admin(current_user: User = Depends(get_current_user)):
    if current_user.role != Role.admin.value:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin access required")
    return current_user

@router.post("", response_model=AdminUserOut)
def create_admin_user(
    user_data: AdminUserCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    # Check if email already exists
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")
    
    # Create new user
    new_user = User(
        email=user_data.email,
        password_hash=hash_password(user_data.password),
        role=user_data.role,
        first_name=user_data.first_name,
        last_name=user_data.last_name,
        is_active=True,
        is_approved=True,
        is_verified=True,
        tenant_id=None if user_data.role == Role.admin.value else user_data.tenant_id
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Log activity
    log_activity(
        db,
        tenant_id="system",
        actor_user_id=current_user.id,
        action="admin.user.created",
        message=f"Created {user_data.role} user: {user_data.email}",
        target_type="user",
        target_id=str(new_user.id)
    )
    
    return AdminUserOut(
        id=new_user.id,
        email=new_user.email,
        role=new_user.role,
        first_name=new_user.first_name,
        last_name=new_user.last_name,
        is_active=new_user.is_active,
        is_approved=new_user.is_approved,
        is_verified=new_user.is_verified,
        created_at=new_user.created_at
    )

@router.get("", response_model=List[AdminUserOut])
def list_users(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    users = db.query(User).filter(User.role.in_([Role.admin.value, Role.pharmacy_owner.value, Role.cashier.value])).all()
    
    return [
        AdminUserOut(
            id=user.id,
            email=user.email,
            role=user.role,
            first_name=user.first_name,
            last_name=user.last_name,
            is_active=user.is_active,
            is_approved=user.is_approved,
            is_verified=user.is_verified,
            created_at=user.created_at
        )
        for user in users
    ]