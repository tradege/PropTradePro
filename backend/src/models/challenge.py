from datetime import datetime
from src.database import db

class Challenge(db.Model):
    """User's purchased challenge"""
    __tablename__ = 'challenges'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    program_id = db.Column(db.Integer, db.ForeignKey('programs.id'), nullable=False)
    
    # Challenge details
    challenge_number = db.Column(db.String(50), unique=True, nullable=False)
    status = db.Column(db.String(50), default='pending')  # pending, active, passed, failed, funded
    
    # Account details
    account_number = db.Column(db.String(100))
    account_password = db.Column(db.String(255))
    server = db.Column(db.String(100))
    platform = db.Column(db.String(50), default='MT5')  # MT4, MT5, cTrader
    
    # Trading stats
    current_balance = db.Column(db.Numeric(15, 2))
    highest_balance = db.Column(db.Numeric(15, 2))
    lowest_balance = db.Column(db.Numeric(15, 2))
    total_profit = db.Column(db.Numeric(15, 2), default=0)
    total_loss = db.Column(db.Numeric(15, 2), default=0)
    
    # Progress
    trading_days = db.Column(db.Integer, default=0)
    profit_target_reached = db.Column(db.Boolean, default=False)
    daily_loss_violated = db.Column(db.Boolean, default=False)
    total_loss_violated = db.Column(db.Boolean, default=False)
    
    # Dates
    started_at = db.Column(db.DateTime)
    completed_at = db.Column(db.DateTime)
    expires_at = db.Column(db.DateTime)
    
    # Payment
    payment_id = db.Column(db.Integer, db.ForeignKey('payments.id'))
    amount_paid = db.Column(db.Numeric(10, 2))
    
    # Metadata
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    trades = db.relationship('Trade', backref='challenge', lazy='dynamic')
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'program_id': self.program_id,
            'challenge_number': self.challenge_number,
            'status': self.status,
            'account_number': self.account_number,
            'server': self.server,
            'platform': self.platform,
            'current_balance': float(self.current_balance) if self.current_balance else None,
            'highest_balance': float(self.highest_balance) if self.highest_balance else None,
            'lowest_balance': float(self.lowest_balance) if self.lowest_balance else None,
            'total_profit': float(self.total_profit) if self.total_profit else None,
            'total_loss': float(self.total_loss) if self.total_loss else None,
            'trading_days': self.trading_days,
            'profit_target_reached': self.profit_target_reached,
            'daily_loss_violated': self.daily_loss_violated,
            'total_loss_violated': self.total_loss_violated,
            'started_at': self.started_at.isoformat() if self.started_at else None,
            'completed_at': self.completed_at.isoformat() if self.completed_at else None,
            'expires_at': self.expires_at.isoformat() if self.expires_at else None,
            'amount_paid': float(self.amount_paid) if self.amount_paid else None,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
        }

