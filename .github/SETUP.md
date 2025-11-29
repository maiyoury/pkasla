# GitHub Actions Setup Guide

Quick guide to set up CI/CD workflows for this project.

## Step 1: Generate SSH Key (if needed)

If you don't have an SSH key for your server:

```bash
# Generate a new SSH key
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/github_actions_deploy

# Copy the public key to your server
ssh-copy-id -i ~/.ssh/github_actions_deploy.pub root@your-server-ip

# Display the private key (you'll add this to GitHub secrets)
cat ~/.ssh/github_actions_deploy
```

## Step 2: Add GitHub Secrets

Go to: **Repository Settings → Secrets and variables → Actions → New repository secret**

Add these secrets:

### Required Secrets

| Secret Name | Description | Example |
|------------|-------------|---------|
| `VULTR_IP` | Your server IP address | `123.45.67.89` |
| `SSH_PRIVATE_KEY` | Your private SSH key content | `-----BEGIN OPENSSH PRIVATE KEY-----...` |
| `NEXT_PUBLIC_API_URL` | Production API URL | `https://api.yourdomain.com/api/v1` |

### Optional Secrets (with defaults)

| Secret Name | Default | Description |
|------------|---------|-------------|
| `VULTR_USERNAME` | `root` | SSH username |
| `VULTR_SSH_PORT` | `22` | SSH port |
| `VULTR_PROJECT_PATH` | `/www/wwwroot/turborepo/pkasla-pro` | Project directory on server |

### Development Secrets (optional, for separate dev server)

| Secret Name | Description |
|------------|-------------|
| `VULTR_IP_DEV` | Development server IP (uses `VULTR_IP` if not set) |
| `VULTR_PROJECT_PATH_DEV` | Dev project path (uses `VULTR_PROJECT_PATH` if not set) |
| `NEXT_PUBLIC_API_URL_DEV` | Dev API URL (uses `NEXT_PUBLIC_API_URL` if not set) |

## Step 3: Verify Server Setup

SSH into your server and verify:

```bash
# Check Node.js version (should be 18+)
node --version

# Check pnpm is available
pnpm --version

# Check PM2 is installed
pm2 --version

# If PM2 is not installed:
npm install -g pm2

# Check project directory exists
ls -la /www/wwwroot/turborepo/pkasla-pro
```

## Step 4: Test Workflow

1. Push a commit to `main` branch to trigger production deployment
2. Push a commit to `dev/1.0.0` branch to trigger dev deployment
3. Check the **Actions** tab in GitHub to see workflow status

## Step 5: Monitor Deployments

```bash
# On your server, check PM2 status
pm2 status

# View logs
pm2 logs backend
pm2 logs web

# View specific app logs
pm2 logs backend --lines 50
```

## Troubleshooting

### Workflow fails at SSH step
- Verify SSH key is correct (test manually: `ssh -i ~/.ssh/github_actions_deploy root@your-ip`)
- Check server firewall allows SSH connections
- Ensure SSH key has correct permissions: `chmod 600 ~/.ssh/github_actions_deploy`

### Build fails
- Check Node.js version matches (20.x)
- Verify pnpm version (9.0.0)
- Ensure all dependencies are in package.json

### Deployment fails
- Check server has enough disk space: `df -h`
- Verify PM2 is installed: `pm2 --version`
- Check application logs: `pm2 logs`

### Applications not starting
- Check environment variables are set on server
- Verify ports are not in use: `netstat -tulpn | grep :3000`
- Check file permissions: `ls -la apps/backend/dist/server.js`

## Quick Commands Reference

```bash
# On server - Start applications
pm2 start ecosystem.config.js

# On server - Restart applications
pm2 restart all

# On server - Stop applications
pm2 stop all

# On server - View status
pm2 status

# On server - View logs
pm2 logs

# On server - Monitor resources
pm2 monit

# On server - Save PM2 configuration
pm2 save

# On server - Setup PM2 to start on boot
pm2 startup
pm2 save
```

