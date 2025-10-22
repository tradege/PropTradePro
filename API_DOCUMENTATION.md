# MarketEdgePros API Documentation

Base URL: `http://localhost:5000/api/v1`

---

## 🔐 Authentication

All authenticated endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your_access_token>
```

---

## 📋 Endpoints

### Health & Info

#### GET /health
Check API health status

**Response:**
```json
{
  "status": "healthy",
  "service": "MarketEdgePros API",
  "version": "1.0.0"
}
```

---

## 👤 Authentication Endpoints

### POST /auth/register
Register a new user

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "first_name": "John",
  "last_name": "Doe",
  "phone": "+1234567890",
  "country_code": "US"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "is_verified": false
  }
}
```

---

### POST /auth/login
Login user

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response (without 2FA):**
```json
{
  "message": "Login successful",
  "user": { ... },
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

**Response (with 2FA enabled):**
```json
{
  "message": "2FA required",
  "requires_2fa": true,
  "user_id": 1
}
```

---

### POST /auth/login/2fa
Complete login with 2FA

**Request Body:**
```json
{
  "user_id": 1,
  "token": "123456"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": { ... },
  "access_token": "...",
  "refresh_token": "..."
}
```

---

### POST /auth/logout
Logout user (revoke token)

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "message": "Logout successful"
}
```

---

### POST /auth/refresh
Refresh access token

**Request Body:**
```json
{
  "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

**Response:**
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

---

### GET /auth/verify-email/:token
Verify email address

**Response:**
```json
{
  "message": "Email verified successfully",
  "user": { ... }
}
```

---

### POST /auth/password/reset-request
Request password reset

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "message": "If the email exists, a password reset link has been sent"
}
```

---

### POST /auth/password/reset
Reset password with token

**Request Body:**
```json
{
  "token": "reset_token_here",
  "new_password": "NewSecurePass123!"
}
```

**Response:**
```json
{
  "message": "Password reset successfully"
}
```

---

### POST /auth/2fa/enable
Enable 2FA for current user

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "message": "2FA secret generated",
  "uri": "otpauth://totp/MarketEdgePros:user@example.com?secret=...",
  "secret": "JBSWY3DPEHPK3PXP"
}
```

---

### POST /auth/2fa/confirm
Confirm and activate 2FA

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "token": "123456"
}
```

**Response:**
```json
{
  "message": "2FA enabled successfully"
}
```

---

### POST /auth/2fa/disable
Disable 2FA

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "password": "YourPassword123!"
}
```

**Response:**
```json
{
  "message": "2FA disabled successfully"
}
```

---

### GET /auth/me
Get current user info

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "is_verified": true,
    "two_factor_enabled": false,
    "kyc_status": "pending"
  }
}
```

---

## 📊 Trading Programs

### GET /programs/
Get all active trading programs

**Query Parameters:**
- `tenant_id` (optional): Filter by tenant

**Response:**
```json
{
  "programs": [
    {
      "id": 1,
      "name": "Two Phase Challenge",
      "type": "two_phase",
      "account_size": 100000.00,
      "profit_target": 10.00,
      "max_daily_loss": 5.00,
      "max_total_loss": 10.00,
      "price": 499.00,
      "profit_split": 80.00
    }
  ]
}
```

---

### GET /programs/:id
Get specific program with add-ons

**Response:**
```json
{
  "id": 1,
  "name": "Two Phase Challenge",
  "addons": [
    {
      "id": 1,
      "name": "Bi-Weekly Payouts",
      "price": 99.00,
      "price_type": "fixed"
    }
  ]
}
```

---

### POST /programs/:id/purchase
Purchase a trading program

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "addon_ids": [1, 2]
}
```

**Response:**
```json
{
  "message": "Challenge created, awaiting payment",
  "challenge": {
    "id": 1,
    "status": "pending",
    "payment_status": "pending"
  },
  "total_price": 697.00,
  "payment_required": true
}
```

---

### GET /programs/my-challenges
Get current user's challenges

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "challenges": [
    {
      "id": 1,
      "program_id": 1,
      "status": "active",
      "current_balance": 105000.00,
      "total_profit": 5000.00,
      "progress": 50.00
    }
  ]
}
```

