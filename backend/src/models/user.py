"""
User model with authentication and security features
"""
from src.database import db, TimestampMixin
from werkzeug.security import generate_password_hash, check_password_hash
import pyotp
import secrets
from datetime import datetime, timedelta
import jwt
from flask import current_app


class User(db.Model, TimestampMixin):
    """User model with authentication support"""
    
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    
    # Personal Information
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(20))
    country_code = db.Column(db.String(2))
    date_of_birth = db.Column(db.Date)
    avatar_url = db.Column(db.String(500))  # Profile picture URL
    
    # Account Status
    is_active = db.Column(db.Boolean, default=True, nullable=False)
    is_verified = db.Column(db.Boolean, default=False, nullable=False)
    email_verified_at = db.Column(db.DateTime)
    
    # Two-Factor Authentication
    two_factor_enabled = db.Column(db.Boolean, default=False, nullable=False)
    two_factor_secret = db.Column(db.String(32))
    
    # KYC Status
    kyc_status = db.Column(db.String(20), default='not_submitted')  # not_submitted, pending, approved, rejected
    kyc_submitted_at = db.Column(db.DateTime)
    kyc_verified_at = db.Column(db.DateTime)
    kyc_approved_at = db.Column(db.DateTime)
    kyc_approved_by = db.Column(db.Integer)  # Admin user ID
    kyc_rejected_at = db.Column(db.DateTime)
    kyc_rejected_by = db.Column(db.Integer)  # Admin user ID
    kyc_rejection_reason = db.Column(db.Text)
    kyc_admin_notes = db.Column(db.Text)
    
    # KYC Documents - ID Proof
    kyc_id_status = db.Column(db.String(20), default='not_uploaded')  # not_uploaded, pending, approved, rejected
    kyc_id_url = db.Column(db.String(500))  # Document URL
    kyc_id_uploaded_at = db.Column(db.DateTime)
    kyc_id_notes = db.Column(db.Text)
    
    # KYC Documents - Address Proof
    kyc_address_status = db.Column(db.String(20), default='not_uploaded')
    kyc_address_url = db.Column(db.String(500))
    kyc_address_uploaded_at = db.Column(db.DateTime)
    kyc_address_notes = db.Column(db.Text)
    
    # KYC Documents - Selfie
    kyc_selfie_status = db.Column(db.String(20), default='not_uploaded')
    kyc_selfie_url = db.Column(db.String(500))
    kyc_selfie_uploaded_at = db.Column(db.DateTime)
    kyc_selfie_notes = db.Column(db.Text)
    
    # KYC Documents - Bank Statement
    kyc_bank_status = db.Column(db.String(20), default='not_uploaded')
    kyc_bank_url = db.Column(db.String(500))
    kyc_bank_uploaded_at = db.Column(db.DateTime)
    kyc_bank_notes = db.Column(db.Text)
    
    # Role and Permissions
    role = db.Column(db.String(20), default='trader', nullable=False)  # supermaster, master, agent, trader
    
    # Hierarchy (MLM Structure)
    parent_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True, index=True)  # Who created this user
    level = db.Column(db.Integer, default=0, nullable=False, index=True)  # Depth in hierarchy (0 = top)
    tree_path = db.Column(db.String(500), index=True)  # Path in tree: "1/5/23/45" for fast queries
    commission_rate = db.Column(db.Numeric(5, 2), default=0.00)  # Custom commission rate for this user
    
    # Tenant (White Label)
    tenant_id = db.Column(db.Integer, db.ForeignKey('tenants.id'), nullable=True)
    
    # Last Login
    last_login_at = db.Column(db.DateTime)
    last_login_ip = db.Column(db.String(45))
    
    # Relationships
    tenant = db.relationship('Tenant', back_populates='users')
    challenges = db.relationship('Challenge', back_populates='user', lazy='dynamic')
    
    # Hierarchy Relationships
    parent = db.relationship('User', remote_side=[id], backref='children', foreign_keys=[parent_id])
    # children accessible via backref
    
    def __repr__(self):
        return f'<User {self.email}>'
    
    def set_password(self, password):
        """Hash and set password"""
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        """Verify password"""
        return check_password_hash(self.password_hash, password)
    
    def generate_2fa_secret(self):
        """Generate new 2FA secret"""
        self.two_factor_secret = pyotp.random_base32()
        return self.two_factor_secret
    
    def get_2fa_uri(self):
        """Get 2FA URI for QR code"""
        if not self.two_factor_secret:
            self.generate_2fa_secret()
        
        totp = pyotp.TOTP(self.two_factor_secret)
        return totp.provisioning_uri(
            name=self.email,
            issuer_name='PropTradePro'
        )
    
    def verify_2fa_token(self, token):
        """Verify 2FA token"""
        if not self.two_factor_enabled or not self.two_factor_secret:
            return False
        
        totp = pyotp.TOTP(self.two_factor_secret)
        return totp.verify(token, valid_window=1)
    
    def generate_access_token(self):
        """Generate JWT access token"""
        now = datetime.utcnow()
        expires_delta = current_app.config['JWT_ACCESS_TOKEN_EXPIRES']
        payload = {
            'user_id': self.id,
            'email': self.email,
            'role': self.role,
            'tenant_id': self.tenant_id,
            'exp': now + expires_delta,
            'iat': now,
            'type': 'access'
        }
        
        return jwt.encode(
            payload,
            current_app.config['JWT_SECRET_KEY'],
            algorithm='HS256'
        )
    
    def generate_refresh_token(self):
        """Generate JWT refresh token"""
        now = datetime.utcnow()
        expires_delta = current_app.config['JWT_REFRESH_TOKEN_EXPIRES']
        payload = {
            'user_id': self.id,
            'exp': now + expires_delta,
            'iat': now,
            'type': 'refresh'
        }
        
        return jwt.encode(
            payload,
            current_app.config['JWT_SECRET_KEY'],
            algorithm='HS256'
        )
    
    @staticmethod
    def verify_token(token, token_type='access'):
        """Verify JWT token"""
        try:
            payload = jwt.decode(
                token,
                current_app.config['JWT_SECRET_KEY'],
                algorithms=['HS256']
            )
            
            if payload.get('type') != token_type:
                return None
            
            return payload
        except jwt.ExpiredSignatureError:
            return None
        except jwt.InvalidTokenError:
            return None
    
    def update_last_login(self, ip_address=None):
        """Update last login timestamp and IP"""
        self.last_login_at = datetime.utcnow()
        if ip_address:
            self.last_login_ip = ip_address
        db.session.commit()
    
    # Hierarchy Methods
    def get_all_descendants(self):
        """Get all users in the downline (recursive)"""
        descendants = []
        for child in self.children:
            descendants.append(child)
            descendants.extend(child.get_all_descendants())
        return descendants
    
    def get_direct_children(self):
        """Get only direct children (1 level down)"""
        return self.children
    
    def get_ancestors(self):
        """Get all users in the upline"""
        ancestors = []
        current = self.parent
        while current:
            ancestors.append(current)
            current = current.parent
        return ancestors
    
    def update_tree_path(self):
        """Update tree_path based on parent"""
        if self.parent:
            parent_path = self.parent.tree_path or str(self.parent.id)
            self.tree_path = f"{parent_path}/{self.id}"
        else:
            self.tree_path = str(self.id)
    
    def can_create_user(self, target_role):
        """Check if this user can create a user with target_role"""
        role_hierarchy = {
            'supermaster': ['supermaster', 'master', 'agent', 'trader'],
            'master': ['master', 'agent', 'trader'],
            'agent': ['agent', 'trader'],
            'trader': []  # Traders cannot create users
        }
        return target_role in role_hierarchy.get(self.role, [])
    
    def get_downline_count(self):
        """Get total count of users in downline"""
        return len(self.get_all_descendants())
    
    def get_downline_by_level(self, max_level=None):
        """Get downline organized by level"""
        result = {}
        for user in self.get_all_descendants():
            level_diff = user.level - self.level
            if max_level and level_diff > max_level:
                continue
            if level_diff not in result:
                result[level_diff] = []
            result[level_diff].append(user)
        return result
    
    def to_dict(self, include_sensitive=False):
        """Convert user to dictionary"""
        data = {
            'id': self.id,
            'email': self.email,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'phone': self.phone,
            'country_code': self.country_code,
            'is_active': self.is_active,
            'is_verified': self.is_verified,
            'two_factor_enabled': self.two_factor_enabled,
            'kyc_status': self.kyc_status,
            'role': self.role,
            'tenant_id': self.tenant_id,
            'avatar_url': self.avatar_url,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'last_login_at': self.last_login_at.isoformat() if self.last_login_at else None
        }
        
        if include_sensitive:
            data['email_verified_at'] = self.email_verified_at.isoformat() if self.email_verified_at else None
            data['kyc_submitted_at'] = self.kyc_submitted_at.isoformat() if self.kyc_submitted_at else None
            data['kyc_verified_at'] = self.kyc_verified_at.isoformat() if self.kyc_verified_at else None
        
        return data


