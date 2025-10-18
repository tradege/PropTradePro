"""
Main Flask application factory
"""
from flask import Flask, jsonify
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from src.config import get_config
from src.database import db, init_db
import logging


def create_app(config_name=None):
    """Create and configure Flask application"""
    app = Flask(__name__)
    
    # Load configuration
    if config_name:
        from src.config import config
        app.config.from_object(config[config_name])
    else:
        app.config.from_object(get_config())
    
    # Initialize extensions
    init_db(app)
    
    # Enable CORS
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    
    # Rate Limiting
    if app.config.get('RATELIMIT_ENABLED'):
        limiter = Limiter(
            app=app,
            key_func=get_remote_address,
            storage_uri=app.config.get('RATELIMIT_STORAGE_URL'),
            default_limits=["200 per day", "50 per hour"]
        )
        app.limiter = limiter
    
    # Configure logging
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    
    # Register blueprints
    from src.routes.auth import auth_bp
    from src.routes.programs import programs_bp
    from src.routes.payments import payments_bp
    from src.routes.uploads import uploads_bp
    from src.routes.agents import agents_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/v1/auth')
    app.register_blueprint(programs_bp, url_prefix='/api/v1/programs')
    app.register_blueprint(payments_bp, url_prefix='/api/v1/payments')
    app.register_blueprint(uploads_bp, url_prefix='/api/v1/uploads')
    app.register_blueprint(agents_bp, url_prefix='/api/v1/agents')
    
    # Health check endpoint
    @app.route('/health', methods=['GET'])
    def health_check():
        return jsonify({
            'status': 'healthy',
            'service': 'PropTradePro API',
            'version': '1.0.0'
        }), 200
    
    # Root endpoint
    @app.route('/', methods=['GET'])
    def index():
        return jsonify({
            'message': 'PropTradePro API',
            'version': '1.0.0',
            'endpoints': {
                'health': '/health',
                'auth': '/api/v1/auth',
                'programs': '/api/v1/programs',
                'payments': '/api/v1/payments',
                'uploads': '/api/v1/uploads',
                'agents': '/api/v1/agents'
            }
        }), 200
    
    # Error handlers
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({'error': 'Resource not found'}), 404
    
    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({'error': 'Internal server error'}), 500
    
    @app.errorhandler(Exception)
    def handle_exception(error):
        app.logger.error(f'Unhandled exception: {str(error)}')
        return jsonify({'error': 'An unexpected error occurred'}), 500
    
    return app


if __name__ == '__main__':
    app = create_app()
    app.run(host='0.0.0.0', port=5000, debug=True)

