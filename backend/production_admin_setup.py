#!/usr/bin/env python3
"""
Production Admin Setup Script
Run this on production server to generate secure admin credentials
"""
import os
import sys
import secrets
import string
from pathlib import Path

# Add backend to path
sys.path.insert(0, str(Path(__file__).parent))

def generate_production_env():
    """Generate production environment with secure admin credentials"""
    
    # Generate secure credentials
    admin_email = input("Enter admin email: ").strip()
    if not admin_email:
        admin_email = "admin@zemensystem.com"
    
    # Generate ultra-secure password
    chars = string.ascii_letters + string.digits + "!@#$%^&*()_+-=[]{}|;:,.<>?"
    admin_password = ''.join(secrets.choice(chars) for _ in range(32))
    
    # Generate secure JWT secret
    jwt_secret = secrets.token_urlsafe(64)
    
    # Production environment template
    env_content = f"""# PRODUCTION ENVIRONMENT - SECURE CONFIGURATION
ENVIRONMENT=production
DEBUG=false
APP_NAME=Zemen Pharma
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Database - Update with your production database
DATABASE_URL=sqlite:///./data/app.db

# Redis
REDIS_URL=redis://localhost:6379/0

# Gemini API
GEMINI_API_KEY=your_gemini_api_key_here

# SECURE AUTH CONFIGURATION
JWT_SECRET={jwt_secret}
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRES_MINUTES=60
REFRESH_TOKEN_EXPIRES_DAYS=7

# Rate limits (production)
RATE_LIMIT_GENERAL_PER_MINUTE=30
RATE_LIMIT_GEMINI_PER_MINUTE=15

# Email configuration
EMAIL_ENABLED=true
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your_email@gmail.com
SMTP_PASSWORD=your_app_password
SMTP_USE_TLS=true
EMAIL_FROM=your_email@gmail.com

# LangGraph
USE_LANGGRAPH=false

# Scheduler
ENABLE_SCHEDULER=true
SCHEDULER_TENANTS=
SCHEDULER_INTERVAL_SECONDS=3600

# SECURE ADMIN CREDENTIALS
ADMIN_EMAIL={admin_email}
ADMIN_PASSWORD={admin_password}

# Integrations
INTEGRATION_ENCRYPTION_KEY={secrets.token_urlsafe(32)}
INTEGRATION_OAUTH_REDIRECT_URI=https://yourdomain.com/auth/callback
INTEGRATION_STATE_TTL_SECONDS=600
"""

    # Save to file
    with open(".env.production.secure", "w") as f:
        f.write(env_content)
    
    print("\n" + "="*80)
    print("🔒 PRODUCTION ADMIN CREDENTIALS GENERATED")
    print("="*80)
    print(f"Admin Email: {admin_email}")
    print(f"Admin Password: {admin_password}")
    print("="*80)
    print("📋 DEPLOYMENT INSTRUCTIONS:")
    print("1. Copy .env.production.secure to your server as .env")
    print("2. Update CORS_ORIGINS with your actual domain")
    print("3. Update database and email settings")
    print("4. Save admin credentials in secure password manager")
    print("5. Delete this file after deployment")
    print("="*80)
    print("⚠️  SECURITY WARNINGS:")
    print("- Never commit .env files to version control")
    print("- Use strong firewall rules on production")
    print("- Enable HTTPS only")
    print("- Regular security updates")
    print("="*80)

if __name__ == "__main__":
    generate_production_env()