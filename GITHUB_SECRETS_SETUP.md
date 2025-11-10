# GitHub Secrets Setup Guide - EC2 Deployment

## Quick Setup Checklist

Copy this checklist and fill in your values, then add them to GitHub Secrets.

---

## 🔐 Required GitHub Secrets

### 1. Docker Hub Secrets

| Secret Name | Where to Get It | Your Value |
|------------|-----------------|------------|
| `DOCKERHUB_USERNAME` | Your Docker Hub username | `____________` |
| `DOCKERHUB_TOKEN` | Docker Hub → Account Settings → Security → New Access Token | `____________` |
| `DOCKERHUB_REPOSITORY` | Format: `username/repository-name` | `____________` |

**How to get Docker Hub Token:**
1. Go to https://hub.docker.com/settings/security
2. Click "New Access Token"
3. Name: `github-actions-ecs`
4. Permissions: Read, Write, Delete
5. Copy the token (you won't see it again!)

---

### 2. EC2 Secrets

| Secret Name | Where to Get It | Your Value |
|------------|-----------------|------------|
| `EC2_HOST` | EC2 public IP or domain name | `____________` |
| `EC2_USERNAME` | SSH username (usually `ubuntu` for Ubuntu AMI) | `ubuntu` |
| `EC2_SSH_KEY` | Private SSH key (.pem file content) | `____________` |

**How to get EC2_HOST:**
1. Go to EC2 Dashboard
2. Select your instance
3. Copy "Public IPv4 address" or "Public IPv4 DNS"

**How to get EC2_SSH_KEY:**
```bash
# On your local machine, display your private key
cat your-key-pair.pem
```
Copy the ENTIRE output including:
```
-----BEGIN RSA PRIVATE KEY-----
...
-----END RSA PRIVATE KEY-----
```
Paste this into the GitHub secret.

---

## 📝 Step-by-Step: Adding Secrets to GitHub

### Method 1: Via GitHub Web UI

1. Go to your repository on GitHub
2. Click **Settings** (top menu)
3. In left sidebar, click **Secrets and variables** → **Actions**
4. Click **New repository secret**
5. Enter **Name** (e.g., `DOCKERHUB_USERNAME`)
6. Enter **Secret** (the actual value)
7. Click **Add secret**
8. Repeat for all 6 secrets

### Method 2: Via GitHub CLI

```bash
# Install GitHub CLI if not already installed
# https://cli.github.com/

# Login to GitHub
gh auth login

# Add secrets (replace YOUR_VALUE with actual values)
gh secret set DOCKERHUB_USERNAME -b "YOUR_VALUE"
gh secret set DOCKERHUB_TOKEN -b "YOUR_VALUE"
gh secret set DOCKERHUB_REPOSITORY -b "YOUR_VALUE"
gh secret set EC2_HOST -b "YOUR_EC2_IP"
gh secret set EC2_USERNAME -b "ubuntu"
gh secret set EC2_SSH_KEY < your-key.pem
```

---

## ✅ Verification Checklist

After adding all secrets, verify:

- [ ] All 6 secrets are listed in GitHub → Settings → Secrets and variables → Actions
- [ ] Secret names match exactly (case-sensitive!)
- [ ] No extra spaces in secret values
- [ ] Docker Hub token has Read, Write, Delete permissions
- [ ] EC2 instance is running
- [ ] EC2 security group allows SSH (port 22) from GitHub Actions IPs
- [ ] SSH key is valid and matches EC2 instance key pair

---

## 🧪 Test Your Setup

### 1. Test Docker Hub Connection
```bash
# On your local machine
docker login -u YOUR_DOCKERHUB_USERNAME -p YOUR_DOCKERHUB_TOKEN
docker pull YOUR_DOCKERHUB_USERNAME/YOUR_REPO:latest
```

### 2. Test SSH Connection
```bash
# Test SSH connection to EC2
ssh -i your-key.pem ubuntu@YOUR_EC2_IP

# Check Docker is installed
docker --version

# Check if you can pull from Docker Hub
docker pull hello-world
```

### 3. Test GitHub Actions Workflow
1. Make a small change to your code
2. Commit and push to `main` branch
3. Go to GitHub → Actions tab
4. Watch the workflow run
5. Check for any errors

---

## 🔒 Security Best Practices

### ✅ DO:
- Use separate AWS IAM user for GitHub Actions (not your personal credentials)
- Use Docker Hub access tokens (not your password)
- Rotate secrets regularly (every 90 days)
- Use least-privilege IAM policies
- Store sensitive values in AWS Secrets Manager (not in task definition)
- Enable MFA on AWS root account

### ❌ DON'T:
- Commit secrets to Git (even in private repos)
- Share secrets via email or chat
- Use root AWS credentials
- Give GitHub Actions user more permissions than needed
- Store database passwords in environment variables (use Secrets Manager)

---

## 🚨 If Secrets Are Compromised

### Docker Hub Token Compromised:
1. Go to Docker Hub → Settings → Security
2. Delete the compromised token
3. Create a new token
4. Update GitHub secret `DOCKERHUB_TOKEN`

### SSH Key Compromised:
```bash
# Create new key pair in AWS
aws ec2 create-key-pair --key-name zemen-new-key --query 'KeyMaterial' --output text > zemen-new-key.pem
chmod 400 zemen-new-key.pem

# Stop EC2 instance
aws ec2 stop-instances --instance-ids i-xxxxx

# Detach old key and attach new key (requires instance stop)
# Then restart instance
aws ec2 start-instances --instance-ids i-xxxxx

# Update GitHub secret
gh secret set EC2_SSH_KEY < zemen-new-key.pem

# Delete old key pair
aws ec2 delete-key-pair --key-name old-key-name
```

---

## 📋 Complete Secrets List (Copy-Paste Template)

```bash
# Docker Hub
DOCKERHUB_USERNAME=
DOCKERHUB_TOKEN=
DOCKERHUB_REPOSITORY=

# EC2
EC2_HOST=
EC2_USERNAME=ubuntu
EC2_SSH_KEY=
```

---

## 🆘 Troubleshooting

### Error: "Invalid Docker Hub credentials"
- Verify `DOCKERHUB_USERNAME` is correct (case-sensitive)
- Ensure `DOCKERHUB_TOKEN` is an access token, not your password
- Check token hasn't expired

### Error: "SSH connection failed"
- Verify `EC2_HOST` is correct (public IP or DNS)
- Check EC2 instance is running
- Ensure security group allows SSH (port 22)
- Verify SSH key is correct and complete (including BEGIN/END lines)

### Error: "Permission denied (publickey)"
- Check `EC2_USERNAME` is correct (usually `ubuntu` for Ubuntu, `ec2-user` for Amazon Linux)
- Verify SSH key matches the key pair used when launching EC2
- Ensure SSH key has correct format with line breaks

### Error: "Docker command not found"
- SSH into EC2 and install Docker (see EC2_DEPLOYMENT_GUIDE.md)
- Verify Docker service is running: `sudo systemctl status docker`

---

## 📞 Need Help?

1. Check GitHub Actions workflow logs for detailed error messages
2. SSH into EC2 and check Docker logs: `docker logs zemen-backend`
3. Verify all secrets are correctly set in GitHub
4. Ensure EC2 instance is running and accessible
5. Check EC2 security group allows required ports

---

## ✨ Success Indicators

When everything is set up correctly, you should see:

1. ✅ GitHub Actions workflow completes successfully
2. ✅ Docker image pushed to Docker Hub
3. ✅ SSH connection to EC2 successful
4. ✅ Container running on EC2: `docker ps`
5. ✅ Application accessible via EC2 IP: `http://YOUR_EC2_IP:8000`
6. ✅ Health check endpoint returns 200 OK: `curl http://YOUR_EC2_IP:8000/health`

**Congratulations! Your CI/CD pipeline is now fully automated! 🎉**
