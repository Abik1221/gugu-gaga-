from __future__ import annotations

from typing import Any, Dict

import json
import requests
from app.core.settings import settings
from app.services.rate_limit import allow


class GeminiClient:
    def __init__(self):
        self.api_key = settings.gemini_api_key
        self.base_url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent"

    def is_configured(self) -> bool:
        return bool(self.api_key)

    def ask(self, prompt: str, scope: str, user_id: str | None) -> Dict[str, Any]:
        if not allow(scope=scope, identifier=user_id, limit_per_minute=settings.rate_limit_gemini_per_minute):
            return {"error": "rate_limited"}
        if not self.is_configured():
            return {"answer": f"[stubbed] You asked: {prompt}", "model": "gemini-stub"}
        
        try:
            headers = {"Content-Type": "application/json"}
            payload = {
                "contents": [{
                    "parts": [{"text": prompt}]
                }],
                "generationConfig": {
                    "temperature": 0.1,
                    "maxOutputTokens": 1000,
                    "topP": 0.8
                }
            }
            
            response = requests.post(
                f"{self.base_url}?key={self.api_key}",
                headers=headers,
                json=payload,
                timeout=30
            )
            
            if response.status_code == 200:
                data = response.json()
                if "candidates" in data and data["candidates"]:
                    content = data["candidates"][0]["content"]["parts"][0]["text"]
                    return {"answer": content.strip(), "model": "gemini-1.5-flash"}
            
            return {"error": f"API error: {response.status_code}", "model": "gemini"}
            
        except Exception as e:
            return {"error": f"Request failed: {str(e)}", "model": "gemini"}
