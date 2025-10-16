"""
Authentication routes
"""
from flask import Blueprint, request, jsonify, g
from src.services.auth_service import AuthService
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
            tenant_id=data.get('tenant_id')
        )
        
        # TODO: Send verification email
        
        return jsonify({
            'message': 'User registered successfully',
            'user': user.to_dict(),
            'verification_token': verification_token.token  # Remove in production
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
    """Verify email with token"""
    try:
        user = AuthService.verify_email(token)
        
        return jsonify({
            'message': 'Email verified successfully',
            'user': user.to_dict()
        }), 200
        
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': 'Email verification failed'}), 500


@auth_bp.route('/password/reset-request', methods=['POST'])
def request_password_reset():
    """Request password reset"""
    data = request.get_json()
    
    if 'email' not in data:
        return jsonify({'error': 'Email is required'}), 400
    
    try:
        reset_token = AuthService.request_password_reset(data['email'])
        
        # TODO: Send password reset email
        
        # Always return success (don't reveal if email exists)
        return jsonify({
            'message': 'If the email exists, a password reset link has been sent',
            'reset_token': reset_token.token if reset_token else None  # Remove in production
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Password reset request failed'}), 500


@auth_bp.route('/password/reset', methods=['POST'])
def reset_password():
    """Reset password with token"""
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

