"""Professional email templates for verification codes and notifications."""

def get_verification_email_template(code: str, purpose: str, user_email: str) -> tuple[str, str, str]:
    """Generate professional email subject, plain text, and HTML body for verification codes."""
    
    # Define purpose-specific content
    purpose_config = {
        "register": {
            "subject": "Your Mesob verification code",
            "title": "Account Verification",
            "message": "Welcome to Mesob! Please verify your email to complete registration.",
            "action": "Complete Registration"
        },
        "login": {
            "subject": "Your Mesob login code",
            "title": "Login Verification",
            "message": "Please use this code to complete your login to Mesob.",
            "action": "Complete Login"
        },
        "password_reset": {
            "subject": "Your Mesob password reset code",
            "title": "Password Reset",
            "message": "Use this code to reset your Mesob password.",
            "action": "Reset Password"
        }
    }
    
    config = purpose_config.get(purpose, purpose_config["register"])
    
    # Plain text version (required for spam prevention)
    plain_text = f"""
Mesob - {config['title']}

{config['message']}

Your verification code: {code}

This code expires in {"30 minutes" if purpose == "password_reset" else "10 minutes"}.

If you didn't request this, please ignore this email.

For support, contact: support@mymesob.com

--
Mesob Team
https://mymesob.com
"""
    
    # Clean, minimal HTML version
    html_body = f"""
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>{config['subject']}</title>
</head>
<body style="font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f9f9f9;">
    <div style="max-width: 500px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 8px;">
        <h1 style="color: #333; font-size: 24px; margin-bottom: 20px;">Mesob</h1>
        
        <h2 style="color: #555; font-size: 18px; margin-bottom: 15px;">{config['title']}</h2>
        
        <p style="color: #666; line-height: 1.5; margin-bottom: 25px;">{config['message']}</p>
        
        <div style="background-color: #f5f5f5; padding: 20px; text-align: center; border-radius: 4px; margin: 25px 0;">
            <p style="margin: 0 0 10px 0; color: #888; font-size: 14px;">Verification Code</p>
            <p style="font-size: 28px; font-weight: bold; color: #333; margin: 0; font-family: monospace; letter-spacing: 3px;">{code}</p>
            <p style="margin: 10px 0 0 0; color: #e74c3c; font-size: 13px;">Expires in {"30 minutes" if purpose == "password_reset" else "10 minutes"}</p>
        </div>
        
        <p style="color: #888; font-size: 13px; line-height: 1.4;">If you didn't request this code, please ignore this email. For support, contact support@mymesob.com</p>
        
        <hr style="border: none; border-top: 1px solid #eee; margin: 25px 0;">
        
        <p style="color: #aaa; font-size: 12px; text-align: center; margin: 0;">Mesob Team | https://mymesob.com</p>
    </div>
</body>
</html>
"""
    
    return config['subject'], plain_text, html_body


def get_notification_email_template(title: str, message: str, action_url: str = None) -> tuple[str, str]:
    """Generate professional email for general notifications."""
    
    action_button = ""
    if action_url:
        action_button = f"""
        <div style="text-align: center; margin: 30px 0;">
            <a href="{action_url}" style="background-color: #2563eb; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block;">
                View Details
            </a>
        </div>
        """
    
    html_body = f"""
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title} - Mesob</title>
    <style>
        body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f5f7fa; }}
        .container {{ max-width: 600px; margin: 0 auto; background-color: #ffffff; }}
        .header {{ background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); padding: 30px 20px; text-align: center; }}
        .logo {{ color: #ffffff; font-size: 28px; font-weight: bold; margin: 0; }}
        .tagline {{ color: #e0e7ff; font-size: 14px; margin: 5px 0 0 0; }}
        .content {{ padding: 40px 30px; }}
        .title {{ color: #1f2937; font-size: 24px; font-weight: 600; margin: 0 0 20px 0; }}
        .message {{ color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0; }}
        .footer {{ background-color: #f8fafc; padding: 25px 30px; border-top: 1px solid #e5e7eb; }}
        .footer-text {{ color: #9ca3af; font-size: 12px; text-align: center; margin: 0; }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 class="logo">Mesob</h1>
            <p class="tagline">Modern Business Management Platform</p>
        </div>
        
        <div class="content">
            <h2 class="title">{title}</h2>
            <p class="message">{message}</p>
            {action_button}
        </div>
        
        <div class="footer">
            <p class="footer-text">
                © 2024 Mesob. All rights reserved.<br>
                This is an automated message, please do not reply to this email.
            </p>
        </div>
    </div>
</body>
</html>
"""
    
    return f"{title} - Mesob", html_body