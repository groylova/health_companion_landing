# Deployment Guide

## GitHub Secrets Setup

Go to repository **Settings → Secrets and variables → Actions** and add:

### Required Secrets

1. **SSH_PRIVATE_KEY**
   ```
   -----BEGIN OPENSSH PRIVATE KEY-----
   [Your SSH private key here]
   -----END OPENSSH PRIVATE KEY-----
   ```

2. **SSH_HOST**
   ```
   49.13.232.206
   ```

3. **SSH_USER**
   ```
   nuvvoo-zfxrz
   ```

4. **BREVO_API_KEY**
   ```
   [Your Brevo API key - see .env file]
   ```

5. **BREVO_LIST_ID**
   ```
   5
   ```

## Deployment Process

1. **Automatic Deployment**
   - Push to `main` branch triggers deployment automatically
   - GitHub Actions builds and deploys to production

2. **Manual Deployment**
   - Go to **Actions** tab
   - Select "Deploy to Production"
   - Click "Run workflow"

## Server Setup (One-time)

SSH into the server and run:

```bash
# Install Node.js (if not installed)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 globally
sudo npm install -g pm2

# Create deployment directory
mkdir -p /home/nuvvoo-zfxrz/nuvvoo.pryvus.com

# Set up PM2 to start on boot
pm2 startup
pm2 save
```

## Environment Variables on Server

Create `/home/nuvvoo-zfxrz/nuvvoo.pryvus.com/.env.production`:

```bash
NEXT_PUBLIC_SITE_URL=https://nuvvoo.pryvus.com
BREVO_API_KEY=[Your Brevo API key]
BREVO_LIST_ID=5
```

## Verify Deployment

1. Check PM2 status:
   ```bash
   pm2 list
   pm2 logs nuvvoo
   ```

2. Test the site:
   ```bash
   curl https://nuvvoo.pryvus.com
   ```

## Troubleshooting

### App not starting
```bash
pm2 delete nuvvoo
cd /home/nuvvoo-zfxrz/nuvvoo.pryvus.com
pm2 start npm --name nuvvoo -- start
```

### View logs
```bash
pm2 logs nuvvoo --lines 100
```

### Restart app
```bash
pm2 restart nuvvoo
```

## Deployment Path

- **Production:** `/home/nuvvoo-zfxrz/nuvvoo.pryvus.com/`
- **Public files:** `/home/nuvvoo-zfxrz/nuvvoo.pryvus.com/public/`
- **Build output:** `/home/nuvvoo-zfxrz/nuvvoo.pryvus.com/.next/`
