"""
Authentication routes
"""
from flask import Blueprint, request, jsonify, g
from src.services.auth_service import AuthService
from src.services.email_service import EmailService
from src.utils.decorators import token_required
from src.utils.validators import (
    validate_email_format,
    validate_password_strength,
    validate_required_fields
)

auth_bp = Blueprint('auth', __name__)


@auth_bp.route('/register', methods=['POST'])
def register():
    """Register a new user"""
    data = request.get_json()
    
    # Validate required fields
    valid, message = validate_required_fields(
        data, 
        ['email', 'password', 'first_name', 'last_name']
    )
    if not valid:
        return jsonify({'error': message}), 400
    
    # Validate email
    valid, result = validate_email_format(data['email'])
    if not valid:
        return jsonify({'error': f'Invalid email: {result}'}), 400
    email = result
    
    # Validate password
    valid, message = validate_password_strength(data['password'])
    if not valid:
        return jsonify({'error': message}), 400
    
    try:
        # Register user
        user, verification_token = AuthService.register_user(
            email=email,
            password=data['password'],
            first_name=data['first_name'],
            last_name=data['last_name'],
            phone=data.get('phone'),
            country_code=data.get('country_code'),
            tenant_id=data.get('tenant_id'),
            referral_code=data.get('referral_code')  # Support referral code
        )
        
        # Send verification email with code
        EmailService.send_verification_email(user, verification_token.code)
        
        return jsonify({
            'message': 'User registered successfully. Please check your email for verification code.',
            'user': user.to_dict(),
            'verification_code': verification_token.code  # Remove in production
        }), 201
        
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': 'Registration failed'}), 500


@auth_bp.route('/login', methods=['POST'])
def login():
    """Login user"""
    data = request.get_json()
    
    # Validate required fields
    valid, message = validate_required_fields(data, ['email', 'password'])
    if not valid:
        return jsonify({'error': message}), 400
    
    try:
        # Get IP address
        ip_address = request.remote_addr
        
        # Login user
        user = AuthService.login_user(
            email=data['email'],
            password=data['password'],
            ip_address=ip_address
        )
        
        # Check if 2FA is enabled
        if user.two_factor_enabled:
            # Don't generate tokens yet, wait for 2FA
            return jsonify({
                'message': '2FA required',
                'requires_2fa': True,
                'user_id': user.id
            }), 200
        
        # Generate tokens
        access_token = user.generate_access_token()
        refresh_token = user.generate_refresh_token()
        
        return jsonify({
            'message': 'Login successful',
            'user': user.to_dict(),
            'access_token': access_token,
            'refresh_token': refresh_token
        }), 200
        
    except ValueError as e:
        return jsonify({'error': str(e)}), 401
    except Exception as e:
        return jsonify({'error': 'Login failed'}), 500


@auth_bp.route('/login/2fa', methods=['POST'])
def login_2fa():
    """Complete login with 2FA"""
    data = request.get_json()
    
    # Validate required fields
    valid, message = validate_required_fields(data, ['user_id', 'token'])
    if not valid:
        return jsonify({'error': message}), 400
    
    try:
        from src.models import User
        
        user = User.query.get(data['user_id'])
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Verify 2FA token
        AuthService.verify_2fa(user, data['token'])
        
        # Generate tokens
        access_token = user.generate_access_token()
        refresh_token = user.generate_refresh_token()
        
        return jsonify({
            'message': 'Login successful',
            'user': user.to_dict(),
            'access_token': access_token,
            'refresh_token': refresh_token
        }), 200
        
    except ValueError as e:
        return jsonify({'error': str(e)}), 401
    except Exception as e:
        return jsonify({'error': '2FA verification failed'}), 500


@auth_bp.route('/logout', methods=['POST'])
@token_required
def logout():
    """Logout user (revoke token)"""
    try:
        # Revoke current token
        AuthService.revoke_token(g.token)
        
        return jsonify({'message': 'Logout successful'}), 200
        
    except Exception as e:
        return jsonify({'error': 'Logout failed'}), 500


@auth_bp.route('/refresh', methods=['POST'])
def refresh_token():
    """Refresh access token"""
    data = request.get_json()
    
    if 'refresh_token' not in data:
        return jsonify({'error': 'Refresh token is required'}), 400
    
    try:
        access_token = AuthService.refresh_access_token(data['refresh_token'])
        
        return jsonify({
            'access_token': access_token
        }), 200
        
    except ValueError as e:
        return jsonify({'error': str(e)}), 401
    except Exception as e:
        return jsonify({'error': 'Token refresh failed'}), 500


@auth_bp.route('/verify-email/<token>', methods=['GET'])
def verify_email(token):
    """Verify email with token (URL-based)"""
    try:
        user = AuthService.verify_email(token)
        
        # Send welcome email
        EmailService.send_welcome_email(user)
        
        return jsonify({
            'message': 'Email verified successfully',
            'user': user.to_dict()
        }), 200
        
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': 'Email verification failed'}), 500


@auth_bp.route('/verify-email', methods=['POST'])
def verify_email_with_code():
    """Verify email with 6-digit code"""
    data = request.get_json()
    
    # Validate required fields
    valid, message = validate_required_fields(data, ['email', 'code'])
    if not valid:
        return jsonify({'error': message}), 400
    
    # Validate code format (6 digits)
    if not data['code'].isdigit() or len(data['code']) != 6:
        return jsonify({'error': 'Code must be 6 digits'}), 400
    
    try:
        user = AuthService.verify_email_with_code(data['email'], data['code'])
        
        # Send welcome email
        EmailService.send_welcome_email(user)
        
        return jsonify({
            'message': 'Email verified successfully',
            'user': user.to_dict()
        }), 200
        
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': 'Email verification failed'}), 500


