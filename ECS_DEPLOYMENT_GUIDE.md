# AWS ECS Deployment Guide

## Overview
This guide will help you deploy the Zemen Pharma backend to AWS ECS using the CI/CD pipeline that automatically builds Docker images and deploys them.

---

## Prerequisites

### 1. AWS Account Setup
- AWS Account with ECS access
- IAM user with appropriate permissions

### 2. Docker Hub Account
- Docker Hub account (already configured)
- Private repository created

---

## Step 1: Create AWS ECS Infrastructure

### 1.1 Create ECS Cluster
```bash
aws ecs create-cluster --cluster-name zemen-pharma-cluster --region us-east-1
```

Or via AWS Console:
1. Go to ECS → Clusters
2. Click "Create Cluster"
3. Choose "Networking only" (Fargate)
4. Name: `zemen-pharma-cluster`
5. Create

### 1.2 Create Task Definition

Create a file `task-definition.json`:

```json
{
  "family": "zemen-pharma-backend",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "512",
  "memory": "1024",
  "executionRoleArn": "arn:aws:iam::YOUR_ACCOUNT_ID:role/ecsTaskExecutionRole",
  "containerDefinitions": [
    {
      "name": "zemen-backend",
      "image": "YOUR_DOCKERHUB_USERNAME/YOUR_REPO:latest",
      "essential": true,
      "portMappings": [
        {
          "containerPort": 8000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "ENVIRONMENT",
          "value": "production"
        },
        {
          "name": "DATABASE_URL",
          "value": "postgresql://user:pass@your-rds-endpoint:5432/zemen"
        }
      ],
      "secrets": [
        {
          "name": "JWT_SECRET",
          "valueFrom": "arn:aws:secretsmanager:us-east-1:ACCOUNT_ID:secret:zemen/jwt-secret"
        },
        {
          "name": "SMTP_PASSWORD",
          "valueFrom": "arn:aws:secretsmanager:us-east-1:ACCOUNT_ID:secret:zemen/smtp-password"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/zemen-pharma-backend",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      },
      "repositoryCredentials": {
        "credentialsParameter": "arn:aws:secretsmanager:us-east-1:ACCOUNT_ID:secret:dockerhub-credentials"
      }
    }
  ]
}
```

Register the task definition:
```bash
aws ecs register-task-definition --cli-input-json file://task-definition.json
```

### 1.3 Create ECS Service

```bash
aws ecs create-service \
  --cluster zemen-pharma-cluster \
  --service-name zemen-pharma-service \
  --task-definition zemen-pharma-backend \
  --desired-count 1 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-xxxxx],securityGroups=[sg-xxxxx],assignPublicIp=ENABLED}" \
  --load-balancers "targetGroupArn=arn:aws:elasticloadbalancing:us-east-1:ACCOUNT_ID:targetgroup/zemen-tg/xxxxx,containerName=zemen-backend,containerPort=8000"
```

---

## Step 2: Store Docker Hub Credentials in AWS Secrets Manager

### 2.1 Create Docker Hub Secret
```bash
aws secretsmanager create-secret \
  --name dockerhub-credentials \
  --description "Docker Hub credentials for private repository" \
  --secret-string '{"username":"YOUR_DOCKERHUB_USERNAME","password":"YOUR_DOCKERHUB_TOKEN"}' \
  --region us-east-1
```

### 2.2 Store Application Secrets
```bash
# JWT Secret
aws secretsmanager create-secret \
  --name zemen/jwt-secret \
  --secret-string "your-super-secret-jwt-key-change-in-production" \
  --region us-east-1

# SMTP Password
aws secretsmanager create-secret \
  --name zemen/smtp-password \
  --secret-string "your-gmail-app-password" \
  --region us-east-1
```

---

## Step 3: Create IAM Roles

### 3.1 ECS Task Execution Role

Create `ecs-task-execution-role-policy.json`:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ecr:GetAuthorizationToken",
        "ecr:BatchCheckLayerAvailability",
        "ecr:GetDownloadUrlForLayer",
        "ecr:BatchGetImage",
        "logs:CreateLogStream",
        "logs:PutLogEvents",
        "secretsmanager:GetSecretValue"
      ],
      "Resource": "*"
    }
  ]
}
```

Create the role:
```bash
aws iam create-role \
  --role-name ecsTaskExecutionRole \
  --assume-role-policy-document file://ecs-trust-policy.json

aws iam put-role-policy \
  --role-name ecsTaskExecutionRole \
  --policy-name ecsTaskExecutionPolicy \
  --policy-document file://ecs-task-execution-role-policy.json
```

### 3.2 GitHub Actions IAM User

Create IAM user for GitHub Actions:
```bash
aws iam create-user --user-name github-actions-ecs-deploy
```

Attach policy:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ecs:DescribeTaskDefinition",
        "ecs:RegisterTaskDefinition",
        "ecs:UpdateService",
        "ecs:DescribeServices",
        "iam:PassRole"
      ],
      "Resource": "*"
    }
  ]
}
```

Create access keys:
```bash
aws iam create-access-key --user-name github-actions-ecs-deploy
```

**Save the Access Key ID and Secret Access Key - you'll need them for GitHub Secrets!**

---

## Step 4: Configure GitHub Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions → New repository secret

Add the following secrets:

### Required Secrets:

