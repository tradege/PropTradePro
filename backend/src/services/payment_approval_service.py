"""
Payment Approval Service
Handles cash and free payment approval workflow
"""
from datetime import datetime
from src.database import db
from src.models import PaymentApprovalRequest, Challenge, Payment, User
from src.services.email_service import EmailService


class PaymentApprovalService:
    """Service for managing payment approvals"""
    
    @staticmethod
    def can_use_cash_payment(user):
        """
        Check if user can create cash payments
        Only Super Admin (supermaster) and Master can use cash payment
        """
        return user.role in ['supermaster', 'master']
    
    @staticmethod
    def can_create_free_account(user):
        """
        Check if user can create free accounts
        Only Super Admin (supermaster) can create completely free accounts
        """
        return user.role == 'supermaster'
    
    @staticmethod
    def create_approval_request(challenge_id, payment_id, requested_by_id, requested_for_id, 
                               amount, payment_type):
        """
        Create a new payment approval request
        
        Args:
            challenge_id: ID of the challenge
            payment_id: ID of the payment (optional)
            requested_by_id: ID of the user requesting approval (Master/Admin)
            requested_for_id: ID of the trader/user
            amount: Payment amount
            payment_type: 'cash' or 'free'
        
        Returns:
            PaymentApprovalRequest object
        """
        # Validate payment type
        if payment_type not in ['cash', 'free']:
            raise ValueError("Payment type must be 'cash' or 'free'")
        
        # Validate requester permissions
        requester = User.query.get(requested_by_id)
        if not requester:
            raise ValueError("Requester not found")
        
        if payment_type == 'free' and not PaymentApprovalService.can_create_free_account(requester):
            raise ValueError("Only Super Admin can create free accounts")
        
        if payment_type == 'cash' and not PaymentApprovalService.can_use_cash_payment(requester):
            raise ValueError("Only Super Admin and Masters can use cash payment")
        
        # Create approval request
        approval_request = PaymentApprovalRequest(
            challenge_id=challenge_id,
            payment_id=payment_id,
            requested_by=requested_by_id,
            requested_for=requested_for_id,
            amount=amount,
            payment_type=payment_type,
            status='pending'
        )
        
        db.session.add(approval_request)
        
        # Update challenge status to pending approval
        if challenge_id:
            challenge = Challenge.query.get(challenge_id)
            if challenge:
                challenge.approval_status = 'pending'
                challenge.payment_type = payment_type
        
        # Update payment status to pending approval
        if payment_id:
            payment = Payment.query.get(payment_id)
            if payment:
                payment.approval_status = 'pending'
                payment.payment_type = payment_type
        
        db.session.commit()
        
        # Send notification email to Super Admins
        PaymentApprovalService._notify_super_admins(approval_request)
        
        return approval_request
    
    @staticmethod
    def approve_request(approval_request_id, admin_id, admin_notes=None):
        """
        Approve a payment approval request
        
        Args:
            approval_request_id: ID of the approval request
            admin_id: ID of the Super Admin approving
            admin_notes: Optional notes from admin
        
        Returns:
            Updated PaymentApprovalRequest object
        """
        # Validate admin permissions
        admin = User.query.get(admin_id)
        if not admin or admin.role != 'supermaster':
            raise ValueError("Only Super Admin can approve payment requests")
        
        # Get approval request
        approval_request = PaymentApprovalRequest.query.get(approval_request_id)
        if not approval_request:
            raise ValueError("Approval request not found")
        
        if approval_request.status != 'pending':
            raise ValueError("Approval request is not pending")
        
        # Update approval request
        approval_request.status = 'approved'
        approval_request.reviewed_by = admin_id
        approval_request.reviewed_at = datetime.utcnow()
        approval_request.admin_notes = admin_notes
        
        # Update challenge
        if approval_request.challenge_id:
            challenge = Challenge.query.get(approval_request.challenge_id)
            if challenge:
                challenge.approval_status = 'approved'
                challenge.approved_by = admin_id
                challenge.approved_at = datetime.utcnow()
                challenge.payment_status = 'paid'
                challenge.status = 'active'  # Activate the challenge
        
        # Update payment
        if approval_request.payment_id:
            payment = Payment.query.get(approval_request.payment_id)
            if payment:
                payment.approval_status = 'approved'
                payment.approved_by = admin_id
                payment.approved_at = datetime.utcnow()
                payment.status = 'completed'
                payment.completed_at = datetime.utcnow()
        
        db.session.commit()
        
        # Send notification emails
        PaymentApprovalService._notify_approval(approval_request, approved=True)
        
        return approval_request
    
    @staticmethod
    def reject_request(approval_request_id, admin_id, rejection_reason, admin_notes=None):
        """
        Reject a payment approval request
        
        Args:
            approval_request_id: ID of the approval request
            admin_id: ID of the Super Admin rejecting
            rejection_reason: Reason for rejection
            admin_notes: Optional notes from admin
        
        Returns:
            Updated PaymentApprovalRequest object
        """
        # Validate admin permissions
        admin = User.query.get(admin_id)
        if not admin or admin.role != 'supermaster':
            raise ValueError("Only Super Admin can reject payment requests")
        
        # Get approval request
        approval_request = PaymentApprovalRequest.query.get(approval_request_id)
        if not approval_request:
            raise ValueError("Approval request not found")
        
        if approval_request.status != 'pending':
            raise ValueError("Approval request is not pending")
        
        # Update approval request
        approval_request.status = 'rejected'
        approval_request.reviewed_by = admin_id
        approval_request.reviewed_at = datetime.utcnow()
        approval_request.rejection_reason = rejection_reason
        approval_request.admin_notes = admin_notes
        
        # Update challenge
        if approval_request.challenge_id:
            challenge = Challenge.query.get(approval_request.challenge_id)
            if challenge:
                challenge.approval_status = 'rejected'
                challenge.approved_by = admin_id
                challenge.approved_at = datetime.utcnow()
                challenge.rejection_reason = rejection_reason
                challenge.status = 'failed'  # Mark as failed
        
        # Update payment
        if approval_request.payment_id:
            payment = Payment.query.get(approval_request.payment_id)
            if payment:
                payment.approval_status = 'rejected'
                payment.approved_by = admin_id
                payment.approved_at = datetime.utcnow()
                payment.rejection_reason = rejection_reason
                payment.status = 'failed'
        
        db.session.commit()
        
        # Send notification emails
        PaymentApprovalService._notify_approval(approval_request, approved=False)
        
        return approval_request
    
    @staticmethod
    def get_pending_requests():
        """Get all pending approval requests"""
        return PaymentApprovalRequest.query.filter_by(status='pending').order_by(
            PaymentApprovalRequest.created_at.desc()
        ).all()
    
    @staticmethod
    def get_request_by_id(request_id):
        """Get approval request by ID"""
        return PaymentApprovalRequest.query.get(request_id)
    
    @staticmethod
    def get_requests_by_requester(requester_id):
        """Get all approval requests created by a specific user"""
        return PaymentApprovalRequest.query.filter_by(
            requested_by=requester_id
        ).order_by(PaymentApprovalRequest.created_at.desc()).all()
    
    @staticmethod
    def _notify_super_admins(approval_request):
        """Send notification to all Super Admins about new approval request"""
        try:
            # Get all Super Admins
            super_admins = User.query.filter_by(role='supermaster', is_active=True).all()
            
            requester = User.query.get(approval_request.requested_by)
            trader = User.query.get(approval_request.requested_for)
            
            for admin in super_admins:
                EmailService.send_payment_approval_notification(
                    admin_email=admin.email,
                    admin_name=admin.first_name,
                    requester_name=f"{requester.first_name} {requester.last_name}",
                    trader_name=f"{trader.first_name} {trader.last_name}",
                    amount=float(approval_request.amount),
                    payment_type=approval_request.payment_type,
                    request_id=approval_request.id
                )
        except Exception as e:
            # Log error but don't fail the request creation
            print(f"Error sending notification to Super Admins: {str(e)}")
    
    @staticmethod
    def _notify_approval(approval_request, approved=True):
        """Send notification about approval/rejection decision"""
        try:
            requester = User.query.get(approval_request.requested_by)
            trader = User.query.get(approval_request.requested_for)
            
            if approved:
                # Notify requester (Master/Admin)
                EmailService.send_payment_approved_notification(
                    email=requester.email,
                    name=requester.first_name,
                    trader_name=f"{trader.first_name} {trader.last_name}",
                    amount=float(approval_request.amount),
                    payment_type=approval_request.payment_type
                )
                
                # Notify trader
                EmailService.send_challenge_activated_notification(
                    email=trader.email,
                    name=trader.first_name,
                    challenge_id=approval_request.challenge_id
                )
            else:
                # Notify requester about rejection
                EmailService.send_payment_rejected_notification(
                    email=requester.email,
                    name=requester.first_name,
                    trader_name=f"{trader.first_name} {trader.last_name}",
                    amount=float(approval_request.amount),
                    payment_type=approval_request.payment_type,
                    reason=approval_request.rejection_reason
                )
        except Exception as e:
            # Log error but don't fail the approval/rejection
            print(f"Error sending approval/rejection notification: {str(e)}")

