"""
Trading Programs routes
"""
from flask import Blueprint, request, jsonify, g
from src.database import db
from src.models import TradingProgram, ProgramAddOn, Challenge
from src.utils.decorators import token_required, role_required, tenant_required

programs_bp = Blueprint('programs', __name__)


@programs_bp.route('/', methods=['GET'])
def get_programs():
    """Get all active trading programs"""
    # Get tenant_id from query params (for white label)
    tenant_id = request.args.get('tenant_id', type=int)
    
    query = TradingProgram.query.filter_by(is_active=True)
    
    if tenant_id:
        query = query.filter_by(tenant_id=tenant_id)
    
    programs = query.all()
    
    return jsonify({
        'programs': [p.to_dict() for p in programs]
    }), 200


@programs_bp.route('/<int:program_id>', methods=['GET'])
def get_program(program_id):
    """Get specific trading program"""
    program = TradingProgram.query.get_or_404(program_id)
    
    # Get add-ons
    addons = ProgramAddOn.query.filter_by(
        program_id=program_id,
        is_active=True
    ).all()
    
    response = program.to_dict()
    response['addons'] = [addon.to_dict() for addon in addons]
    
    return jsonify(response), 200


@programs_bp.route('/', methods=['POST'])
@token_required
@role_required('admin')
def create_program():
    """Create new trading program (admin only)"""
    data = request.get_json()
    
    required_fields = ['name', 'type', 'account_size', 'price']
    missing = [f for f in required_fields if f not in data]
    if missing:
        return jsonify({'error': f'Missing fields: {", ".join(missing)}'}), 400
    
    try:
        program = TradingProgram(
            tenant_id=data.get('tenant_id', g.current_user.tenant_id),
            name=data['name'],
            type=data['type'],
            description=data.get('description'),
            account_size=data['account_size'],
            profit_target=data.get('profit_target'),
            max_daily_loss=data.get('max_daily_loss'),
            max_total_loss=data.get('max_total_loss'),
            price=data['price'],
            profit_split=data.get('profit_split', 80.00),
            rules=data.get('rules', {})
        )
        
        db.session.add(program)
        db.session.commit()
        
        return jsonify({
            'message': 'Program created successfully',
            'program': program.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to create program'}), 500


@programs_bp.route('/<int:program_id>', methods=['PUT'])
@token_required
@role_required('admin')
def update_program(program_id):
    """Update trading program (admin only)"""
    program = TradingProgram.query.get_or_404(program_id)
    data = request.get_json()
    
    try:
        # Update fields
        updatable_fields = [
            'name', 'type', 'description', 'account_size',
            'profit_target', 'max_daily_loss', 'max_total_loss',
            'price', 'profit_split', 'rules', 'is_active'
        ]
        
        for field in updatable_fields:
            if field in data:
                setattr(program, field, data[field])
        
        db.session.commit()
        
        return jsonify({
            'message': 'Program updated successfully',
            'program': program.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to update program'}), 500


@programs_bp.route('/<int:program_id>/addons', methods=['POST'])
@token_required
@role_required('admin')
def create_addon(program_id):
    """Create add-on for program (admin only)"""
    program = TradingProgram.query.get_or_404(program_id)
    data = request.get_json()
    
    required_fields = ['name', 'price']
    missing = [f for f in required_fields if f not in data]
    if missing:
        return jsonify({'error': f'Missing fields: {", ".join(missing)}'}), 400
    
    try:
        addon = ProgramAddOn(
            program_id=program_id,
            name=data['name'],
            description=data.get('description'),
            price=data['price'],
            price_type=data.get('price_type', 'fixed'),
            benefits=data.get('benefits', {})
        )
        
        db.session.add(addon)
        db.session.commit()
        
        return jsonify({
            'message': 'Add-on created successfully',
            'addon': addon.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to create add-on'}), 500


@programs_bp.route('/<int:program_id>/purchase', methods=['POST'])
@token_required
def purchase_program(program_id):
    """Purchase a trading program"""
    from src.models import User, PaymentApprovalRequest
    from src.services.payment_approval_service import PaymentApprovalService
    
    program = TradingProgram.query.get_or_404(program_id)
    data = request.get_json()
    
    if not program.is_active:
        return jsonify({'error': 'Program is not available'}), 400
    
    try:
        # Get add-ons if any
        addon_ids = data.get('addon_ids', [])
        
        # Calculate total price
        total_price = program.calculate_total_price(addon_ids)
        
        # Get payment type (default: credit_card)
        payment_type = data.get('payment_type', 'credit_card')
        
        # Get user_id (for Master/Admin creating for someone else)
        user_id = data.get('user_id', g.current_user.id)
        
        # Validate payment type permissions
        if payment_type == 'cash':
            if not PaymentApprovalService.can_use_cash_payment(g.current_user):
                return jsonify({
                    'error': 'Only Super Admin and Masters can use cash payment'
                }), 403
        elif payment_type == 'free':
            if not PaymentApprovalService.can_create_free_account(g.current_user):
                return jsonify({
                    'error': 'Only Super Admin can create free accounts'
                }), 403
        
        # Determine challenge status and payment status
        if payment_type in ['cash', 'free']:
            challenge_status = 'pending'
            payment_status = 'pending'
            approval_status = 'pending'
        else:
            challenge_status = 'pending'
            payment_status = 'pending'
            approval_status = 'approved'
        
        # Create challenge
        challenge = Challenge(
            user_id=user_id,
            program_id=program_id,
            status=challenge_status,
            initial_balance=program.account_size,
            current_balance=program.account_size,
            total_phases=1 if program.type == 'one_phase' else 2 if program.type == 'two_phase' else 3,
            addons=addon_ids,
            payment_status=payment_status,
            payment_type=payment_type,
            approval_status=approval_status,
            created_by=g.current_user.id if user_id != g.current_user.id else None
        )
        
        db.session.add(challenge)
        db.session.commit()
        
        # If cash or free payment, create approval request
        if payment_type in ['cash', 'free']:
            approval_request = PaymentApprovalService.create_approval_request(
                challenge_id=challenge.id,
                payment_id=None,
                requested_by_id=g.current_user.id,
                requested_for_id=user_id,
                amount=total_price,
                payment_type=payment_type
            )
            
            return jsonify({
                'message': 'Challenge created, awaiting Super Admin approval',
                'challenge': challenge.to_dict(),
                'approval_request': approval_request.to_dict(),
                'total_price': float(total_price),
                'payment_required': False,
                'approval_required': True
            }), 201
        else:
            # TODO: Create Stripe payment intent for credit card
            return jsonify({
                'message': 'Challenge created, awaiting payment',
                'challenge': challenge.to_dict(),
                'total_price': float(total_price),
                'payment_required': True
            }), 201
        
    except ValueError as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to purchase program'}), 500


@programs_bp.route('/my-challenges', methods=['GET'])
@token_required
def get_my_challenges():
    """Get current user's challenges"""
    challenges = Challenge.query.filter_by(
        user_id=g.current_user.id
    ).order_by(Challenge.created_at.desc()).all()
    
    return jsonify({
        'challenges': [c.to_dict() for c in challenges]
    }), 200


@programs_bp.route('/challenges/<int:challenge_id>', methods=['GET'])
@token_required
def get_challenge(challenge_id):
    """Get specific challenge"""
    challenge = Challenge.query.get_or_404(challenge_id)
    
    # Check ownership
    if challenge.user_id != g.current_user.id and g.current_user.role != 'admin':
        return jsonify({'error': 'Access denied'}), 403
    
    response = challenge.to_dict()
    response['program'] = challenge.program.to_dict()
    
    return jsonify(response), 200

