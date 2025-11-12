from __future__ import annotations

import logging
import smtplib
import ssl
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from typing import Optional

from app.core.settings import settings


logger = logging.getLogger(__name__)


def send_email(to: str, subject: str, body: str, from_addr: Optional[str] = None, html_body: Optional[str] = None) -> bool:
    if not settings.email_enabled:
        logger.warning("⚠️ EMAIL DISABLED - Would send to %s: %s", to, subject)
        return False

    host = settings.smtp_host
    username = settings.smtp_username
    password = settings.smtp_password

    if not host or not username or not password:
        logger.error("❌ EMAIL ENABLED but SMTP credentials missing! host=%s, user=%s, pass=%s", host, username, "***" if password else None)
        raise RuntimeError("Email is enabled but SMTP credentials are missing")

    # Use proper sender format with name
    sender_name = "Mesob"
    sender_email = from_addr or settings.email_from or username
    sender = f"{sender_name} <{sender_email}>"

    # Create multipart message for better deliverability
    message = MIMEMultipart('alternative')
    message["From"] = sender
    message["To"] = to
    message["Subject"] = subject
    
    # Add anti-spam headers
    message["Message-ID"] = f"<{hash(to + subject)}.{hash(body)}@mymesob.com>"
    message["X-Mailer"] = "Mesob System"
    message["X-Priority"] = "3"
    message["Importance"] = "Normal"
    
    # Always include plain text version (required to avoid spam)
    text_part = MIMEText(body, 'plain', 'utf-8')
    message.attach(text_part)
    
    # Add HTML version if provided
    if html_body:
        html_part = MIMEText(html_body, 'html', 'utf-8')
        message.attach(html_part)

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
