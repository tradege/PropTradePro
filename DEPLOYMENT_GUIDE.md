# 🚀 MarketEdgePros Deployment Guide

Complete guide for deploying MarketEdgePros to production.

---

## 📋 Prerequisites

### Required Services
- [ ] VPS/Cloud Server (2GB RAM minimum, 4GB recommended)
- [ ] PostgreSQL database (managed or self-hosted)
- [ ] Redis instance (managed or self-hosted)
- [ ] Domain name with DNS access
- [ ] SSL certificate (Let's Encrypt recommended)

### Required Accounts
- [ ] SendGrid account (for emails)
- [ ] Stripe account (for payments)
- [ ] AWS account (optional, for S3 file storage)
- [ ] Sentry account (optional, for error monitoring)

---

## 🔧 Step 1: Server Setup

### 1.1 Choose Your Platform

**Option A: DigitalOcean (Recommended for beginners)**
- Create a Droplet: Ubuntu 22.04, 2GB RAM, $12/month
- Add managed PostgreSQL database: $15/month
- Add managed Redis: $10/month

**Option B: AWS**
- EC2 instance: t3.small or larger
- RDS PostgreSQL instance
- ElastiCache Redis instance

**Option C: Heroku (Easiest but more expensive)**
- Create new app
- Add Heroku Postgres add-on
- Add Heroku Redis add-on

### 1.2 Install Docker

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
docker --version
docker-compose --version
```

---

## 🗄️ Step 2: Database Setup

### 2.1 PostgreSQL

**If using managed database (DigitalOcean, AWS RDS):**
1. Create database named `proptradepro_prod`
2. Create user with password
3. Note down connection string

**If self-hosting:**
```bash
# Install PostgreSQL
sudo apt install postgresql postgresql-contrib -y

# Create database and user
sudo -u postgres psql
CREATE DATABASE proptradepro_prod;
CREATE USER proptrade_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE proptradepro_prod TO proptrade_user;
\q
```

### 2.2 Redis

**If using managed Redis:**
1. Create Redis instance
2. Note down connection string

**If self-hosting:**
```bash
# Install Redis
sudo apt install redis-server -y

# Configure Redis
sudo nano /etc/redis/redis.conf
# Set: bind 127.0.0.1
# Set: requirepass your_redis_password

# Restart Redis
sudo systemctl restart redis
```

---

## 🔐 Step 3: Environment Configuration

### 3.1 Clone Repository

```bash
cd /var/www
git clone https://github.com/tradege/MarketEdgePros.git
cd MarketEdgePros
```

### 3.2 Create Production Environment File

```bash
cp .env.production.example .env.production
nano .env.production
```

### 3.3 Generate Secret Keys

```bash
# Generate SECRET_KEY
python3 -c "import secrets; print(secrets.token_hex(32))"

# Generate JWT_SECRET_KEY (different from above!)
python3 -c "import secrets; print(secrets.token_hex(32))"
```

### 3.4 Fill in Environment Variables

Update `.env.production` with:
- Database URL
- Redis URL
- Secret keys (generated above)
- SendGrid API key
- Stripe keys
- Domain names

---

## 📧 Step 4: SendGrid Setup

### 4.1 Create SendGrid Account
1. Go to https://signup.sendgrid.com/
2. Verify your email
3. Complete sender verification

### 4.2 Create API Key
1. Go to Settings → API Keys
2. Create API Key with "Full Access"
3. Copy key to `.env.production`

### 4.3 Verify Sender Email
1. Go to Settings → Sender Authentication
2. Verify your domain or single sender
3. Update `SENDGRID_FROM_EMAIL` in `.env.production`

---

## 💳 Step 5: Stripe Setup

### 5.1 Create Stripe Account
1. Go to https://dashboard.stripe.com/register
2. Complete business verification
3. Activate your account

### 5.2 Get API Keys
1. Go to Developers → API keys
2. Copy "Publishable key" and "Secret key"
3. **Important:** Use LIVE keys, not test keys!
4. Update `.env.production`

### 5.3 Setup Webhooks
1. Go to Developers → Webhooks
2. Add endpoint: `https://api.yourdomain.com/api/payments/webhook`
3. Select events:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `charge.refunded`
4. Copy webhook secret to `.env.production`

---

## 🌐 Step 6: Domain & SSL Setup

### 6.1 Configure DNS

Add these DNS records:

```
Type    Name    Value               TTL
A       @       your_server_ip      3600
A       www     your_server_ip      3600
A       api     your_server_ip      3600
```

### 6.2 Install Certbot (Let's Encrypt)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com -d api.yourdomain.com
```

---

## 🐳 Step 7: Deploy with Docker

### 7.1 Build and Start Services

```bash
cd /var/www/MarketEdgePros

# Build images
docker-compose -f docker-compose.prod.yml build

# Start services
docker-compose -f docker-compose.prod.yml up -d

# Check logs
docker-compose -f docker-compose.prod.yml logs -f
```

### 7.2 Run Database Migrations

```bash
# Enter backend container
docker exec -it proptradepro-backend bash

# Run migrations
python manage.py upgrade

# Seed initial data
python manage.py seed

# Exit container
exit
```

### 7.3 Verify Deployment

```bash
# Check if all containers are running
docker ps

# Test backend
curl https://api.yourdomain.com/health

# Test frontend
curl https://yourdomain.com
```

---

## 🔍 Step 8: Testing

### 8.1 Test Authentication
1. Go to https://yourdomain.com
2. Register a new account
3. Check email verification
4. Login with credentials
5. Test 2FA setup

### 8.2 Test Payments
1. Go to Programs page
2. Select a program
3. Click "Get Started"
4. Complete Stripe checkout (use test card: 4242 4242 4242 4242)
5. Verify challenge is created

### 8.3 Test Admin Panel
1. Login as admin (admin@proptradepro.com / Admin@123)
2. Go to /admin
3. Test user management
4. Test KYC approval

---

## 📊 Step 9: Monitoring Setup (Optional)

### 9.1 Sentry (Error Monitoring)

```bash
# Install Sentry SDK
pip install sentry-sdk[flask]

# Add to .env.production
SENTRY_DSN=https://your_sentry_dsn_here
```

### 9.2 Uptime Monitoring

Use services like:
- UptimeRobot (free)
- Pingdom
- StatusCake

Monitor:
- https://yourdomain.com
- https://api.yourdomain.com/health

---

## 🔄 Step 10: Backup & Maintenance

### 10.1 Database Backups

```bash
# Create backup script
cat > /var/www/backup.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
docker exec proptradepro-postgres pg_dump -U postgres proptradepro_prod > /var/backups/db_$DATE.sql
find /var/backups -name "db_*.sql" -mtime +7 -delete
EOF

chmod +x /var/www/backup.sh

# Add to crontab (daily at 2 AM)
crontab -e
0 2 * * * /var/www/backup.sh
```

### 10.2 Log Rotation

```bash
# Configure log rotation
sudo nano /etc/logrotate.d/proptradepro

/var/log/proptradepro/*.log {
    daily
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 www-data www-data
}
```

---

## 🚨 Troubleshooting

### Issue: Can't connect to database

**Solution:**
```bash
# Check database connection
docker exec -it proptradepro-backend bash
python -c "from src.database import db; from src.app import create_app; app = create_app(); app.app_context().push(); print(db.engine.url)"
```

### Issue: Stripe payments not working

**Solution:**
1. Check Stripe keys are LIVE keys, not test
2. Verify webhook endpoint is accessible
3. Check webhook secret matches
4. Review Stripe dashboard logs

### Issue: Emails not sending

**Solution:**
1. Verify SendGrid API key
2. Check sender email is verified
3. Review SendGrid activity logs
4. Check spam folder

### Issue: Frontend not loading

**Solution:**
```bash
# Rebuild frontend
docker-compose -f docker-compose.prod.yml build frontend
docker-compose -f docker-compose.prod.yml up -d frontend

# Check logs
docker logs proptradepro-frontend
```

---

## 📈 Performance Optimization

### 1. Enable Gzip Compression
Already configured in nginx.conf ✅

### 2. Setup CDN (Optional)
- Cloudflare (free)
- AWS CloudFront
- Fastly

### 3. Database Indexing
Already configured in migrations ✅

### 4. Redis Caching
Already configured ✅

---

## 🔒 Security Checklist

- [ ] Changed all default passwords
- [ ] Using HTTPS everywhere
- [ ] Enabled firewall (ufw)
- [ ] Rate limiting configured
- [ ] CORS properly configured
- [ ] Security headers enabled
- [ ] Regular backups automated
- [ ] Monitoring setup
- [ ] Logs being collected
- [ ] 2FA enabled for admin accounts

---

## 📝 Post-Deployment

### 1. Update Admin Password
```bash
docker exec -it proptradepro-backend bash
python -c "from src.models import User; from src.database import db; from src.app import create_app; app = create_app(); app.app_context().push(); admin = User.query.filter_by(email='admin@proptradepro.com').first(); admin.set_password('NEW_SECURE_PASSWORD'); db.session.commit(); print('Password updated!')"
```

### 2. Test All Features
- [ ] User registration
- [ ] Email verification
- [ ] Login / Logout
- [ ] 2FA setup
- [ ] Password reset
- [ ] Program browsing
- [ ] Stripe checkout
- [ ] Challenge creation
- [ ] KYC upload
- [ ] Admin panel
- [ ] User management

### 3. Monitor for 24 Hours
- Check error logs
- Monitor server resources
- Watch for failed payments
- Review email delivery

---

## 🎉 Congratulations!

Your MarketEdgePros platform is now live! 🚀

**Next Steps:**
1. Start marketing
2. Onboard first users
3. Collect feedback
4. Iterate and improve

**Support:**
- GitHub Issues: https://github.com/tradege/MarketEdgePros/issues
- Documentation: See README.md and API_DOCUMENTATION.md

---

## 📊 Estimated Costs

### Minimum Setup (DigitalOcean)
- Droplet (2GB): $12/month
- Managed PostgreSQL: $15/month
- Managed Redis: $10/month
- Domain: $12/year
- **Total: ~$37/month + $12/year**

### Recommended Setup
- Droplet (4GB): $24/month
- Managed PostgreSQL: $15/month
- Managed Redis: $10/month
- Domain: $12/year
- Sentry: $26/month
- **Total: ~$75/month + $12/year**

### Services (Pay-as-you-go)
- SendGrid: Free up to 100 emails/day
- Stripe: 2.9% + $0.30 per transaction
- AWS S3: ~$5/month (if used)

---

**Last Updated:** October 17, 2025  
**Version:** 1.0.0

