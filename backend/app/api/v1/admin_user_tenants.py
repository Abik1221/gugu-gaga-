from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.roles import Role
from app.db.deps import get_db
from app.deps.auth import require_role, get_current_user
from app.deps.ratelimit import rate_limit_user
from app.models.user_tenant import UserTenant
from app.models.user import User

router = APIRouter(prefix="/admin/user-tenants", tags=["admin"])


@router.post("")
def link_user_tenant(
    user_id: int,
    tenant_id: str,
    role_override: str | None = None,
    user=Depends(require_role(Role.admin)),
    db: Session = Depends(get_db),
    _rl=Depends(rate_limit_user("admin_ut_link_user")),
):
    exists = (
        db.query(UserTenant)
        .filter(UserTenant.user_id == user_id, UserTenant.tenant_id == tenant_id)
        .first()
    )
    if exists:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Link already exists")
    # Ensure user exists
    u = db.query(User).filter(User.id == user_id).first()
    if not u:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    link = UserTenant(user_id=user_id, tenant_id=tenant_id, role_override=role_override or None)
    db.add(link)
    db.commit()
    db.refresh(link)
    return {
        "id": link.id,
        "user_id": link.user_id,
        "tenant_id": link.tenant_id,
        "role_override": link.role_override,
        "is_approved": link.is_approved,
    }


@router.get("")
def list_user_tenants(
    user=Depends(require_role(Role.admin)),
    db: Session = Depends(get_db),
    user_id: int | None = None,
    tenant_id: str | None = None,
    _rl=Depends(rate_limit_user("admin_ut_list_user")),
):
    q = db.query(UserTenant)
    if user_id is not None:
        q = q.filter(UserTenant.user_id == user_id)
    if tenant_id is not None:
        q = q.filter(UserTenant.tenant_id == tenant_id)
    rows = q.order_by(UserTenant.id.desc()).limit(200).all()
    return [
        {
            "id": r.id,
            "user_id": r.user_id,
            "tenant_id": r.tenant_id,
            "role_override": r.role_override,
            "is_approved": r.is_approved,
        }
        for r in rows
    ]


@router.delete("/{link_id}")
def unlink_user_tenant(
    link_id: int,
    user=Depends(require_role(Role.admin)),
    db: Session = Depends(get_db),
    _rl=Depends(rate_limit_user("admin_ut_unlink_user")),
):
    link = db.query(UserTenant).filter(UserTenant.id == link_id).first()
    if not link:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Link not found")
    db.delete(link)
    db.commit()
    return {"status": "deleted"}


@router.post("/{link_id}/approve")
def approve_user_tenant(
    link_id: int,
    user=Depends(require_role(Role.admin)),
    db: Session = Depends(get_db),
    _rl=Depends(rate_limit_user("admin_ut_approve_user")),
):
    link = db.query(UserTenant).filter(UserTenant.id == link_id).first()
    if not link:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Link not found")
    link.is_approved = True
    db.add(link)
    db.commit()
    return {"id": link.id, "is_approved": link.is_approved}


@router.post("/{link_id}/reject")
def reject_user_tenant(
    link_id: int,
    user=Depends(require_role(Role.admin)),
    db: Session = Depends(get_db),
    _rl=Depends(rate_limit_user("admin_ut_reject_user")),
):
    link = db.query(UserTenant).filter(UserTenant.id == link_id).first()
    if not link:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Link not found")
    link.is_approved = False
    db.add(link)
    db.commit()
    return {"id": link.id, "is_approved": link.is_approved}
