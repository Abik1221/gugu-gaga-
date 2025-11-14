from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.deps.auth import get_current_user
from app.deps.tenant import require_tenant, enforce_user_tenant, enforce_subscription_active
from app.db.deps import get_db
from app.schemas.ai import PromptRequest
from app.services.ai.gemini import GeminiClient
from app.services.chat.orchestrator import process_message, ChatQuotaExceededError
from app.models.chat import ChatThread
from app.deps.ratelimit import rate_limit_user
from pydantic import BaseModel

router = APIRouter(prefix="/ai", tags=["ai"])

class AgentRequest(BaseModel):
    message: str


@router.post("/ask")
def ask_ai(
    payload: PromptRequest,
    tenant_id: str = Depends(require_tenant),
    current_user=Depends(get_current_user),
    _rl=Depends(rate_limit_user("ai_ask_user")),
    _ten=Depends(enforce_user_tenant),
    _sub=Depends(enforce_subscription_active),
):
    client = GeminiClient()
    if not client.is_configured():
        # Allow stubbed behavior, but notify missing key
        return {"warning": "GEMINI_API_KEY not configured", **client.ask(payload.prompt, scope="ai", user_id=str(current_user.id))}

    result = client.ask(payload.prompt, scope="ai", user_id=str(current_user.id))
    if "error" in result:
        raise HTTPException(status_code=status.HTTP_429_TOO_MANY_REQUESTS, detail="AI rate limit exceeded")
    return result

@router.post("/agent/process")
def process_agent_message(
    payload: AgentRequest,
    db: Session = Depends(get_db),
    tenant_id: str = Depends(require_tenant),
    current_user=Depends(get_current_user),
    _rl=Depends(rate_limit_user("ai_agent_user")),
    _ten=Depends(enforce_user_tenant),
):
    try:
        # Get or create default thread for this user
        thread = db.query(ChatThread).filter(
            ChatThread.tenant_id == tenant_id,
            ChatThread.user_id == current_user.id
        ).first()
        
        if not thread:
            thread = ChatThread(
                tenant_id=tenant_id,
                user_id=current_user.id,
                title="AI Assistant Chat"
            )
            db.add(thread)
            db.commit()
            db.refresh(thread)
        
        result = process_message(
            db,
            tenant_id=tenant_id,
            user_id=current_user.id,
            thread_id=thread.id,
            prompt=payload.message,
            user_role=getattr(current_user, 'role', 'user')
        )
        
        # Extract just the answer for clean response
        response_text = result.get("answer", "I'm sorry, I couldn't process your request.")
        
        return {"response": response_text}
        
    except ChatQuotaExceededError as e:
        raise HTTPException(status_code=status.HTTP_402_PAYMENT_REQUIRED, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Agent processing failed")
