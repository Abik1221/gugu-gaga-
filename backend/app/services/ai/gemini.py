from __future__ import annotations

from typing import Any, Dict

from app.core.settings import settings
from app.services.rate_limit import allow


class GeminiClient:
    def __init__(self):
        self.api_key = settings.gemini_api_key

    def is_configured(self) -> bool:
        return bool(self.api_key)

    def ask(self, prompt: str, scope: str, user_id: str | None) -> Dict[str, Any]:
        if not allow(scope=scope, identifier=user_id, limit_per_minute=settings.rate_limit_gemini_per_minute):
            return {"error": "rate_limited"}
        if not self.is_configured():
            # Stubbed response when no key is set
            return {"answer": f"[stubbed] You asked: {prompt}", "model": "gemini-stub"}
        # Placeholder for real Gemini API call integration
        # TODO: integrate google-generativeai or REST call with api_key from settings
        return {"answer": f"[not-implemented] You asked: {prompt}", "model": "gemini"}