class EmailVerificationToken(db.Model, TimestampMixin):
    """Email verification tokens"""
    
    __tablename__ = 'email_verification_tokens'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    code = db.Column(db.String(6), nullable=False, index=True)  # 6-digit code
    token = db.Column(db.String(64), unique=True, nullable=False, index=True)  # For URL verification
    expires_at = db.Column(db.DateTime, nullable=False)
    used = db.Column(db.Boolean, default=False, nullable=False)
    
    user = db.relationship('User', backref='verification_tokens')
    
    def __init__(self, user_id, expires_in_hours=24):
        self.user_id = user_id
        self.code = ''.join([str(secrets.randbelow(10)) for _ in range(6)])  # Generate 6-digit code
        self.token = secrets.token_urlsafe(32)  # For URL-based verification
        self.expires_at = datetime.utcnow() + timedelta(hours=expires_in_hours)
    
    def is_valid(self):
        """Check if token is valid"""
        return not self.used and datetime.utcnow() < self.expires_at
    
    def mark_as_used(self):
        """Mark token as used"""
        self.used = True
        db.session.commit()


class PasswordResetToken(db.Model, TimestampMixin):
    """Password reset tokens"""
    
    __tablename__ = 'password_reset_tokens'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    code = db.Column(db.String(6), nullable=False, index=True)  # 6-digit code
    token = db.Column(db.String(64), unique=True, nullable=False, index=True)  # For URL reset
    expires_at = db.Column(db.DateTime, nullable=False)
    used = db.Column(db.Boolean, default=False, nullable=False)
    
    user = db.relationship('User', backref='reset_tokens')
    
    def __init__(self, user_id, expires_in_minutes=15):
        self.user_id = user_id
        self.code = ''.join([str(secrets.randbelow(10)) for _ in range(6)])  # Generate 6-digit code
        self.token = secrets.token_urlsafe(32)  # For URL-based reset
        self.expires_at = datetime.utcnow() + timedelta(minutes=expires_in_minutes)
    
    def is_valid(self):
        """Check if token is valid"""
        return not self.used and datetime.utcnow() < self.expires_at
    
    def mark_as_used(self):
        """Mark token as used"""
        self.used = True
        db.session.commit()

