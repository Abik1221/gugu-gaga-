# Email Setup Guide

## Problem
Email sending is not working because:
1. The `.env` file was missing (now created)
2. Gmail App Password is not configured
3. Backend server needs restart to load new environment variables

## Solution

### Step 1: Get Gmail App Password
1. Go to https://myaccount.google.com/apppasswords
2. Sign in with `nahomkeneni4@gmail.com`
3. Create a new App Password for "Mail"
4. Copy the 16-character password (format: `xxxx xxxx xxxx xxxx`)

### Step 2: Update .env File
1. Open `backend\.env`
2. Find the line: `SMTP_PASSWORD=your_app_password_here`
3. Replace `your_app_password_here` with your actual App Password
4. Example: `SMTP_PASSWORD=abcd efgh ijkl mnop`

### Step 3: Restart Backend Server
1. Stop the current backend server (Ctrl+C)
2. Restart it:
   ```powershell
   cd backend
   .venv\Scripts\Activate.ps1
   uvicorn app.main:app --reload
   ```

## Verification
After restart, when you request a password reset:
- You should see the code printed in the terminal (for development)
- You should receive an email with the reset code
- The logs should show: `Email sent to <email> with subject 'Reset Your Password - Zemen Pharma'`

## Current Configuration
- **Email Enabled**: `true`
- **SMTP Host**: `smtp.gmail.com`
- **SMTP Port**: `587`
- **SMTP TLS**: `true`
- **From Email**: `nahomkeneni4@gmail.com`

## Troubleshooting
If emails still don't send after setup:
1. Check Gmail security settings - ensure "Less secure app access" is OFF (we use App Passwords)
2. Check if 2-Factor Authentication is enabled (required for App Passwords)
3. Check backend logs for SMTP errors
4. Verify the App Password has no spaces when pasted in .env file
