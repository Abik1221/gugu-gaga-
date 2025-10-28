from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.roles import Role
from app.db.deps import get_db
from app.deps.auth import get_current_user, require_role
from app.models.user import User
from app.schemas.tenant_activity import TenantActivityOut
from app.services.tenant_activity import list_activity

router = APIRouter(prefix="/tenant", tags=["tenant"])


@router.get("/activity", response_model=List[TenantActivityOut])
def tenant_activity_feed(
    actions: Optional[List[str]] = Query(default=None, alias="action"),
    limit: int = Query(default=50, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
    current_user: User = Depends(require_role(Role.pharmacy_owner)),
    db: Session = Depends(get_db),
):
    if not current_user.tenant_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User is not attached to a tenant")

    records = list_activity(
        db,
        tenant_id=current_user.tenant_id,
        limit=limit,
        offset=offset,
        action_filter=actions,
    )

    return [TenantActivityOut.model_validate(record) for record in records]
