"""
Main Flask application factory
"""
from flask import Flask, jsonify
from flask_cors import CORS
from src.config import get_config
from src.database import init_db
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
    
    # Configure CORS
    CORS(app, origins=app.config['CORS_ORIGINS'], supports_credentials=True)
    
    # Configure logging
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    
    # Register blueprints
    from src.routes.auth import auth_bp
    from src.routes.programs import programs_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/v1/auth')
    app.register_blueprint(programs_bp, url_prefix='/api/v1/programs')
    
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
                'programs': '/api/v1/programs'
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

