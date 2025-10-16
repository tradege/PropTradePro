"""
Authentication service with JWT and 2FA support
"""
from src.database import db, get_redis
from src.models import User, EmailVerificationToken, PasswordResetToken
from datetime import datetime, timedelta
from flask import current_app
import secrets


class AuthService:
    """Authentication service"""
    
    @staticmethod
    def register_user(email, password, first_name, last_name, **kwargs):
        """Register a new user"""
        # Check if user already exists
        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            raise ValueError('Email already registered')
        
        # Create new user
        user = User(
            email=email,
            first_name=first_name,
            last_name=last_name,
            **kwargs
        )
        user.set_password(password)
        
        db.session.add(user)
        db.session.commit()
        
        # Generate email verification token
        verification_token = EmailVerificationToken(user.id)
        db.session.add(verification_token)
        db.session.commit()
        
        return user, verification_token
    
    @staticmethod
    def login_user(email, password, ip_address=None):
        """Login user with email and password"""
        user = User.query.filter_by(email=email).first()
        
        if not user or not user.check_password(password):
            raise ValueError('Invalid email or password')
        
        if not user.is_active:
            raise ValueError('Account is deactivated')
        
        # Update last login
        user.update_last_login(ip_address)
        
        return user
    
    @staticmethod
    def verify_2fa(user, token):
        """Verify 2FA token"""
        if not user.two_factor_enabled:
            raise ValueError('2FA is not enabled for this user')
        
        if not user.verify_2fa_token(token):
            raise ValueError('Invalid 2FA token')
        
        return True
    
    @staticmethod
    def enable_2fa(user):
        """Enable 2FA for user"""
        if user.two_factor_enabled:
            raise ValueError('2FA is already enabled')
        
        # Generate secret
        secret = user.generate_2fa_secret()
        db.session.commit()
        
        return user.get_2fa_uri()
    
    @staticmethod
    def confirm_2fa(user, token):
        """Confirm and activate 2FA"""
        if user.two_factor_enabled:
            raise ValueError('2FA is already enabled')
        
        if not user.two_factor_secret:
            raise ValueError('2FA secret not generated')
        
        if not user.verify_2fa_token(token):
            raise ValueError('Invalid 2FA token')
        
        user.two_factor_enabled = True
        db.session.commit()
        
        return True
    
    @staticmethod
    def disable_2fa(user, password):
        """Disable 2FA for user"""
        if not user.check_password(password):
            raise ValueError('Invalid password')
        
        user.two_factor_enabled = False
        user.two_factor_secret = None
        db.session.commit()
        
        return True
    
    @staticmethod
    def verify_email(token_string):
        """Verify email with token"""
        token = EmailVerificationToken.query.filter_by(token=token_string).first()
        
        if not token or not token.is_valid():
            raise ValueError('Invalid or expired token')
        
        user = token.user
        user.is_verified = True
        user.email_verified_at = datetime.utcnow()
        token.mark_as_used()
        
        db.session.commit()
        
        return user
    
    @staticmethod
    def request_password_reset(email):
        """Request password reset"""
        user = User.query.filter_by(email=email).first()
        
        if not user:
            # Don't reveal if email exists
            return None
        
        # Create reset token
        reset_token = PasswordResetToken(user.id)
        db.session.add(reset_token)
        db.session.commit()
        
        return reset_token
    
    @staticmethod
    def reset_password(token_string, new_password):
        """Reset password with token"""
        token = PasswordResetToken.query.filter_by(token=token_string).first()
        
        if not token or not token.is_valid():
            raise ValueError('Invalid or expired token')
        
        user = token.user
        user.set_password(new_password)
        token.mark_as_used()
        
        db.session.commit()
        
        return user
    
    @staticmethod
    def refresh_access_token(refresh_token):
        """Refresh access token using refresh token"""
        payload = User.verify_token(refresh_token, token_type='refresh')
        
        if not payload:
            raise ValueError('Invalid refresh token')
        
        user = User.query.get(payload['user_id'])
        
        if not user or not user.is_active:
            raise ValueError('User not found or inactive')
        
        return user.generate_access_token()
    
    @staticmethod
    def revoke_token(token):
        """Revoke a token by adding it to blacklist (Redis)"""
        redis_client = get_redis()
        if not redis_client:
            return False
        
        payload = User.verify_token(token)
        if not payload:
            return False
        
        # Calculate TTL (time until expiration)
        exp = datetime.fromtimestamp(payload['exp'])
        ttl = int((exp - datetime.utcnow()).total_seconds())
        
        if ttl > 0:
            # Add to blacklist with TTL
            redis_client.setex(f'blacklist:{token}', ttl, '1')
        
        return True
    
    @staticmethod
    def is_token_blacklisted(token):
        """Check if token is blacklisted"""
        redis_client = get_redis()
        if not redis_client:
            return False
        
        return redis_client.exists(f'blacklist:{token}')

