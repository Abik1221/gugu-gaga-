from __future__ import annotations

from typing import Callable, Optional

from fastapi import Depends, HTTPException, Request, status

from app.services.rate_limit import allow
from app.deps.auth import get_current_user


def rate_limit(scope: str, identify_by: str = "user", per_minute: Optional[int] = None) -> Callable:
    """Dependency factory for per-scope rate limits.
    identify_by: "user" -> current_user.id if available via request.state; else None
                 "ip"   -> client host
                 "custom" -> requires caller to pass identifier via dependency override (not used here)
    per_minute: Override default rate limit for this scope
    """

    def _dep(request: Request):
        identifier: Optional[str] = None
        if identify_by == "ip":
            identifier = request.client.host if request.client else None
        # For user-scoped endpoints we will pass explicit identifiers where needed.
        if not allow(scope=scope, identifier=identifier, per_minute=per_minute):
            raise HTTPException(status_code=status.HTTP_429_TOO_MANY_REQUESTS, detail="Rate limit exceeded")
        return True

    return _dep


def rate_limit_user(scope: str) -> Callable:
    def _dep(current_user=Depends(get_current_user)):
        identifier = str(current_user.id)
        if not allow(scope=scope, identifier=identifier):
            raise HTTPException(status_code=status.HTTP_429_TOO_MANY_REQUESTS, detail="Rate limit exceeded")
        return True

    return _dep