@auth_bp.route('/resend-verification', methods=['POST'])
def resend_verification():
    """Resend verification code"""
    data = request.get_json()
    
    if 'email' not in data:
        return jsonify({'error': 'Email is required'}), 400
    
    try:
        verification_token = AuthService.resend_verification_code(data['email'])
        
        if verification_token:
            # Send verification email with new code
            EmailService.send_verification_email(verification_token.user, verification_token.code)
        
        # Always return success (don't reveal if email exists)
        return jsonify({
            'message': 'If the email exists and is not verified, a new verification code has been sent',
            'code': verification_token.code if verification_token else None  # Remove in production
        }), 200
        
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': 'Failed to resend verification code'}), 500


@auth_bp.route('/password/reset-request', methods=['POST'])
def request_password_reset():
    """Request password reset"""
    data = request.get_json()
    
    if 'email' not in data:
        return jsonify({'error': 'Email is required'}), 400
    
    try:
        reset_token = AuthService.request_password_reset(data['email'])
        
        # Send password reset email with code
        if reset_token:
            EmailService.send_password_reset_email(reset_token.user, reset_token.code)
        
        # Always return success (don't reveal if email exists)
        return jsonify({
            'message': 'If the email exists, a password reset code has been sent',
            'reset_code': reset_token.code if reset_token else None  # Remove in production
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Password reset request failed'}), 500


@auth_bp.route('/password/reset', methods=['POST'])
def reset_password():
    """Reset password with token (URL-based)"""
    data = request.get_json()
    
    # Validate required fields
    valid, message = validate_required_fields(data, ['token', 'new_password'])
    if not valid:
        return jsonify({'error': message}), 400
    
    # Validate password
    valid, message = validate_password_strength(data['new_password'])
    if not valid:
        return jsonify({'error': message}), 400
    
    try:
        user = AuthService.reset_password(data['token'], data['new_password'])
        
        return jsonify({
            'message': 'Password reset successfully',
            'user': user.to_dict()
        }), 200
        
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': 'Password reset failed'}), 500


@auth_bp.route('/password/verify-code', methods=['POST'])
def verify_reset_code():
    """Verify password reset code"""
    data = request.get_json()
    
    # Validate required fields
    valid, message = validate_required_fields(data, ['email', 'code'])
    if not valid:
        return jsonify({'error': message}), 400
    
    # Validate code format (6 digits)
    if not data['code'].isdigit() or len(data['code']) != 6:
        return jsonify({'error': 'Code must be 6 digits'}), 400
    
    try:
        token = AuthService.verify_reset_code(data['email'], data['code'])
        
        return jsonify({
            'message': 'Reset code verified successfully',
            'valid': True
        }), 200
        
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': 'Code verification failed'}), 500


@auth_bp.route('/password/reset-with-code', methods=['POST'])
def reset_password_with_code():
    """Reset password with 6-digit code"""
    data = request.get_json()
    
    # Validate required fields
    valid, message = validate_required_fields(data, ['email', 'code', 'new_password'])
    if not valid:
        return jsonify({'error': message}), 400
    
    # Validate code format (6 digits)
    if not data['code'].isdigit() or len(data['code']) != 6:
        return jsonify({'error': 'Code must be 6 digits'}), 400
    
    # Validate password
    valid, message = validate_password_strength(data['new_password'])
    if not valid:
        return jsonify({'error': message}), 400
    
    try:
        user = AuthService.reset_password_with_code(
            data['email'],
            data['code'],
            data['new_password']
        )
        
        return jsonify({
            'message': 'Password reset successfully',
            'user': user.to_dict()
        }), 200
        
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': 'Password reset failed'}), 500


@auth_bp.route('/2fa/enable', methods=['POST'])
@token_required
def enable_2fa():
    """Enable 2FA for current user"""
    try:
        uri = AuthService.enable_2fa(g.current_user)
        
        return jsonify({
            'message': '2FA secret generated',
            'uri': uri,
            'secret': g.current_user.two_factor_secret
        }), 200
        
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': '2FA enable failed'}), 500


@auth_bp.route('/2fa/confirm', methods=['POST'])
@token_required
def confirm_2fa():
    """Confirm and activate 2FA"""
    data = request.get_json()
    
    if 'token' not in data:
        return jsonify({'error': 'Token is required'}), 400
    
    try:
        AuthService.confirm_2fa(g.current_user, data['token'])
        
        return jsonify({
            'message': '2FA enabled successfully',
            'user': g.current_user.to_dict()
        }), 200
        
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': '2FA confirmation failed'}), 500


@auth_bp.route('/2fa/disable', methods=['POST'])
@token_required
def disable_2fa():
    """Disable 2FA for current user"""
    data = request.get_json()
    
    if 'password' not in data:
        return jsonify({'error': 'Password is required'}), 400
    
    try:
        AuthService.disable_2fa(g.current_user, data['password'])
        
        return jsonify({
            'message': '2FA disabled successfully',
            'user': g.current_user.to_dict()
        }), 200
        
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': '2FA disable failed'}), 500


@auth_bp.route('/me', methods=['GET'])
@token_required
def get_current_user():
    """Get current user info"""
    return jsonify({
        'user': g.current_user.to_dict(include_sensitive=True)
    }), 200

