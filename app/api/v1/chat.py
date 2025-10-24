from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.deps.auth import get_current_user
from app.deps.tenant import require_tenant, enforce_subscription_active
from app.db.deps import get_db
from app.models.chat import ChatThread, ChatMessage
from app.schemas.chat import ThreadCreate, ThreadOut, MessageCreate, MessageOut
from app.services.chat.orchestrator import process_message
from app.deps.ratelimit import rate_limit_user

router = APIRouter(prefix="/chat", tags=["ai"])


@router.post("/threads", response_model=ThreadOut)
def create_thread(
    payload: ThreadCreate,
    tenant_id: str = Depends(require_tenant),
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
    _sub=Depends(enforce_subscription_active),
):
    thread = ChatThread(tenant_id=tenant_id, owner_user_id=current_user.id, title=payload.title)
    db.add(thread)
    db.commit()
    db.refresh(thread)
    return ThreadOut(id=thread.id, title=thread.title)


@router.get("/threads/{thread_id}/messages")
def list_messages(
    thread_id: int,
    tenant_id: str = Depends(require_tenant),
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
    _sub=Depends(enforce_subscription_active),
):
    # Simple ownership/tenant check
    thread = (
        db.query(ChatThread)
        .filter(ChatThread.id == thread_id, ChatThread.tenant_id == tenant_id, ChatThread.owner_user_id == current_user.id)
        .first()
    )
    if not thread:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Thread not found")
    messages = (
        db.query(ChatMessage)
        .filter(ChatMessage.thread_id == thread_id, ChatMessage.tenant_id == tenant_id)
        .order_by(ChatMessage.id.asc())
        .all()
    )
    return [{"id": m.id, "role": m.role, "content": m.content} for m in messages]


@router.post("/threads/{thread_id}/messages")
def send_message(
    thread_id: int,
    payload: MessageCreate,
    tenant_id: str = Depends(require_tenant),
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
    _rl=Depends(rate_limit_user("chat_send_user")),
    _sub=Depends(enforce_subscription_active),
):
    thread = (
        db.query(ChatThread)
        .filter(ChatThread.id == thread_id, ChatThread.tenant_id == tenant_id, ChatThread.owner_user_id == current_user.id)
        .first()
    )
    if not thread:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Thread not found")

    result = process_message(
        db,
        tenant_id=tenant_id,
        user_id=current_user.id,
        thread_id=thread_id,
        prompt=payload.prompt,
    )
    return result
