# User Dashboard Update - Deployment Guide

## Overview
This guide explains how to deploy the User Dashboard updates to enable real-time data from the API.

## What Was Changed

### Backend Changes
1. **`src/routes/users.py`** - Created new file with `/dashboard` endpoint
2. **`src/config.py`** - Fixed ProductionConfig to handle missing SECRET_KEY
3. **`src/database.py`** - Added graceful Redis connection error handling
4. **`.env`** - Created environment configuration file

### Frontend Changes
1. **`src/pages/user/UserDashboard_mui.jsx`** - Updated to fetch real data from API

## Quick Deployment Steps

### Step 1: Access Remote Server
```bash
ssh root@146.190.21.113
```

### Step 2: Navigate to Backend Directory
```bash
cd /root/PropTradePro/backend  # Adjust path as needed
```

### Step 3: Create users.py File
```bash
nano src/routes/users.py
```

Paste the following content:
```python
"""
User routes for profile and account management
"""
from flask import Blueprint, request, jsonify, g
from src.database import db
from src.models.user import User
from src.models.trading_program import Challenge
from src.models.payment import Payment
from src.utils.decorators import token_required
from datetime import datetime
from sqlalchemy import func, desc

users_bp = Blueprint('users', __name__)


@users_bp.route('/dashboard', methods=['GET'])
@token_required
def get_user_dashboard():
    """Get user dashboard statistics - works for all user types"""
    try:
        user = g.current_user
        
        # Get challenges count
        total_challenges = Challenge.query.filter_by(user_id=user.id).count()
        active_challenges = Challenge.query.filter_by(user_id=user.id, status='active').count()
        passed_challenges = Challenge.query.filter_by(user_id=user.id, status='passed').count()
        failed_challenges = Challenge.query.filter_by(user_id=user.id, status='failed').count()
        funded_challenges = Challenge.query.filter_by(user_id=user.id, status='funded').count()
        
        # Get total profit from all challenges
        challenges = Challenge.query.filter_by(user_id=user.id).all()
        total_profit = 0
        for challenge in challenges:
            if challenge.current_balance and challenge.initial_balance:
                profit = float(challenge.current_balance) - float(challenge.initial_balance)
                if profit > 0:
                    total_profit += profit
        
        # Get payments
        total_spent = db.session.query(func.sum(Payment.amount)).filter(
            Payment.user_id == user.id,
            Payment.status == 'completed',
            Payment.purpose == 'challenge_purchase'
        ).scalar() or 0
        
        # Get recent challenges
        recent_challenges = Challenge.query.filter_by(
            user_id=user.id
        ).order_by(desc(Challenge.created_at)).limit(5).all()
        
        # Calculate success rate
        completed_challenges = passed_challenges + failed_challenges
        success_rate = (passed_challenges / completed_challenges * 100) if completed_challenges > 0 else 0
        
        return jsonify({
            'user': {
                'id': user.id,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'role': user.role,
                'kyc_status': user.kyc_status,
                'is_verified': user.is_verified
            },
            'statistics': {
                'total_challenges': total_challenges,
                'active_challenges': active_challenges,
                'passed_challenges': passed_challenges,
                'failed_challenges': failed_challenges,
                'funded_challenges': funded_challenges,
                'success_rate': round(success_rate, 2),
                'total_profit': round(total_profit, 2),
                'total_spent': float(total_spent)
            },
            'recent_challenges': [{
                'id': challenge.id,
                'program_name': challenge.program.name if challenge.program else 'Unknown',
                'status': challenge.status,
                'phase': challenge.phase,
                'current_balance': float(challenge.current_balance) if challenge.current_balance else 0,
                'initial_balance': float(challenge.initial_balance) if challenge.initial_balance else 0,
                'profit': float(challenge.current_balance or 0) - float(challenge.initial_balance or 0),
                'created_at': challenge.created_at.isoformat() if challenge.created_at else None
            } for challenge in recent_challenges]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@users_bp.route('/profile', methods=['GET'])
@token_required
def get_profile():
    """Get user profile"""
    try:
        user = g.current_user
        return jsonify(user.to_dict()), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@users_bp.route('/profile', methods=['PUT'])
@token_required
def update_profile():
    """Update user profile"""
    try:
        user = g.current_user
        data = request.get_json()
        
        # Update allowed fields
        if 'first_name' in data:
            user.first_name = data['first_name']
        if 'last_name' in data:
            user.last_name = data['last_name']
        if 'phone' in data:
            user.phone = data['phone']
        if 'country_code' in data:
            user.country_code = data['country_code']
        if 'date_of_birth' in data:
            user.date_of_birth = datetime.fromisoformat(data['date_of_birth'])
        
        db.session.commit()
        
        return jsonify({
            'message': 'Profile updated successfully',
            'user': user.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
```

