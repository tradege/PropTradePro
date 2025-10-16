"""
Database initialization and utilities
"""
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from datetime import datetime
import redis
import os

# Initialize SQLAlchemy
db = SQLAlchemy()
migrate = Migrate()

# Redis connection
redis_client = None


def init_db(app):
    """Initialize database with Flask app"""
    db.init_app(app)
    migrate.init_app(app, db)
    
    # Initialize Redis
    global redis_client
    redis_url = app.config.get('REDIS_URL')
    if redis_url:
        redis_client = redis.from_url(redis_url, decode_responses=True)
    
    return db


def get_redis():
    """Get Redis client instance"""
    return redis_client


class TimestampMixin:
    """Mixin for created_at and updated_at timestamps"""
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)

