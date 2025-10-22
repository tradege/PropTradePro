"""
Models package
"""
from src.models.user import User, EmailVerificationToken, PasswordResetToken
from src.models.verification_attempt import VerificationAttempt
from src.models.tenant import Tenant
from src.models.trading_program import TradingProgram, ProgramAddOn, Challenge
from src.models.lead import Lead, LeadActivity, LeadNote
from src.models.agent import Agent
from src.models.referral import Referral
from src.models.commission import Commission
from src.models.withdrawal import Withdrawal
from src.models.trade import Trade
from src.models.payment import Payment
from src.models.payment_approval import PaymentApprovalRequest

__all__ = [
    'User',
    'EmailVerificationToken',
    'PasswordResetToken',
    'VerificationAttempt',
    'Tenant',
    'TradingProgram',
    'ProgramAddOn',
    'Challenge',
    'Agent',
    'Referral',
    'Commission',
    'Withdrawal',
    'Trade',
    'Payment',
    'PaymentApprovalRequest',
    'Lead',
    'LeadActivity',
    'LeadNote'
]

# Alias for backward compatibility
Program = TradingProgram