---

### GET /programs/challenges/:id
Get specific challenge details

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "id": 1,
  "status": "active",
  "program": { ... },
  "current_balance": 105000.00,
  "progress": 50.00
}
```

---

## 💳 Payments

### POST /payments/create-payment-intent
Create payment intent for challenge

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "challenge_id": 1
}
```

**Response:**
```json
{
  "message": "Payment intent created",
  "payment": {
    "client_secret": "pi_xxx_secret_xxx",
    "payment_intent_id": "pi_xxx",
    "amount": 499.00,
    "currency": "usd"
  }
}
```

---

### POST /payments/confirm-payment
Confirm payment after Stripe payment

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "payment_intent_id": "pi_xxx"
}
```

**Response:**
```json
{
  "message": "Payment confirmed successfully",
  "challenge": { ... }
}
```

---

### POST /payments/webhook
Stripe webhook endpoint (for Stripe to call)

**Headers:** `Stripe-Signature: xxx`

---

### POST /payments/refund/:challenge_id
Request refund

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "reason": "requested_by_customer"
}
```

**Response:**
```json
{
  "message": "Refund processed successfully",
  "refund": {
    "refund_id": "re_xxx",
    "amount": 499.00,
    "status": "succeeded"
  }
}
```

---

## 📁 File Uploads

### POST /uploads/kyc
Upload KYC document

**Headers:** `Authorization: Bearer <token>`

**Form Data:**
- `file`: Document file (PDF, DOC, DOCX)
- `document_type`: Type of document (id, proof_of_address, etc.)

**Response:**
```json
{
  "message": "KYC document uploaded successfully",
  "file": {
    "filename": "kyc_1_id_abc123.pdf",
    "url": "/uploads/kyc/1/kyc_1_id_abc123.pdf",
    "size": 245678
  }
}
```

---

### POST /uploads/profile-image
Upload profile image

**Headers:** `Authorization: Bearer <token>`

**Form Data:**
- `file`: Image file (PNG, JPG, JPEG, GIF, WEBP)

**Response:**
```json
{
  "message": "Profile image uploaded successfully",
  "file": {
    "filename": "profile_1.jpg",
    "url": "/uploads/profiles/profile_1.jpg"
  }
}
```

---

## 🔒 Admin Endpoints

### POST /programs/ (Admin Only)
Create new trading program

**Headers:** `Authorization: Bearer <admin_token>`

**Request Body:**
```json
{
  "name": "Three Phase Challenge",
  "type": "three_phase",
  "account_size": 200000.00,
  "profit_target": 10.00,
  "max_daily_loss": 5.00,
  "max_total_loss": 10.00,
  "price": 799.00,
  "profit_split": 90.00
}
```

---

## 📝 Error Responses

All errors follow this format:

```json
{
  "error": "Error message here"
}
```

### Common HTTP Status Codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

---

## 🧪 Testing with Stripe

### Test Card Numbers:
- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **Requires Authentication**: `4000 0025 0000 3155`

**Expiry**: Any future date  
**CVC**: Any 3 digits  
**ZIP**: Any 5 digits

---

## 🔄 Typical User Flow

1. **Register**: `POST /auth/register`
2. **Verify Email**: Click link in email → `GET /auth/verify-email/:token`
3. **Login**: `POST /auth/login`
4. **Browse Programs**: `GET /programs/`
5. **Purchase Program**: `POST /programs/:id/purchase`
6. **Create Payment**: `POST /payments/create-payment-intent`
7. **Pay with Stripe**: Use Stripe.js on frontend
8. **Confirm Payment**: `POST /payments/confirm-payment`
9. **Upload KYC**: `POST /uploads/kyc`
10. **View Challenge**: `GET /programs/my-challenges`

---

**For more details, see the source code in `backend/src/routes/`**

