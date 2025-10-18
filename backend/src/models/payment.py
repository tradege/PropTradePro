from datetime import datetime
from src.database import db

class Payment(db.Model):
    """Payment transactions"""
    __tablename__ = 'payments'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    # Payment details
    amount = db.Column(db.Numeric(10, 2), nullable=False)
    currency = db.Column(db.String(3), default='USD')
    payment_method = db.Column(db.String(50))  # stripe, paypal, crypto
    
    # Transaction details
    transaction_id = db.Column(db.String(255), unique=True)
    status = db.Column(db.String(50), default='pending')  # pending, completed, failed, refunded
    
    # Purpose
    purpose = db.Column(db.String(100))  # challenge_purchase, withdrawal
    reference_id = db.Column(db.Integer)  # Challenge ID or Withdrawal ID
    
    # Provider details
    provider_response = db.Column(db.Text)  # JSON response from payment provider
    
    # Metadata
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    completed_at = db.Column(db.DateTime)
    
    # Relationships
    challenges = db.relationship('Challenge', backref='payment', lazy='dynamic')
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'amount': float(self.amount) if self.amount else None,
            'currency': self.currency,
            'payment_method': self.payment_method,
            'transaction_id': self.transaction_id,
            'status': self.status,
            'purpose': self.purpose,
            'reference_id': self.reference_id,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'completed_at': self.completed_at.isoformat() if self.completed_at else None,
        }