Save and exit (Ctrl+X, Y, Enter)

### Step 4: Verify app.py has users blueprint registered

Check if users blueprint is already registered:
```bash
grep -n "users_bp" src/app.py
```

You should see:
- Line ~60: `from src.routes.users import users_bp`
- Line ~75: `app.register_blueprint(users_bp, url_prefix='/api/v1/users')`

If not present, add these lines to src/app.py.

### Step 5: Update config.py (Optional - for better error handling)
```bash
nano src/config.py
```

Find line 87-89 and change from:
```python
SECRET_KEY = os.getenv('SECRET_KEY')
if not SECRET_KEY:
    raise ValueError('SECRET_KEY must be set in production')
```

To:
```python
SECRET_KEY = os.getenv('SECRET_KEY') or Config.SECRET_KEY
```

### Step 6: Update database.py (Optional - for Redis error handling)
```bash
nano src/database.py
```

Find the `init_db` function and update Redis initialization to:
```python
# Initialize Redis
global redis_client
redis_url = app.config.get('REDIS_URL')
if redis_url:
    try:
        redis_client = redis.from_url(redis_url, decode_responses=True)
        # Test connection
        redis_client.ping()
        app.logger.info('Redis connection established')
    except Exception as e:
        app.logger.warning(f'Redis connection failed: {e}. Continuing without Redis.')
        redis_client = None
```

### Step 7: Restart Backend Server
```bash
# Find backend process
ps aux | grep "python.*app.py"

# Kill the process (replace <PID> with actual process ID)
kill <PID>

# Restart backend
cd /root/PropTradePro/backend
PYTHONPATH=/root/PropTradePro/backend nohup python3.11 src/app.py > backend.log 2>&1 &
```

### Step 8: Verify Backend is Working
```bash
# Test health endpoint
curl http://localhost:5000/health

# Test dashboard endpoint (you'll need a valid token)
# First login to get token, then test dashboard
```

### Step 9: Update Frontend

Navigate to frontend directory:
```bash
cd /root/PropTradePro/frontend
```

Update UserDashboard component:
```bash
nano src/pages/user/UserDashboard_mui.jsx
```

Replace entire content with the updated version (see attached file or copy from sandbox).

### Step 10: Rebuild Frontend (if needed)
```bash
# If using production build
npm run build

# If using pm2
pm2 restart frontend

# If using development server
# Kill existing process and restart
```

## Testing

### Test Backend Endpoint
```bash
# 1. Login to get token
curl -X POST http://146.190.21.113:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "your_email@example.com", "password": "your_password"}'

# 2. Copy access_token from response

# 3. Test dashboard endpoint
curl -X GET http://146.190.21.113:5000/api/v1/users/dashboard \
  -H "Authorization: Bearer <YOUR_ACCESS_TOKEN>"
```

### Test Frontend
1. Open browser: http://146.190.21.113:3000
2. Login with your credentials
3. Navigate to User Dashboard
4. Verify real data is displayed (not mock data)
5. Check browser console for any errors

## Verification Checklist

- [ ] Backend server restarted successfully
- [ ] `/api/v1/users/dashboard` endpoint returns 200 OK
- [ ] Dashboard returns user data with statistics
- [ ] Frontend displays real user data
- [ ] No console errors in browser
- [ ] Stats cards show correct values
- [ ] Recent challenges displayed correctly

## Troubleshooting

### Backend returns 404 for /users/dashboard
- Verify `users.py` file exists in `src/routes/`
- Check `app.py` has users blueprint imported and registered
- Restart backend server

### Backend returns 500 error
- Check `backend.log` for detailed error
- Verify database connection is working
- Check all required Python packages are installed

### Frontend shows mock data
- Check browser console for API errors
- Verify API call is being made (Network tab)
- Check `VITE_API_URL` in frontend `.env`

### Database connection errors
- Verify `.env` file has correct DATABASE_URL
- Check database credentials are correct
- Ensure database allows connections from server

## Files Available in Sandbox

All updated files are available in this sandbox at:
- `/home/ubuntu/PropTradePro/backend/src/routes/users.py`
- `/home/ubuntu/PropTradePro/backend/src/config.py`
- `/home/ubuntu/PropTradePro/backend/src/database.py`
- `/home/ubuntu/PropTradePro/backend/.env`
- `/home/ubuntu/PropTradePro/frontend/src/pages/user/UserDashboard_mui.jsx`

You can download these files and upload to your server.

## Summary

This update adds a new `/users/dashboard` API endpoint that provides real-time user statistics and recent challenges. The frontend User Dashboard component has been updated to fetch and display this real data instead of mock data.

**Estimated Time:** 15-30 minutes
**Difficulty:** Medium
**Risk:** Low (only adds new functionality, doesn't modify existing)

