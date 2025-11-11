"""Professional email templates for verification codes and notifications."""

def get_verification_email_template(code: str, purpose: str, user_email: str) -> tuple[str, str]:
    """Generate professional email subject and HTML body for verification codes."""
    
    # Define purpose-specific content
    purpose_config = {
        "register": {
            "subject": "Verify Your Account - Zemen Pharma",
            "title": "Account Verification Required",
            "message": "Welcome to Zemen Pharma! Please verify your email address to complete your registration.",
            "action": "Complete Registration"
        },
        "login": {
            "subject": "Login Verification Code - Zemen Pharma",
            "title": "Secure Login Verification",
            "message": "A login attempt was made to your Zemen Pharma account. Please use the code below to complete your login.",
            "action": "Complete Login"
        },
        "password_reset": {
            "subject": "Password Reset Code - Zemen Pharma",
            "title": "Password Reset Request",
            "message": "You requested to reset your password for your Zemen Pharma account. Use the code below to set a new password.",
            "action": "Reset Password"
        }
    }
    
    config = purpose_config.get(purpose, purpose_config["register"])
    
    html_body = f"""
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{config['subject']}</title>
    <style>
        body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f5f7fa; }}
        .container {{ max-width: 600px; margin: 0 auto; background-color: #ffffff; }}
        .header {{ background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); padding: 30px 20px; text-align: center; }}
        .logo {{ color: #ffffff; font-size: 28px; font-weight: bold; margin: 0; }}
        .tagline {{ color: #e0e7ff; font-size: 14px; margin: 5px 0 0 0; }}
        .content {{ padding: 40px 30px; }}
        .title {{ color: #1f2937; font-size: 24px; font-weight: 600; margin: 0 0 20px 0; text-align: center; }}
        .message {{ color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0; text-align: center; }}
        .code-container {{ background-color: #f8fafc; border: 2px dashed #cbd5e1; border-radius: 12px; padding: 25px; text-align: center; margin: 30px 0; }}
        .code-label {{ color: #64748b; font-size: 14px; font-weight: 500; margin: 0 0 10px 0; text-transform: uppercase; letter-spacing: 1px; }}
        .code {{ color: #1e293b; font-size: 32px; font-weight: bold; font-family: 'Courier New', monospace; letter-spacing: 4px; margin: 0; }}
        .expiry {{ color: #ef4444; font-size: 14px; margin: 15px 0 0 0; font-weight: 500; }}
        .instructions {{ color: #6b7280; font-size: 14px; line-height: 1.5; margin: 30px 0; text-align: center; }}
        .footer {{ background-color: #f8fafc; padding: 25px 30px; border-top: 1px solid #e5e7eb; }}
        .footer-text {{ color: #9ca3af; font-size: 12px; text-align: center; margin: 0; }}
        .security-notice {{ background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; }}
        .security-text {{ color: #92400e; font-size: 14px; margin: 0; }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 class="logo">Zemen Pharma</h1>
            <p class="tagline">Modern Pharmacy Management Platform</p>
        </div>
        
        <div class="content">
            <h2 class="title">{config['title']}</h2>
            <p class="message">{config['message']}</p>
            
            <div class="code-container">
                <p class="code-label">Verification Code</p>
                <p class="code">{code}</p>
                <p class="expiry">⏰ Expires in {"30 minutes" if purpose == "password_reset" else "10 minutes"}</p>
            </div>
            
            <p class="instructions">
                Enter this code in the verification field to {config['action'].lower()}. 
                This code is valid for {"30 minutes" if purpose == "password_reset" else "10 minutes"} and can only be used once.
            </p>
            
            <div class="security-notice">
                <p class="security-text">
                    🔒 <strong>Security Notice:</strong> If you didn't request this code, please ignore this email. 
                    Never share your verification codes with anyone.
                </p>
            </div>
        </div>
        
        <div class="footer">
            <p class="footer-text">
                © 2024 Zemen Pharma. All rights reserved.<br>
                This is an automated message, please do not reply to this email.
            </p>
        </div>
    </div>
</body>
</html>
"""
    
    return config['subject'], html_body


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
    <title>{title} - Zemen Pharma</title>
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
            <h1 class="logo">Zemen Pharma</h1>
            <p class="tagline">Modern Pharmacy Management Platform</p>
        </div>
        
        <div class="content">
            <h2 class="title">{title}</h2>
            <p class="message">{message}</p>
            {action_button}
        </div>
        
        <div class="footer">
            <p class="footer-text">
                © 2024 Zemen Pharma. All rights reserved.<br>
                This is an automated message, please do not reply to this email.
            </p>
        </div>
    </div>
</body>
</html>
"""
    
    return f"{title} - Zemen Pharma", html_body