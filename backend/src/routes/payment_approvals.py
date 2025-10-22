"""
Payment Approval API Routes
Endpoints for managing cash/free payment approvals
"""
from flask import Blueprint, request, jsonify
from src.models import PaymentApprovalRequest, User, Challenge, Payment
from src.services.payment_approval_service import PaymentApprovalService
from src.utils.decorators import token_required, role_required
from src.database import db

bp = Blueprint('payment_approvals', __name__, url_prefix='/api/v1/payment-approvals')


@bp.route('/pending', methods=['GET'])
@token_required
@role_required(['supermaster'])
def get_pending_approvals(current_user):
    """
    Get all pending payment approval requests (Super Admin only)
    """
    try:
        requests = PaymentApprovalService.get_pending_requests()
        
        # Enrich with user details
        result = []
        for req in requests:
            req_dict = req.to_dict()
            
            # Add requester details
            requester = User.query.get(req.requested_by)
            if requester:
                req_dict['requester'] = {
                    'id': requester.id,
                    'name': f"{requester.first_name} {requester.last_name}",
                    'email': requester.email,
                    'role': requester.role
                }
            
            # Add trader details
            trader = User.query.get(req.requested_for)
            if trader:
                req_dict['trader'] = {
                    'id': trader.id,
                    'name': f"{trader.first_name} {trader.last_name}",
                    'email': trader.email,
                    'role': trader.role
                }
            
            # Add challenge details
            if req.challenge_id:
                challenge = Challenge.query.get(req.challenge_id)
                if challenge:
                    req_dict['challenge'] = {
                        'id': challenge.id,
                        'program_id': challenge.program_id,
                        'status': challenge.status
                    }
            
            result.append(req_dict)
        
        return jsonify({
            'success': True,
            'data': result,
            'count': len(result)
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@bp.route('/my-requests', methods=['GET'])
@token_required
@role_required(['supermaster', 'master'])
def get_my_requests(current_user):
    """
    Get all approval requests created by current user (Master/Admin only)
    """
    try:
        requests = PaymentApprovalService.get_requests_by_requester(current_user.id)
        
        # Enrich with details
        result = []
        for req in requests:
            req_dict = req.to_dict()
            
            # Add trader details
            trader = User.query.get(req.requested_for)
            if trader:
                req_dict['trader'] = {
                    'id': trader.id,
                    'name': f"{trader.first_name} {trader.last_name}",
                    'email': trader.email
                }
            
            # Add reviewer details if reviewed
            if req.reviewed_by:
                reviewer = User.query.get(req.reviewed_by)
                if reviewer:
                    req_dict['reviewer'] = {
                        'id': reviewer.id,
                        'name': f"{reviewer.first_name} {reviewer.last_name}"
                    }
            
            result.append(req_dict)
        
        return jsonify({
            'success': True,
            'data': result,
            'count': len(result)
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@bp.route('/create', methods=['POST'])
@token_required
@role_required(['supermaster', 'master'])
def create_approval_request(current_user):
    """
    Create a new payment approval request
    
    Body:
    {
        "challenge_id": 123,
        "payment_id": 456,  // optional
        "requested_for": 789,  // trader user_id
        "amount": 299.00,
        "payment_type": "cash"  // or "free"
    }
    """
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['requested_for', 'amount', 'payment_type']
        for field in required_fields:
            if field not in data:
                return jsonify({
                    'success': False,
                    'error': f'Missing required field: {field}'
                }), 400
        
        # Create approval request
        approval_request = PaymentApprovalService.create_approval_request(
            challenge_id=data.get('challenge_id'),
            payment_id=data.get('payment_id'),
            requested_by_id=current_user.id,
            requested_for_id=data['requested_for'],
            amount=data['amount'],
            payment_type=data['payment_type']
        )
        
        return jsonify({
            'success': True,
            'message': 'Approval request created successfully',
            'data': approval_request.to_dict()
        }), 201
        
    except ValueError as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@bp.route('/<int:request_id>/approve', methods=['POST'])
@token_required
@role_required(['supermaster'])
def approve_request(current_user, request_id):
    """
    Approve a payment approval request (Super Admin only)
    
    Body:
    {
        "admin_notes": "Approved - verified cash payment"  // optional
    }
    """
    try:
        data = request.get_json() or {}
        
        approval_request = PaymentApprovalService.approve_request(
            approval_request_id=request_id,
            admin_id=current_user.id,
            admin_notes=data.get('admin_notes')
        )
        
        return jsonify({
            'success': True,
            'message': 'Payment approved successfully',
            'data': approval_request.to_dict()
        }), 200
        
    except ValueError as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@bp.route('/<int:request_id>/reject', methods=['POST'])
@token_required
@role_required(['supermaster'])
def reject_request(current_user, request_id):
    """
    Reject a payment approval request (Super Admin only)
    
    Body:
    {
        "rejection_reason": "Insufficient documentation",
        "admin_notes": "Need proof of payment"  // optional
    }
    """
    try:
        data = request.get_json()
        
        if 'rejection_reason' not in data:
            return jsonify({
                'success': False,
                'error': 'Missing required field: rejection_reason'
            }), 400
        
        approval_request = PaymentApprovalService.reject_request(
            approval_request_id=request_id,
            admin_id=current_user.id,
            rejection_reason=data['rejection_reason'],
            admin_notes=data.get('admin_notes')
        )
        
        return jsonify({
            'success': True,
            'message': 'Payment rejected',
            'data': approval_request.to_dict()
        }), 200
        
    except ValueError as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@bp.route('/<int:request_id>', methods=['GET'])
@token_required
def get_request_details(current_user, request_id):
    """
    Get details of a specific approval request
    """
    try:
        approval_request = PaymentApprovalService.get_request_by_id(request_id)
        
        if not approval_request:
            return jsonify({
                'success': False,
                'error': 'Approval request not found'
            }), 404
        
        # Check permissions - only Super Admin or the requester can view
        if current_user.role != 'supermaster' and current_user.id != approval_request.requested_by:
            return jsonify({
                'success': False,
                'error': 'Unauthorized'
            }), 403
        
        # Enrich with details
        req_dict = approval_request.to_dict()
        
        # Add requester details
        requester = User.query.get(approval_request.requested_by)
        if requester:
            req_dict['requester'] = {
                'id': requester.id,
                'name': f"{requester.first_name} {requester.last_name}",
                'email': requester.email,
                'role': requester.role
            }
        
        # Add trader details
        trader = User.query.get(approval_request.requested_for)
        if trader:
            req_dict['trader'] = {
                'id': trader.id,
                'name': f"{trader.first_name} {trader.last_name}",
                'email': trader.email,
                'role': trader.role
            }
        
        # Add reviewer details
        if approval_request.reviewed_by:
            reviewer = User.query.get(approval_request.reviewed_by)
            if reviewer:
                req_dict['reviewer'] = {
                    'id': reviewer.id,
                    'name': f"{reviewer.first_name} {reviewer.last_name}"
                }
        
        # Add challenge details
        if approval_request.challenge_id:
            challenge = Challenge.query.get(approval_request.challenge_id)
            if challenge:
                req_dict['challenge'] = challenge.to_dict()
        
        # Add payment details
        if approval_request.payment_id:
            payment = Payment.query.get(approval_request.payment_id)
            if payment:
                req_dict['payment'] = payment.to_dict()
        
        return jsonify({
            'success': True,
            'data': req_dict
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@bp.route('/stats', methods=['GET'])
@token_required
@role_required(['supermaster'])
def get_approval_stats(current_user):
    """
    Get statistics about payment approvals (Super Admin only)
    """
    try:
        pending_count = PaymentApprovalRequest.query.filter_by(status='pending').count()
        approved_count = PaymentApprovalRequest.query.filter_by(status='approved').count()
        rejected_count = PaymentApprovalRequest.query.filter_by(status='rejected').count()
        
        # Get counts by payment type
        cash_pending = PaymentApprovalRequest.query.filter_by(
            status='pending', payment_type='cash'
        ).count()
        free_pending = PaymentApprovalRequest.query.filter_by(
            status='pending', payment_type='free'
        ).count()
        
        return jsonify({
            'success': True,
            'data': {
                'pending': pending_count,
                'approved': approved_count,
                'rejected': rejected_count,
                'total': pending_count + approved_count + rejected_count,
                'by_type': {
                    'cash_pending': cash_pending,
                    'free_pending': free_pending
                }
            }
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

