from __future__ import annotations

import logging
from typing import Optional

from fastapi import APIRouter, Depends, status
from pydantic import BaseModel, EmailStr, Field

from app.core.settings import settings
from app.deps.ratelimit import rate_limit
from app.services.notifications.email import send_email

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/public", tags=["public"])


class ContactRequest(BaseModel):
    name: str = Field(..., min_length=2, max_length=255)
    email: EmailStr
    message: str = Field(..., min_length=5, max_length=2000)


class ContactResponse(BaseModel):
    detail: str
    delivered: bool


@router.post(
    "/contact",
    status_code=status.HTTP_201_CREATED,
    response_model=ContactResponse,
)
async def submit_contact_message(
    payload: ContactRequest,
    _limit=Depends(rate_limit("public_contact", identify_by="ip")),
):
    """Accept contact form submissions from the marketing site."""
    delivered = False

    if settings.email_enabled and settings.email_from:
        recipient: Optional[str] = settings.email_from
        subject = "New contact inquiry — Zemen Pharma"
        body = (
            "A new contact request was submitted from the marketing site.\n\n"
            f"Name: {payload.name}\n"
            f"Email: {payload.email}\n\n"
            "Message:\n"
            f"{payload.message}\n"
        )
        try:
            if recipient:
                delivered = send_email(recipient, subject, body)
        except Exception:
            logger.exception("Failed to forward contact inquiry via email")
    else:
        logger.info(
            "Email delivery disabled. Contact submission recorded for %s <%s>",
            payload.name,
            payload.email,
        )

    return ContactResponse(
        detail="Thanks for reaching out. Our team will follow up shortly.",
        delivered=delivered,
    )
