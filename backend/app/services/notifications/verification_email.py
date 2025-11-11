"""Helper functions for sending verification emails."""

from app.services.notifications.email import send_email
from app.services.notifications.email_templates import get_verification_email_template, get_notification_email_template


def send_verification_email(email: str, code: str, purpose: str) -> bool:
    """Send a professional verification email with the given code and purpose."""
    subject, html_body = get_verification_email_template(code, purpose, email)
    
    # Plain text fallback
    plain_text = f"""
Zemen Pharma - {subject}

Your verification code is: {code}

This code expires in 10 minutes.

If you didn't request this code, please ignore this email.

Best regards,
Zemen Pharma Team
"""
    
    return send_email(email, subject, plain_text, html_body=html_body)


def send_notification_email(email: str, title: str, message: str, action_url: str = None) -> bool:
    """Send a professional notification email."""
    subject, html_body = get_notification_email_template(title, message, action_url)
    
    # Plain text fallback
    plain_text = f"""
{title}

{message}

Best regards,
Zemen Pharma Team
"""
    
    return send_email(email, subject, plain_text, html_body=html_body)