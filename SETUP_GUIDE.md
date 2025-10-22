# MarketEdgePros - Setup Guide

This guide will help you set up and run the MarketEdgePros platform locally.

---

## 📋 Prerequisites

Before you begin, make sure you have:

- **Docker** and **Docker Compose** installed
- **Git** installed
- A **SendGrid** account (free tier available)
- A **Stripe** account (test mode is free)

---

## 🚀 Quick Start (5 Minutes)

### Step 1: Clone the Repository

```bash
git clone https://github.com/tradege/MarketEdgePros.git
cd MarketEdgePros
```

### Step 2: Create Environment File

```bash
cd backend
cp .env.example .env
```

### Step 3: Configure Environment Variables

Open `backend/.env` and update these values:

```env
# Required: Change these!
SECRET_KEY=your-random-secret-key-here
JWT_SECRET_KEY=your-jwt-secret-key-here

# Database (default values work for Docker)
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/proptradepro_dev
REDIS_URL=redis://redis:6379/0

# SendGrid (get from Step 4)
SENDGRID_API_KEY=SG.your_actual_api_key_here
SENDGRID_FROM_EMAIL=Bengab1113@gmail.com

# Stripe (get from Step 5)
STRIPE_SECRET_KEY=sk_test_your_actual_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

### Step 4: Start the Application

```bash
cd ..  # Back to root directory
make up
```

That's it! The API is now running at: **http://localhost:5000**

---

## 🔧 Detailed Setup

### 1. Generate Secret Keys

You need to generate secure random keys for `SECRET_KEY` and `JWT_SECRET_KEY`.

**Option A: Using Python**
```bash
python3 -c "import secrets; print(secrets.token_urlsafe(32))"
```

**Option B: Using OpenSSL**
```bash
openssl rand -base64 32
```

Copy the output and paste it into your `.env` file.

---

### 2. SendGrid Setup (Email Service)

SendGrid allows you to send up to **100 emails/day for free**.

#### Steps:

1. **Sign up**: Go to https://signup.sendgrid.com/
2. **Verify your email**: Check Bengab1113@gmail.com for verification email
3. **Create API Key**:
   - Go to Settings → API Keys
   - Click "Create API Key"
   - Name: "MarketEdgePros"
   - Permissions: "Full Access"
   - Click "Create & View"
4. **Copy the API Key**: It starts with `SG.`
5. **Paste into `.env`**:
   ```env
   SENDGRID_API_KEY=SG.your_actual_key_here
   ```

**Important**: You'll only see the API key once, so copy it immediately!

---

### 3. Stripe Setup (Payment Processing)

Stripe is **completely free in test mode** (no credit card needed).

#### Steps:

1. **Sign up**: Go to https://dashboard.stripe.com/register
2. **Activate Test Mode**: Toggle "Test mode" in the top right
3. **Get API Keys**:
   - Go to Developers → API Keys
   - You'll see two keys:
     - **Publishable key**: Starts with `pk_test_`
     - **Secret key**: Click "Reveal test key" - starts with `sk_test_`
4. **Paste into `.env`**:
   ```env
   STRIPE_SECRET_KEY=sk_test_your_actual_key_here
   STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_key_here
   ```

5. **Get Webhook Secret** (optional for now):
   - Go to Developers → Webhooks
   - Click "Add endpoint"
   - Endpoint URL: `http://localhost:5000/api/v1/payments/webhook`
   - Events: Select "payment_intent.succeeded" and "payment_intent.payment_failed"
   - Copy the signing secret (starts with `whsec_`)
   - Paste into `.env`

---

### 4. Database Setup

The database is automatically created when you run `make up`.

To manually run migrations:

```bash
make db-upgrade
```

To create a new migration:

```bash
make db-migrate message="Add new feature"
```

---

## 🎯 Testing the API

### Health Check

```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "status": "healthy",
  "service": "MarketEdgePros API",
  "version": "1.0.0"
}
```

### Register a User

```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!@#",
    "first_name": "John",
    "last_name": "Doe"
  }'
```

You should receive a verification email at the address you specified!

---

## 📚 Available Commands

```bash
make help          # Show all available commands
make build         # Build Docker containers
make up            # Start all services
make down          # Stop all services
make logs          # View logs
make shell         # Open backend shell
make db-shell      # Open PostgreSQL shell
make test          # Run tests
make clean         # Clean up everything
```

---

## 🔍 Troubleshooting

### Port Already in Use

If you get "port already in use" error:

```bash
# Stop the conflicting service
docker-compose down

# Or change the port in docker-compose.yml
ports:
  - "5001:5000"  # Change 5000 to 5001
```

### Database Connection Error

```bash
# Restart PostgreSQL
docker-compose restart postgres

# Check if it's running
docker-compose ps
```

### SendGrid Not Sending Emails

1. Check if API key is correct in `.env`
2. Verify your sender email in SendGrid dashboard
3. Check SendGrid logs: Settings → Activity

### Stripe Payments Not Working

1. Make sure you're in **Test Mode**
2. Use test card: `4242 4242 4242 4242`
3. Any future expiry date
4. Any 3-digit CVC

---

## 🌐 API Endpoints

Once running, you can access:

- **API Root**: http://localhost:5000/
- **Health Check**: http://localhost:5000/health
- **Auth Endpoints**: http://localhost:5000/api/v1/auth/
- **Programs**: http://localhost:5000/api/v1/programs/
- **Payments**: http://localhost:5000/api/v1/payments/
- **Uploads**: http://localhost:5000/api/v1/uploads/

---

## 📖 Next Steps

1. **Test the API** using Postman or curl
2. **Build the Frontend** (coming in Phase 3)
3. **Set up MetaTrader integration** (Phase 4)
4. **Deploy to production** (Phase 6)

---

## 🆘 Need Help?

- Check the logs: `make logs`
- Open an issue on GitHub
- Review the code in `backend/src/`

---

## 🎉 You're All Set!

Your MarketEdgePros backend is now running with:

✅ PostgreSQL database  
✅ Redis cache  
✅ JWT authentication  
✅ 2FA support  
✅ Email service (SendGrid)  
✅ Payment processing (Stripe)  
✅ File uploads  
✅ Multi-tenant support  

**Happy coding!** 🚀

