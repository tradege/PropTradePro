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

