"""
Admin routes for system management
"""
from flask import Blueprint, request, jsonify, g
from src.database import db
from src.models.user import User
from src.models.challenge import Challenge
from src.models.payment import Payment
from src.models.program import Program
from src.utils.decorators import token_required, admin_required
from src.utils.validators import validate_required_fields, validate_email_format
from datetime import datetime, timedelta
from sqlalchemy import func, and_, or_

admin_bp = Blueprint('admin', __name__)


@admin_bp.route('/dashboard/stats', methods=['GET'])
@token_required
@admin_required
def get_dashboard_stats():
    """Get admin dashboard statistics"""
    try:
        # User statistics
        total_users = User.query.count()
        active_users = User.query.filter_by(status='active').count()
        pending_kyc = User.query.filter_by(kyc_status='pending').count()
        
        # Revenue statistics
        total_revenue = db.session.query(func.sum(Payment.amount)).filter(
            Payment.status == 'completed'
        ).scalar() or 0
        
        # Monthly revenue (last 30 days)
        thirty_days_ago = datetime.utcnow() - timedelta(days=30)
        monthly_revenue = db.session.query(func.sum(Payment.amount)).filter(
            and_(
                Payment.status == 'completed',
                Payment.created_at >= thirty_days_ago
            )
        ).scalar() or 0
        
        # Challenge statistics
        total_challenges = Challenge.query.count()
        active_challenges = Challenge.query.filter_by(status='active').count()
        completed_challenges = Challenge.query.filter_by(status='completed').count()
        failed_challenges = Challenge.query.filter_by(status='failed').count()
        funded_challenges = Challenge.query.filter_by(status='funded').count()
        
        # Recent users (last 5)
        recent_users = User.query.order_by(User.created_at.desc()).limit(5).all()
        
        # Recent payments (last 5)
        recent_payments = Payment.query.order_by(Payment.created_at.desc()).limit(5).all()
        
        return jsonify({
            'users': {
                'total': total_users,
                'active': active_users,
                'pending_kyc': pending_kyc,
                'suspended': User.query.filter_by(status='suspended').count()
            },
            'revenue': {
                'total': float(total_revenue),
                'monthly': float(monthly_revenue),
                'average_per_user': float(total_revenue / total_users) if total_users > 0 else 0
            },
            'challenges': {
                'total': total_challenges,
                'active': active_challenges,
                'completed': completed_challenges,
                'failed': failed_challenges,
                'funded': funded_challenges
            },
            'recent_users': [{
                'id': user.id,
                'name': f"{user.first_name} {user.last_name}",
                'email': user.email,
                'role': user.role,
                'status': user.status,
                'created_at': user.created_at.isoformat()
            } for user in recent_users],
            'recent_payments': [{
                'id': payment.id,
                'user_id': payment.user_id,
                'amount': float(payment.amount),
                'type': payment.payment_type,
                'status': payment.status,
                'created_at': payment.created_at.isoformat()
            } for payment in recent_payments]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@admin_bp.route('/users', methods=['GET'])
@token_required
@admin_required
def get_users():
    """Get all users with filtering and pagination"""
    try:
        # Get query parameters
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        role = request.args.get('role')
        status = request.args.get('status')
        search = request.args.get('search')
        
        # Build query
        query = User.query
        
        # Apply filters
        if role:
            query = query.filter_by(role=role)
        if status:
            query = query.filter_by(status=status)
        if search:
            query = query.filter(
                or_(
                    User.email.ilike(f'%{search}%'),
                    User.first_name.ilike(f'%{search}%'),
                    User.last_name.ilike(f'%{search}%')
                )
            )
        
        # Paginate
        pagination = query.order_by(User.created_at.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        return jsonify({
            'users': [{
                'id': user.id,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'role': user.role,
                'status': user.status,
                'kyc_status': user.kyc_status,
                'phone': user.phone,
                'country_code': user.country_code,
                'created_at': user.created_at.isoformat(),
                'last_login': user.last_login.isoformat() if user.last_login else None
            } for user in pagination.items],
            'pagination': {
                'page': pagination.page,
                'per_page': pagination.per_page,
                'total': pagination.total,
                'pages': pagination.pages
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@admin_bp.route('/users/<int:user_id>', methods=['GET'])
@token_required
@admin_required
def get_user(user_id):
    """Get specific user details"""
    try:
        user = User.query.get_or_404(user_id)
        
        return jsonify({
            'id': user.id,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'role': user.role,
            'status': user.status,
            'kyc_status': user.kyc_status,
            'phone': user.phone,
            'country_code': user.country_code,
            'created_at': user.created_at.isoformat(),
            'updated_at': user.updated_at.isoformat(),
            'last_login': user.last_login.isoformat() if user.last_login else None,
            'email_verified': user.email_verified,
            'two_factor_enabled': user.two_factor_enabled
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@admin_bp.route('/users', methods=['POST'])
@token_required
@admin_required
def create_user():
    """Create a new user"""
    try:
        data = request.get_json()
        
        # Validate required fields
        valid, message = validate_required_fields(
            data, 
            ['email', 'password', 'first_name', 'last_name', 'role']
        )
        if not valid:
            return jsonify({'error': message}), 400
        
        # Validate email
        valid, result = validate_email_format(data['email'])
        if not valid:
            return jsonify({'error': f'Invalid email: {result}'}), 400
        
        # Check if user exists
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'error': 'User already exists'}), 400
        
        # Create user
        user = User(
            email=data['email'],
            first_name=data['first_name'],
            last_name=data['last_name'],
            role=data['role'],
            status=data.get('status', 'active'),
            phone=data.get('phone'),
            country_code=data.get('country_code'),
            email_verified=data.get('email_verified', False)
        )
        user.set_password(data['password'])
        
        db.session.add(user)
        db.session.commit()
        
        return jsonify({
            'message': 'User created successfully',
            'user': {
                'id': user.id,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'role': user.role,
                'status': user.status
            }
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@admin_bp.route('/users/<int:user_id>', methods=['PUT'])
@token_required
@admin_required
def update_user(user_id):
    """Update user details"""
    try:
        user = User.query.get_or_404(user_id)
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
        if 'role' in data:
            user.role = data['role']
        if 'status' in data:
            user.status = data['status']
        if 'kyc_status' in data:
            user.kyc_status = data['kyc_status']
        
        user.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'message': 'User updated successfully',
            'user': {
                'id': user.id,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'role': user.role,
                'status': user.status,
                'kyc_status': user.kyc_status
            }
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@admin_bp.route('/users/<int:user_id>', methods=['DELETE'])
@token_required
@admin_required
def delete_user(user_id):
    """Delete a user (soft delete by setting status to deleted)"""
    try:
        user = User.query.get_or_404(user_id)
        
        # Prevent deleting yourself
        if user.id == g.current_user.id:
            return jsonify({'error': 'Cannot delete yourself'}), 400
        
        # Soft delete
        user.status = 'deleted'
        user.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({'message': 'User deleted successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@admin_bp.route('/programs', methods=['GET'])
@token_required
@admin_required
def get_programs():
    """Get all programs"""
    try:
        programs = Program.query.all()
        
        return jsonify({
            'programs': [{
                'id': program.id,
                'name': program.name,
                'description': program.description,
                'type': program.type,
                'account_size': float(program.account_size),
                'price': float(program.price),
                'profit_target': float(program.profit_target),
                'max_daily_loss': float(program.max_daily_loss),
                'max_total_drawdown': float(program.max_total_drawdown),
                'min_trading_days': program.min_trading_days,
                'is_active': program.is_active,
                'created_at': program.created_at.isoformat()
            } for program in programs]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@admin_bp.route('/programs', methods=['POST'])
@token_required
@admin_required
def create_program():
    """Create a new program"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = [
            'name', 'type', 'account_size', 'price', 
            'profit_target', 'max_daily_loss', 'max_total_drawdown'
        ]
        valid, message = validate_required_fields(data, required_fields)
        if not valid:
            return jsonify({'error': message}), 400
        
        # Create program
        program = Program(
            name=data['name'],
            description=data.get('description'),
            type=data['type'],
            account_size=data['account_size'],
            price=data['price'],
            profit_target=data['profit_target'],
            max_daily_loss=data['max_daily_loss'],
            max_total_drawdown=data['max_total_drawdown'],
            min_trading_days=data.get('min_trading_days', 5),
            is_active=data.get('is_active', True)
        )
        
        db.session.add(program)
        db.session.commit()
        
        return jsonify({
            'message': 'Program created successfully',
            'program': {
                'id': program.id,
                'name': program.name,
                'type': program.type,
                'account_size': float(program.account_size),
                'price': float(program.price)
            }
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@admin_bp.route('/programs/<int:program_id>', methods=['PUT'])
@token_required
@admin_required
def update_program(program_id):
    """Update a program"""
    try:
        program = Program.query.get_or_404(program_id)
        data = request.get_json()
        
        # Update fields
        if 'name' in data:
            program.name = data['name']
        if 'description' in data:
            program.description = data['description']
        if 'type' in data:
            program.type = data['type']
        if 'account_size' in data:
            program.account_size = data['account_size']
        if 'price' in data:
            program.price = data['price']
        if 'profit_target' in data:
            program.profit_target = data['profit_target']
        if 'max_daily_loss' in data:
            program.max_daily_loss = data['max_daily_loss']
        if 'max_total_drawdown' in data:
            program.max_total_drawdown = data['max_total_drawdown']
        if 'min_trading_days' in data:
            program.min_trading_days = data['min_trading_days']
        if 'is_active' in data:
            program.is_active = data['is_active']
        
        program.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'message': 'Program updated successfully',
            'program': {
                'id': program.id,
                'name': program.name,
                'is_active': program.is_active
            }
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@admin_bp.route('/programs/<int:program_id>', methods=['DELETE'])
@token_required
@admin_required
def delete_program(program_id):
    """Delete a program (soft delete by setting is_active to False)"""
    try:
        program = Program.query.get_or_404(program_id)
        
        # Soft delete
        program.is_active = False
        program.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({'message': 'Program deleted successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@admin_bp.route('/settings', methods=['GET'])
@token_required
@admin_required
def get_settings():
    """Get system settings (placeholder - implement based on your settings model)"""
    try:
        # This is a placeholder - you'll need to implement a Settings model
        settings = {
            'general': {
                'site_name': 'PropTradePro',
                'site_description': 'Professional Prop Trading Platform',
                'support_email': 'support@proptradepro.com',
                'timezone': 'UTC'
            },
            'email': {
                'provider': 'sendgrid',
                'sender_email': 'noreply@proptradepro.com',
                'sender_name': 'PropTradePro'
            },
            'payment': {
                'stripe_enabled': True,
                'paypal_enabled': False
            },
            'notifications': {
                'email_enabled': True,
                'sms_enabled': False,
                'push_enabled': False
            },
            'security': {
                'require_2fa': False,
                'session_timeout': 30,
                'password_min_length': 8,
                'require_special_chars': True
            },
            'trading': {
                'max_leverage': 100,
                'allowed_markets': ['forex', 'stocks', 'crypto', 'commodities', 'indices']
            }
        }
        
        return jsonify(settings), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@admin_bp.route('/settings', methods=['PUT'])
@token_required
@admin_required
def update_settings():
    """Update system settings (placeholder)"""
    try:
        data = request.get_json()
        
        # This is a placeholder - implement actual settings update logic
        # You'll need to create a Settings model and store these in the database
        
        return jsonify({
            'message': 'Settings updated successfully',
            'settings': data
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

