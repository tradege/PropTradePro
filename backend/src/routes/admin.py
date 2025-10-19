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
        active_users = User.query.filter_by(is_active=True).count()
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
                'suspended': User.query.filter_by(is_active=False).count()
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
                'status': 'active' if user.is_active else 'inactive',
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
            if status == 'active':
                query = query.filter_by(is_active=True)
            elif status == 'inactive':
                query = query.filter_by(is_active=False)
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
                'is_active': user.is_active,
                'kyc_status': user.kyc_status,
                'phone': user.phone,
                'country_code': user.country_code,
                'parent_id': user.parent_id,
                'level': user.level,
                'created_at': user.created_at.isoformat() if user.created_at else None,
                'last_login_at': user.last_login_at.isoformat() if user.last_login_at else None
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
            'is_active': user.is_active,
            'kyc_status': user.kyc_status,
            'phone': user.phone,
            'country_code': user.country_code,
            'created_at': user.created_at.isoformat(),
            'updated_at': user.updated_at.isoformat(),
            'last_login_at': user.last_login_at.isoformat() if user.last_login_at else None,
            'is_verified': user.is_verified,
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
            is_active=data.get('is_active', True),
            phone=data.get('phone'),
            country_code=data.get('country_code'),
            is_verified=data.get('is_verified', False)
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
                'is_active': user.is_active
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
        if 'is_active' in data:
            user.is_active = data['is_active']
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
                'is_active': user.is_active,
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
    """Delete (soft delete) a user"""
    try:
        user = User.query.get_or_404(user_id)
        
        # Prevent self-deletion
        if user.id == g.current_user.id:
            return jsonify({'error': 'Cannot delete yourself'}), 400
        
        # Soft delete
        user.is_active = False
        user.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({'message': 'User deleted successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@admin_bp.route('/users/<int:user_id>/reset-password', methods=['POST'])
@token_required
@admin_required
def admin_reset_password(user_id):
    """Admin reset user password"""
    try:
        user = User.query.get_or_404(user_id)
        data = request.get_json()
        
        if 'new_password' not in data:
            return jsonify({'error': 'New password is required'}), 400
        
        user.set_password(data['new_password'])
        user.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({'message': 'Password reset successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@admin_bp.route('/programs', methods=['GET'])
@token_required
@admin_required
def get_programs():
    """Get all trading programs"""
    try:
        programs = Program.query.all()
        
        return jsonify({
            'programs': [{
                'id': program.id,
                'name': program.name,
                'description': program.description,
                'account_size': float(program.account_size),
                'profit_target': float(program.profit_target),
                'max_daily_loss': float(program.max_daily_loss),
                'max_total_loss': float(program.max_total_loss),
                'price': float(program.price),
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
    """Create a new trading program"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required = ['name', 'account_size', 'profit_target', 'max_daily_loss', 'max_total_loss', 'price']
        valid, message = validate_required_fields(data, required)
        if not valid:
            return jsonify({'error': message}), 400
        
        program = Program(
            name=data['name'],
            description=data.get('description', ''),
            account_size=data['account_size'],
            profit_target=data['profit_target'],
            max_daily_loss=data['max_daily_loss'],
            max_total_loss=data['max_total_loss'],
            price=data['price'],
            is_active=data.get('is_active', True)
        )
        
        db.session.add(program)
        db.session.commit()
        
        return jsonify({
            'message': 'Program created successfully',
            'program': {
                'id': program.id,
                'name': program.name,
                'account_size': float(program.account_size)
            }
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@admin_bp.route('/programs/<int:program_id>', methods=['PUT'])
@token_required
@admin_required
def update_program(program_id):
    """Update a trading program"""
    try:
        program = Program.query.get_or_404(program_id)
        data = request.get_json()
        
        # Update fields
        if 'name' in data:
            program.name = data['name']
        if 'description' in data:
            program.description = data['description']
        if 'account_size' in data:
            program.account_size = data['account_size']
        if 'profit_target' in data:
            program.profit_target = data['profit_target']
        if 'max_daily_loss' in data:
            program.max_daily_loss = data['max_daily_loss']
        if 'max_total_loss' in data:
            program.max_total_loss = data['max_total_loss']
        if 'price' in data:
            program.price = data['price']
        if 'is_active' in data:
            program.is_active = data['is_active']
        
        program.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'message': 'Program updated successfully',
            'program': {
                'id': program.id,
                'name': program.name
            }
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@admin_bp.route('/programs/<int:program_id>', methods=['DELETE'])
@token_required
@admin_required
def delete_program(program_id):
    """Delete a trading program"""
    try:
        program = Program.query.get_or_404(program_id)
        
        # Check if program has active challenges
        active_challenges = Challenge.query.filter_by(
            program_id=program_id,
            status='active'
        ).count()
        
        if active_challenges > 0:
            return jsonify({'error': 'Cannot delete program with active challenges'}), 400
        
        db.session.delete(program)
        db.session.commit()
        
        return jsonify({'message': 'Program deleted successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@admin_bp.route('/payments', methods=['GET'])
@token_required
@admin_required
def get_payments():
    """Get all payments with filtering"""
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        status = request.args.get('status')
        
        query = Payment.query
        
        if status:
            query = query.filter_by(status=status)
        
        pagination = query.order_by(Payment.created_at.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        return jsonify({
            'payments': [{
                'id': payment.id,
                'user_id': payment.user_id,
                'amount': float(payment.amount),
                'currency': payment.currency,
                'payment_type': payment.payment_type,
                'payment_method': payment.payment_method,
                'status': payment.status,
                'transaction_id': payment.transaction_id,
                'created_at': payment.created_at.isoformat()
            } for payment in pagination.items],
            'pagination': {
                'page': pagination.page,
                'per_page': pagination.per_page,
                'total': pagination.total,
                'pages': pagination.pages
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@admin_bp.route('/kyc/pending', methods=['GET'])
@token_required
@admin_required
def get_pending_kyc():
    """Get all pending KYC submissions"""
    try:
        users = User.query.filter_by(kyc_status='pending').all()
        
        return jsonify({
            'pending_kyc': [{
                'id': user.id,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'kyc_submitted_at': user.kyc_submitted_at.isoformat() if user.kyc_submitted_at else None,
                'kyc_id_url': user.kyc_id_url,
                'kyc_address_url': user.kyc_address_url,
                'kyc_selfie_url': user.kyc_selfie_url,
                'kyc_bank_url': user.kyc_bank_url
            } for user in users]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@admin_bp.route('/kyc/<int:user_id>/approve', methods=['POST'])
@token_required
@admin_required
def approve_kyc(user_id):
    """Approve user KYC"""
    try:
        user = User.query.get_or_404(user_id)
        
        if user.kyc_status != 'pending':
            return jsonify({'error': 'KYC is not pending'}), 400
        
        user.kyc_status = 'approved'
        user.kyc_approved_at = datetime.utcnow()
        user.kyc_approved_by = g.current_user.id
        
        db.session.commit()
        
        return jsonify({'message': 'KYC approved successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@admin_bp.route('/kyc/<int:user_id>/reject', methods=['POST'])
@token_required
@admin_required
def reject_kyc(user_id):
    """Reject user KYC"""
    try:
        user = User.query.get_or_404(user_id)
        data = request.get_json()
        
        if user.kyc_status != 'pending':
            return jsonify({'error': 'KYC is not pending'}), 400
        
        if 'reason' not in data:
            return jsonify({'error': 'Rejection reason is required'}), 400
        
        user.kyc_status = 'rejected'
        user.kyc_rejected_at = datetime.utcnow()
        user.kyc_rejected_by = g.current_user.id
        user.kyc_rejection_reason = data['reason']
        user.kyc_admin_notes = data.get('notes', '')
        
        db.session.commit()
        
        return jsonify({'message': 'KYC rejected successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

