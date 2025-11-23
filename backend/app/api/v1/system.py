import psutil
from fastapi import APIRouter, Depends, HTTPException, status, Body
from sqlalchemy.orm import Session
from sqlalchemy import text
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

from app.db.deps import get_db
from app.deps.auth import require_role
from app.core.roles import Role
from app.models.system import SystemSetting, Announcement
from app.services.redis_client import get_redis

router = APIRouter(prefix="/system", tags=["system"])

class SystemHealth(BaseModel):
    cpu_percent: float
    memory_percent: float
    disk_percent: float
    db_status: str
    redis_status: str

class SystemSettingSchema(BaseModel):
    key: str
    value: str
    description: Optional[str] = None
    updated_at: Optional[datetime] = None

class SystemSettingUpdate(BaseModel):
    value: str
    description: Optional[str] = None

class AnnouncementSchema(BaseModel):
    id: int
    title: str
    content: str
    target_audience: str
    is_active: bool
    created_at: datetime
    expires_at: Optional[datetime] = None

class AnnouncementCreate(BaseModel):
    title: str
    content: str
    target_audience: str = "all"
    is_active: bool = True
    expires_at: Optional[datetime] = None

@router.get("/health", response_model=SystemHealth)
def get_system_health(
    _=Depends(require_role(Role.admin)),
    db: Session = Depends(get_db),
):
    # System metrics
    # interval=0.1 ensures we get a meaningful value, blocking for 100ms
    cpu = psutil.cpu_percent(interval=0.1)
    mem = psutil.virtual_memory().percent
    disk = psutil.disk_usage('/').percent

    # DB Status
    try:
        db.execute(text("SELECT 1"))
        db_status = "connected"
    except Exception:
        db_status = "disconnected"

    # Redis Status
    redis_client = get_redis()
    if redis_client:
        try:
            redis_client.ping()
            redis_status = "connected"
        except Exception:
            redis_status = "disconnected"
    else:
        redis_status = "not_configured"

    return SystemHealth(
        cpu_percent=cpu,
        memory_percent=mem,
        disk_percent=disk,
        db_status=db_status,
        redis_status=redis_status
    )

@router.get("/settings", response_model=List[SystemSettingSchema])
def get_system_settings(
    _=Depends(require_role(Role.admin)),
    db: Session = Depends(get_db),
):
    return db.query(SystemSetting).all()

@router.put("/settings/{key}", response_model=SystemSettingSchema)
def update_system_setting(
    key: str,
    payload: SystemSettingUpdate,
    _=Depends(require_role(Role.admin)),
    db: Session = Depends(get_db),
):
    setting = db.query(SystemSetting).filter(SystemSetting.key == key).first()
    if not setting:
        setting = SystemSetting(key=key, value=payload.value, description=payload.description)
        db.add(setting)
    else:
        setting.value = payload.value
        if payload.description is not None:
            setting.description = payload.description
    db.commit()
    db.refresh(setting)
    return setting

@router.get("/announcements", response_model=List[AnnouncementSchema])
def get_announcements(
    _=Depends(require_role(Role.admin)),
    db: Session = Depends(get_db),
):
    return db.query(Announcement).order_by(Announcement.created_at.desc()).all()

@router.post("/announcements", response_model=AnnouncementSchema)
def create_announcement(
    payload: AnnouncementCreate,
    _=Depends(require_role(Role.admin)),
    db: Session = Depends(get_db),
):
    announcement = Announcement(
        title=payload.title,
        content=payload.content,
        target_audience=payload.target_audience,
        is_active=payload.is_active,
        expires_at=payload.expires_at
    )
    db.add(announcement)
    db.commit()
    db.refresh(announcement)
    return announcement

@router.delete("/announcements/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_announcement(
    id: int,
    _=Depends(require_role(Role.admin)),
    db: Session = Depends(get_db),
):
    announcement = db.query(Announcement).filter(Announcement.id == id).first()
    if not announcement:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Announcement not found")
    db.delete(announcement)
    db.commit()
