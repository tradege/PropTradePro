"""
Configuration management for PropTradePro
Supports multiple environments: development, staging, production
"""
import os
from datetime import timedelta
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()


class Config:
    """Base configuration"""
    
    # Application
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')
    DEBUG = False
    TESTING = False
    
    # Database
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ECHO = False
    
    # Redis
    REDIS_URL = os.getenv('REDIS_URL', 'redis://localhost:6379/0')
    
    # JWT
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', SECRET_KEY)
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)
    
    # CORS
    CORS_ORIGINS = os.getenv('CORS_ORIGINS', 'http://localhost:3000,http://localhost:5173,http://146.190.21.113,http://146.190.21.113:3000,http://marketedgepros.com,https://marketedgepros.com').split(',')
    
    # Stripe
    STRIPE_SECRET_KEY = os.getenv('STRIPE_SECRET_KEY')
    STRIPE_PUBLISHABLE_KEY = os.getenv('STRIPE_PUBLISHABLE_KEY')
    STRIPE_WEBHOOK_SECRET = os.getenv('STRIPE_WEBHOOK_SECRET')
    
    # SendGrid
    SENDGRID_API_KEY = os.getenv('SENDGRID_API_KEY')
    SENDGRID_FROM_EMAIL = os.getenv('SENDGRID_FROM_EMAIL', 'noreply@marketedgepros.com')
    
    # MetaTrader (placeholder for future implementation)
    MT_SERVER = os.getenv('MT_SERVER')
    MT_LOGIN = os.getenv('MT_LOGIN')
    MT_PASSWORD = os.getenv('MT_PASSWORD')
    
    # File Upload
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB max file size
    UPLOAD_FOLDER = os.getenv('UPLOAD_FOLDER', '/tmp/uploads')
    
    # Pagination
    ITEMS_PER_PAGE = 20
    
    # Rate Limiting
    RATELIMIT_ENABLED = True
    RATELIMIT_STORAGE_URL = REDIS_URL


class DevelopmentConfig(Config):
    """Development configuration"""
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = os.getenv(
        'DATABASE_URL',
        'postgresql://postgres:postgres@localhost:5432/proptradepro_dev'
    )
    SQLALCHEMY_ECHO = True
    RATELIMIT_ENABLED = False


class TestingConfig(Config):
    """Testing configuration"""
    TESTING = True
    SQLALCHEMY_DATABASE_URI = os.getenv(
        'TEST_DATABASE_URL',
        'postgresql://postgres:postgres@localhost:5432/proptradepro_test'
    )
    RATELIMIT_ENABLED = False


class ProductionConfig(Config):
    """Production configuration"""
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL')
    
    # Override to ensure SECRET_KEY is set
    SECRET_KEY = os.getenv('SECRET_KEY') or Config.SECRET_KEY
    
    # Ensure critical settings are set in production
    @classmethod
    def init_app(cls, app):
        Config.init_app(app)
        
        # Check for required environment variables
        required_vars = [
            'SECRET_KEY',
            'DATABASE_URL',
            'REDIS_URL',
            'STRIPE_SECRET_KEY',
            'SENDGRID_API_KEY'
        ]
        
        missing_vars = [var for var in required_vars if not os.getenv(var)]
        if missing_vars:
            raise ValueError(
                f"Missing required environment variables: {', '.join(missing_vars)}"
            )


# Configuration dictionary
config = {
    'development': DevelopmentConfig,
    'testing': TestingConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}


def get_config():
    """Get configuration based on environment"""
    env = os.getenv('FLASK_ENV', 'production')  # Default to production
    config_class = config.get(env, config['production'])
    return config_class

