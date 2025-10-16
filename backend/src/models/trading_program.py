"""
Trading Program and Challenge models
"""
from src.database import db, TimestampMixin
from sqlalchemy.dialects.postgresql import JSONB
from decimal import Decimal


class TradingProgram(db.Model, TimestampMixin):
    """Trading program/challenge type"""
    
    __tablename__ = 'trading_programs'
    
    id = db.Column(db.Integer, primary_key=True)
    tenant_id = db.Column(db.Integer, db.ForeignKey('tenants.id'), nullable=False)
    
    # Program Details
    name = db.Column(db.String(255), nullable=False)
    type = db.Column(db.String(50), nullable=False)  # one_phase, two_phase, three_phase, instant_funding, lightning
    description = db.Column(db.Text)
    
    # Account Sizes
    account_size = db.Column(db.Numeric(12, 2), nullable=False)
    
    # Targets and Limits
    profit_target = db.Column(db.Numeric(5, 2))  # Percentage
    max_daily_loss = db.Column(db.Numeric(5, 2))  # Percentage
    max_total_loss = db.Column(db.Numeric(5, 2))  # Percentage
    
    # Pricing
    price = db.Column(db.Numeric(10, 2), nullable=False)
    
    # Profit Split
    profit_split = db.Column(db.Numeric(5, 2), default=80.00)  # Percentage to trader
    
    # Trading Rules (stored as JSON)
    rules = db.Column(JSONB, default={})
    
    # Status
    is_active = db.Column(db.Boolean, default=True, nullable=False)
    
    # Relationships
    tenant = db.relationship('Tenant', back_populates='programs')
    challenges = db.relationship('Challenge', back_populates='program', lazy='dynamic')
    addons = db.relationship('ProgramAddOn', back_populates='program', lazy='dynamic')
    
    def __repr__(self):
        return f'<TradingProgram {self.name}>'
    
    def calculate_total_price(self, addon_ids=None):
        """Calculate total price with add-ons"""
        total = self.price
        
        if addon_ids:
            addons = ProgramAddOn.query.filter(
                ProgramAddOn.id.in_(addon_ids),
                ProgramAddOn.program_id == self.id,
                ProgramAddOn.is_active == True
            ).all()
            
            for addon in addons:
                if addon.price_type == 'fixed':
                    total += addon.price
                elif addon.price_type == 'percentage':
                    total += (self.price * addon.price / 100)
        
        return total
    
    def to_dict(self):
        """Convert program to dictionary"""
        return {
            'id': self.id,
            'tenant_id': self.tenant_id,
            'name': self.name,
            'type': self.type,
            'description': self.description,
            'account_size': float(self.account_size),
            'profit_target': float(self.profit_target) if self.profit_target else None,
            'max_daily_loss': float(self.max_daily_loss) if self.max_daily_loss else None,
            'max_total_loss': float(self.max_total_loss) if self.max_total_loss else None,
            'price': float(self.price),
            'profit_split': float(self.profit_split),
            'rules': self.rules,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }


class ProgramAddOn(db.Model, TimestampMixin):
    """Add-ons for trading programs"""
    
    __tablename__ = 'program_addons'
    
    id = db.Column(db.Integer, primary_key=True)
    program_id = db.Column(db.Integer, db.ForeignKey('trading_programs.id'), nullable=False)
    
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    
    # Pricing
    price = db.Column(db.Numeric(10, 2), nullable=False)
    price_type = db.Column(db.String(20), default='fixed')  # fixed, percentage
    
    # Benefits (stored as JSON)
    benefits = db.Column(JSONB, default={})
    
    is_active = db.Column(db.Boolean, default=True, nullable=False)
    
    # Relationships
    program = db.relationship('TradingProgram', back_populates='addons')
    
    def __repr__(self):
        return f'<ProgramAddOn {self.name}>'
    
    def to_dict(self):
        """Convert add-on to dictionary"""
        return {
            'id': self.id,
            'program_id': self.program_id,
            'name': self.name,
            'description': self.description,
            'price': float(self.price),
            'price_type': self.price_type,
            'benefits': self.benefits,
            'is_active': self.is_active
        }


class Challenge(db.Model, TimestampMixin):
    """User's trading challenge"""
    
    __tablename__ = 'challenges'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    program_id = db.Column(db.Integer, db.ForeignKey('trading_programs.id'), nullable=False)
    
    # Challenge Status
    status = db.Column(db.String(20), default='pending', nullable=False)
    # pending, active, passed, failed, funded
    
    # Dates
    start_date = db.Column(db.DateTime)
    end_date = db.Column(db.DateTime)
    passed_at = db.Column(db.DateTime)
    
    # Trading Account Details
    account_number = db.Column(db.String(50))
    initial_balance = db.Column(db.Numeric(12, 2))
    current_balance = db.Column(db.Numeric(12, 2))
    
    # Performance Metrics
    total_profit = db.Column(db.Numeric(12, 2), default=0)
    total_loss = db.Column(db.Numeric(12, 2), default=0)
    max_drawdown = db.Column(db.Numeric(12, 2), default=0)
    
    # Progress
    current_phase = db.Column(db.Integer, default=1)
    total_phases = db.Column(db.Integer, default=1)
    
    # Payment
    payment_status = db.Column(db.String(20), default='pending')  # pending, paid, refunded
    payment_id = db.Column(db.String(100))
    
    # Add-ons purchased
    addons = db.Column(JSONB, default=[])
    
    # Relationships
    user = db.relationship('User', back_populates='challenges')
    program = db.relationship('TradingProgram', back_populates='challenges')
    
    def __repr__(self):
        return f'<Challenge {self.id} - User {self.user_id}>'
    
    def calculate_progress(self):
        """Calculate challenge progress percentage"""
        if not self.program or not self.program.profit_target:
            return 0
        
        target_profit = (self.initial_balance * self.program.profit_target / 100)
        if target_profit == 0:
            return 0
        
        progress = (self.total_profit / target_profit) * 100
        return min(progress, 100)
    
    def is_target_reached(self):
        """Check if profit target is reached"""
        return self.calculate_progress() >= 100
    
    def is_max_loss_exceeded(self):
        """Check if max loss is exceeded"""
        if not self.program or not self.program.max_total_loss:
            return False
        
        max_loss_amount = (self.initial_balance * self.program.max_total_loss / 100)
        return self.total_loss >= max_loss_amount
    
    def to_dict(self):
        """Convert challenge to dictionary"""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'program_id': self.program_id,
            'status': self.status,
            'start_date': self.start_date.isoformat() if self.start_date else None,
            'end_date': self.end_date.isoformat() if self.end_date else None,
            'account_number': self.account_number,
            'initial_balance': float(self.initial_balance) if self.initial_balance else None,
            'current_balance': float(self.current_balance) if self.current_balance else None,
            'total_profit': float(self.total_profit),
            'total_loss': float(self.total_loss),
            'max_drawdown': float(self.max_drawdown),
            'current_phase': self.current_phase,
            'total_phases': self.total_phases,
            'payment_status': self.payment_status,
            'progress': self.calculate_progress(),
            'addons': self.addons,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