| Secret Name | Description | Example Value |
|------------|-------------|---------------|
| `DOCKERHUB_USERNAME` | Your Docker Hub username | `yourusername` |
| `DOCKERHUB_TOKEN` | Docker Hub access token | `dckr_pat_xxxxx` |
| `DOCKERHUB_REPOSITORY` | Docker Hub repository name | `yourusername/zemen-pharma-backend` |
| `AWS_ACCESS_KEY_ID` | AWS access key for GitHub Actions user | `AKIAIOSFODNN7EXAMPLE` |
| `AWS_SECRET_ACCESS_KEY` | AWS secret key for GitHub Actions user | `wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY` |
| `AWS_REGION` | AWS region for ECS | `us-east-1` |
| `ECS_CLUSTER_NAME` | Name of your ECS cluster | `zemen-pharma-cluster` |
| `ECS_SERVICE_NAME` | Name of your ECS service | `zemen-pharma-service` |
| `ECS_TASK_DEFINITION_NAME` | Task definition family name | `zemen-pharma-backend` |
| `ECS_CONTAINER_NAME` | Container name in task definition | `zemen-backend` |

---

## Step 5: Setup Application Load Balancer (Optional but Recommended)

### 5.1 Create ALB
```bash
aws elbv2 create-load-balancer \
  --name zemen-pharma-alb \
  --subnets subnet-xxxxx subnet-yyyyy \
  --security-groups sg-xxxxx \
  --scheme internet-facing \
  --type application
```

### 5.2 Create Target Group
```bash
aws elbv2 create-target-group \
  --name zemen-pharma-tg \
  --protocol HTTP \
  --port 8000 \
  --vpc-id vpc-xxxxx \
  --target-type ip \
  --health-check-path /health
```

### 5.3 Create Listener
```bash
aws elbv2 create-listener \
  --load-balancer-arn arn:aws:elasticloadbalancing:us-east-1:ACCOUNT_ID:loadbalancer/app/zemen-pharma-alb/xxxxx \
  --protocol HTTP \
  --port 80 \
  --default-actions Type=forward,TargetGroupArn=arn:aws:elasticloadbalancing:us-east-1:ACCOUNT_ID:targetgroup/zemen-pharma-tg/xxxxx
```

---

## Step 6: Setup CloudWatch Logs

```bash
aws logs create-log-group --log-group-name /ecs/zemen-pharma-backend --region us-east-1
```

---

## Step 7: Deploy!

### Automatic Deployment
1. Push code to `main` branch
2. GitHub Actions will automatically:
   - Build Docker image
   - Push to Docker Hub
   - Update ECS task definition
   - Deploy to ECS service

### Manual Deployment
Go to GitHub → Actions → Build and Deploy to ECS → Run workflow

---

## Step 8: Verify Deployment

### Check ECS Service Status
```bash
aws ecs describe-services \
  --cluster zemen-pharma-cluster \
  --services zemen-pharma-service
```

### Check Running Tasks
```bash
aws ecs list-tasks \
  --cluster zemen-pharma-cluster \
  --service-name zemen-pharma-service
```

### View Logs
```bash
aws logs tail /ecs/zemen-pharma-backend --follow
```

### Test API
```bash
curl http://YOUR_ALB_DNS_NAME/health
curl http://YOUR_ALB_DNS_NAME/api/v1/health
```

---

## Troubleshooting

### Issue: Task fails to pull Docker image
**Solution**: Check Docker Hub credentials in Secrets Manager and ensure `repositoryCredentials` is set in task definition.

### Issue: Task fails to start
**Solution**: Check CloudWatch logs for errors. Verify environment variables and secrets.

### Issue: Service not accessible
**Solution**: Check security groups allow inbound traffic on port 8000. Verify ALB target group health checks.

### Issue: Database connection fails
**Solution**: Ensure RDS security group allows inbound from ECS security group. Verify DATABASE_URL is correct.

---

## Cost Optimization

1. **Use Fargate Spot** for non-production environments
2. **Auto-scaling**: Configure based on CPU/Memory
3. **Right-size resources**: Start with 512 CPU / 1024 Memory, adjust as needed
4. **Use RDS Aurora Serverless** for database

---

## Security Best Practices

1. ✅ Store all secrets in AWS Secrets Manager
2. ✅ Use private subnets for ECS tasks
3. ✅ Enable VPC Flow Logs
4. ✅ Use HTTPS with ACM certificate on ALB
5. ✅ Enable CloudTrail for audit logging
6. ✅ Implement least-privilege IAM policies
7. ✅ Enable container insights for monitoring

---

## Quick Reference Commands

```bash
# Update service with new task definition
aws ecs update-service \
  --cluster zemen-pharma-cluster \
  --service zemen-pharma-service \
  --task-definition zemen-pharma-backend:REVISION

# Scale service
aws ecs update-service \
  --cluster zemen-pharma-cluster \
  --service zemen-pharma-service \
  --desired-count 2

# View service events
aws ecs describe-services \
  --cluster zemen-pharma-cluster \
  --services zemen-pharma-service \
  --query 'services[0].events' \
  --output table
```

---

## Support

For issues or questions:
- Check CloudWatch Logs: `/ecs/zemen-pharma-backend`
- Review ECS service events
- Check GitHub Actions workflow logs
- Verify all secrets are correctly configured

---

## Next Steps

1. ✅ Setup RDS PostgreSQL database
2. ✅ Configure Route53 for custom domain
3. ✅ Setup ACM certificate for HTTPS
4. ✅ Configure auto-scaling policies
5. ✅ Setup CloudWatch alarms
6. ✅ Implement CI/CD for frontend (Next.js on S3 + CloudFront)
