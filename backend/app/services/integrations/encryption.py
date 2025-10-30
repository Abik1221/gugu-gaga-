from __future__ import annotations

import base64
from functools import lru_cache
from typing import Optional

from cryptography.fernet import Fernet, InvalidToken

from app.core.settings import settings


class IntegrationEncryptionError(RuntimeError):
    """Raised when integration credential encryption fails."""


@lru_cache()
def get_fernet() -> Fernet:
    key = settings.integration_encryption_key
    if not key:
        raise IntegrationEncryptionError(
            "INTEGRATION_ENCRYPTION_KEY is not configured. Provide a 32-byte base64 key."
        )
    try:
        # Allow providing raw 32-byte strings as well as base64 encoded values.
        if len(key) == 32:
            encoded = base64.urlsafe_b64encode(key.encode("utf-8"))
        else:
            encoded = key.encode("utf-8")
        return Fernet(encoded)
    except Exception as exc:
        raise IntegrationEncryptionError("Invalid integration encryption key") from exc


def encrypt(value: Optional[str]) -> Optional[str]:
    if value is None:
        return None
    token = get_fernet().encrypt(value.encode("utf-8"))
    return token.decode("utf-8")


def decrypt(value: Optional[str]) -> Optional[str]:
    if value is None:
        return None
    try:
        plaintext = get_fernet().decrypt(value.encode("utf-8"))
        return plaintext.decode("utf-8")
    except InvalidToken as exc:
        raise IntegrationEncryptionError("Failed to decrypt credential") from exc
