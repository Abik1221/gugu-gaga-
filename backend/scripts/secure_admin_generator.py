#!/usr/bin/env python3
"""
Production-ready secure admin generator
Usage: python secure_admin_generator.py --email admin@company.com [--force]
"""
import sys
import argparse
from pathlib import Path

# Add backend to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from app.db.session import SessionLocal
from app.core.admin_security import AdminSecurityManager

def main():
    parser = argparse.ArgumentParser(description="Generate secure admin credentials")
    parser.add_argument("--email", required=True, help="Admin email address")
    parser.add_argument("--force", action="store_true", help="Force recreate if exists")
    parser.add_argument("--output", choices=["console", "file"], default="console", help="Output method")
    
    args = parser.parse_args()
    
    db = SessionLocal()
    try:
        result = AdminSecurityManager.create_secure_admin(
            db=db, 
            email=args.email, 
            force_new=args.force
        )
        
        if result["status"] == "exists":
            print(f"❌ Admin {args.email} already exists. Use --force to recreate.")
            return
        
        # Output credentials securely
        if args.output == "console":
            print("\n" + "="*60)
            print("🔒 SECURE ADMIN CREDENTIALS GENERATED")
            print("="*60)
            print(f"Email: {result['email']}")
            print(f"Password: {result['password']}")
            print(f"Admin Token: {result['admin_token']}")
            print(f"Created: {result['created_at']}")
            print("="*60)
            print("⚠️  SECURITY WARNING:")
            print("- Save these credentials in a secure password manager")
            print("- Delete this output after saving")
            print("- Change password after first login")
            print("="*60)
        
        elif args.output == "file":
            filename = f"admin_credentials_{int(time.time())}.txt"
            with open(filename, "w") as f:
                f.write(f"ADMIN_EMAIL={result['email']}\n")
                f.write(f"ADMIN_PASSWORD={result['password']}\n")
                f.write(f"ADMIN_TOKEN={result['admin_token']}\n")
                f.write(f"CREATED_AT={result['created_at']}\n")
            print(f"✅ Credentials saved to: {filename}")
            print("⚠️  Delete this file after copying to secure storage!")
    
    except Exception as e:
        print(f"❌ Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    import time
    main()