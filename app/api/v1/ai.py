from fastapi import APIRouter, Depends, HTTPException, status

from app.deps.auth import get_current_user
from app.deps.tenant import require_tenant, enforce_user_tenant, enforce_subscription_active
from app.schemas.ai import PromptRequest
from app.services.ai.gemini import GeminiClient
from app.deps.ratelimit import rate_limit_user

router = APIRouter(prefix="/ai", tags=["ai"])


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
