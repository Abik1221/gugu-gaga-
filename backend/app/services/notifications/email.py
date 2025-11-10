from __future__ import annotations

import logging
import smtplib
import ssl
from email.message import EmailMessage
from typing import Optional

from app.core.settings import settings


logger = logging.getLogger(__name__)


def send_email(to: str, subject: str, body: str, from_addr: Optional[str] = None) -> bool:
    if not settings.email_enabled:
        logger.warning("⚠️ EMAIL DISABLED - Would send to %s: %s", to, subject)
        return False

    host = settings.smtp_host
    username = settings.smtp_username
    password = settings.smtp_password

    if not host or not username or not password:
        logger.error("❌ EMAIL ENABLED but SMTP credentials missing! host=%s, user=%s, pass=%s", host, username, "***" if password else None)
        raise RuntimeError("Email is enabled but SMTP credentials are missing")

    sender = from_addr or settings.email_from or username

    message = EmailMessage()
    message["From"] = sender
    message["To"] = to
    message["Subject"] = subject
    message.set_content(body)

    try:
        with smtplib.SMTP(host, settings.smtp_port, timeout=30) as smtp:
            smtp.ehlo()
            if settings.smtp_use_tls:
                context = ssl.create_default_context()
                smtp.starttls(context=context)
                smtp.ehlo()
            sanitized_password = password.replace(" ", "")
            smtp.login(username, sanitized_password)
            smtp.send_message(message)
        logger.info("Email sent to %s with subject '%s'", to, subject)
        return True
    except Exception:
        logger.exception("Failed to send email to %s with subject '%s'", to, subject)
        raise
