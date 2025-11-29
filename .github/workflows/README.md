# GitHub Actions Workflows

This directory contains CI/CD workflows for the project.

## Workflows

### 1. CI (`ci.yml`)
Runs on every pull request and push to `main` and `dev/1.0.0` branches.

**Jobs:**
- **Lint**: Runs ESLint on all packages
- **Type Check**: Validates TypeScript types across the monorepo
- **Build**: Builds all applications to ensure they compile successfully

**Triggers:**
- Pull requests to `main` or `dev/1.0.0`
- Pushes to `main` or `dev/1.0.0`

### 2. Deploy to Production (`deploy.yml`)
Deploys the application to the production server when code is pushed to `main`.

**Steps:**
1. Builds all applications
2. Uploads build artifacts
3. Deploys to server via SSH
4. Restarts applications with PM2

**Triggers:**
- Push to `main` branch
- Manual workflow dispatch

**Required Secrets:**
- `VULTR_IP`: Production server IP address
- `VULTR_USERNAME`: SSH username (defaults to 'root')
- `SSH_PRIVATE_KEY`: Private SSH key for server access
- `VULTR_SSH_PORT`: SSH port (optional, defaults to 22)
- `VULTR_PROJECT_PATH`: Project path on server (optional)
- `NEXT_PUBLIC_API_URL`: Next.js public API URL

### 3. Deploy to Development (`deploy-dev.yml`)
Deploys the application to the development server when code is pushed to `dev/1.0.0`.

**Steps:**
1. Builds all applications
2. Deploys to dev server via SSH
3. Restarts applications with PM2

**Triggers:**
- Push to `dev/1.0.0` branch
- Manual workflow dispatch

**Required Secrets:**
- `VULTR_IP_DEV`: Development server IP (or use `VULTR_IP`)
- `VULTR_USERNAME`: SSH username (defaults to 'root')
- `SSH_PRIVATE_KEY`: Private SSH key for server access
- `VULTR_SSH_PORT`: SSH port (optional, defaults to 22)
- `VULTR_PROJECT_PATH_DEV`: Project path on dev server (optional)
- `NEXT_PUBLIC_API_URL_DEV`: Next.js public API URL for dev (or use `NEXT_PUBLIC_API_URL`)

### 4. Test (`test.yml`)
Runs tests across the monorepo (if tests exist).

**Triggers:**
- Pull requests to `main` or `dev/1.0.0`
- Pushes to `main` or `dev/1.0.0`

## Setting Up Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions, and add the following secrets:

### Required Secrets

1. **VULTR_IP**: Your production server IP address
2. **SSH_PRIVATE_KEY**: Your private SSH key for server access
   ```bash
   # Generate SSH key if needed
   ssh-keygen -t ed25519 -C "github-actions"
   
   # Copy private key content
   cat ~/.ssh/id_ed25519
   ```

3. **NEXT_PUBLIC_API_URL**: Your production API URL
   ```
   https://api.yourdomain.com/api/v1
   ```

### Optional Secrets

- **VULTR_USERNAME**: SSH username (defaults to 'root')
- **VULTR_SSH_PORT**: SSH port (defaults to 22)
- **VULTR_PROJECT_PATH**: Project path on server
  ```
  /www/wwwroot/turborepo/pkasla-pro
  ```
- **VULTR_IP_DEV**: Development server IP (if different from production)
- **VULTR_PROJECT_PATH_DEV**: Dev project path (if different)
- **NEXT_PUBLIC_API_URL_DEV**: Dev API URL (if different)

## Server Setup

### 1. Add SSH Public Key to Server

```bash
# On your server
mkdir -p ~/.ssh
echo "YOUR_PUBLIC_KEY" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

### 2. Install PM2 (if not already installed)

```bash
npm install -g pm2
```

### 3. Setup PM2 Ecosystem (Optional)

Create `ecosystem.config.js` in project root:

```javascript
module.exports = {
  apps: [
    {
      name: 'backend',
      script: './apps/backend/dist/server.js',
      instances: 1,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
      },
    },
    {
      name: 'web',
      script: './apps/web/.next/standalone/server.js',
      instances: 1,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
    },
  ],
};
```

Then use: `pm2 start ecosystem.config.js`

## Workflow Status

You can view workflow runs and their status in the **Actions** tab of your GitHub repository.

## Troubleshooting

### Build Fails
- Check that all environment variables are set
- Verify Node.js version matches (20.x)
- Ensure pnpm version is correct (9.0.0)

### Deployment Fails
- Verify SSH key has correct permissions
- Check server has enough disk space
- Ensure PM2 is installed and configured
- Verify project path is correct

### SSH Connection Issues
- Test SSH connection manually: `ssh user@ip`
- Verify SSH key format (should be OpenSSH format)
- Check firewall settings on server

