from datetime import datetime
from src.database import db

class Program(db.Model):
    """Trading program/challenge template"""
    __tablename__ = 'programs'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    
    # Pricing
    price = db.Column(db.Numeric(10, 2), nullable=False)
    currency = db.Column(db.String(3), default='USD')
    
    # Account details
    initial_balance = db.Column(db.Numeric(15, 2), nullable=False)
    profit_target = db.Column(db.Numeric(5, 2), nullable=False)  # Percentage
    max_daily_loss = db.Column(db.Numeric(5, 2), nullable=False)  # Percentage
    max_total_loss = db.Column(db.Numeric(5, 2), nullable=False)  # Percentage
    
    # Trading rules
    min_trading_days = db.Column(db.Integer, default=0)
    max_trading_days = db.Column(db.Integer)
    leverage = db.Column(db.String(20))
    allowed_instruments = db.Column(db.Text)  # JSON array
    
    # Profit split
    profit_split = db.Column(db.Numeric(5, 2), default=80.0)  # Trader gets 80%
    
    # Program type
    program_type = db.Column(db.String(50), default='evaluation')  # evaluation, funded
    phase = db.Column(db.Integer, default=1)  # 1, 2, funded
    
    # Status
    is_active = db.Column(db.Boolean, default=True)
    is_featured = db.Column(db.Boolean, default=False)
    
    # Metadata
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    challenges = db.relationship('Challenge', backref='program', lazy='dynamic')
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'price': float(self.price) if self.price else None,
            'currency': self.currency,
            'initial_balance': float(self.initial_balance) if self.initial_balance else None,
            'profit_target': float(self.profit_target) if self.profit_target else None,
            'max_daily_loss': float(self.max_daily_loss) if self.max_daily_loss else None,
            'max_total_loss': float(self.max_total_loss) if self.max_total_loss else None,
            'min_trading_days': self.min_trading_days,
            'max_trading_days': self.max_trading_days,
            'leverage': self.leverage,
            'allowed_instruments': self.allowed_instruments,
            'profit_split': float(self.profit_split) if self.profit_split else None,
            'program_type': self.program_type,
            'phase': self.phase,
            'is_active': self.is_active,
            'is_featured': self.is_featured,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
        }

