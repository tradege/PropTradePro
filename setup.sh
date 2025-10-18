#!/bin/bash

# PropTradePro Setup Script
# This script sets up the PropTradePro platform on a fresh server

set -e

echo "🚀 PropTradePro Setup"
echo "===================="
echo ""

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
  echo "Please run as root (use sudo)"
  exit 1
fi

# Get database credentials
echo "Please provide your database connection details:"
read -p "Database Host: " DB_HOST
read -p "Database Port [5432]: " DB_PORT
DB_PORT=${DB_PORT:-5432}
read -p "Database Name: " DB_NAME
read -p "Database User: " DB_USER
read -sp "Database Password: " DB_PASSWORD
echo ""

DATABASE_URL="postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?sslmode=require"

echo ""
echo "✅ Configuration received"
echo ""

# Update system
echo "📦 Updating system..."
apt update -qq && apt upgrade -y -qq

# Install Python
echo "🐍 Installing Python 3.11..."
apt install -y -qq python3.11 python3.11-venv python3-pip python3.11-dev libpq-dev build-essential

# Install Node.js
echo "📗 Installing Node.js 20..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash - > /dev/null 2>&1
apt install -y -qq nodejs

# Install other tools
echo "🔧 Installing Nginx and PostgreSQL client..."
apt install -y -qq nginx postgresql-client git curl wget

# Setup application
echo "📂 Setting up application..."
cd /var/www/PropTradePro

# Backend setup
echo "⚙️  Configuring Backend..."
cd backend

python3.11 -m venv venv
source venv/bin/activate

pip install --upgrade pip -q
pip install -q -r requirements.txt
pip install -q gunicorn psycopg2-binary

# Create .env
cat > .env << EOF
FLASK_APP=src/app.py
FLASK_ENV=production
SECRET_KEY=$(python3 -c "import secrets; print(secrets.token_hex(32))")
JWT_SECRET_KEY=$(python3 -c "import secrets; print(secrets.token_hex(32))")

DATABASE_URL=${DATABASE_URL}

CORS_ORIGINS=*

UPLOAD_FOLDER=/var/www/PropTradePro/backend/uploads
MAX_CONTENT_LENGTH=16777216
EOF

mkdir -p uploads

# Database migrations
echo "🗄️  Running database migrations..."
export FLASK_APP=src/app.py
flask db init 2>/dev/null || true
flask db migrate -m "Initial migration" 2>/dev/null || true
flask db upgrade

# Create admin user
echo "👤 Creating admin user..."
python3 << 'PYSCRIPT'
import sys
sys.path.insert(0, '/var/www/PropTradePro/backend')

try:
    from src.app import create_app, db
    from src.models.user import User
    from werkzeug.security import generate_password_hash

    app = create_app()

    with app.app_context():
        admin = User.query.filter_by(email='admin@proptradepro.com').first()
        
        if not admin:
            admin = User(
                email='admin@proptradepro.com',
                password_hash=generate_password_hash('admin123'),
                first_name='Admin',
                last_name='User',
                role='admin',
                is_active=True,
                is_verified=True
            )
            db.session.add(admin)
            db.session.commit()
            print('✅ Admin user created!')
        else:
            print('✅ Admin user already exists')
except Exception as e:
    print(f'⚠️  Could not create admin user: {e}')
PYSCRIPT

# Frontend setup
echo "🎨 Building Frontend..."
cd /var/www/PropTradePro/frontend

SERVER_IP=$(curl -s ifconfig.me)

cat > .env.production << EOF
VITE_API_URL=http://${SERVER_IP}:5000/api/v1
VITE_APP_NAME=PropTradePro
EOF

npm install --silent
npm run build

# Configure Nginx
echo "🌐 Configuring Nginx..."

cat > /etc/nginx/sites-available/proptradepro-api << 'EOF'
server {
    listen 5000;
    server_name _;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

cat > /etc/nginx/sites-available/proptradepro-frontend << 'EOF'
server {
    listen 80 default_server;
    server_name _;

    root /var/www/PropTradePro/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /assets {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF

ln -sf /etc/nginx/sites-available/proptradepro-api /etc/nginx/sites-enabled/
ln -sf /etc/nginx/sites-available/proptradepro-frontend /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

nginx -t
systemctl reload nginx

# Setup systemd service
echo "🚀 Setting up Backend service..."

cat > /etc/systemd/system/proptradepro.service << 'EOF'
[Unit]
Description=PropTradePro Backend API
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/var/www/PropTradePro/backend
Environment="PATH=/var/www/PropTradePro/backend/venv/bin"
ExecStart=/var/www/PropTradePro/backend/venv/bin/gunicorn -w 4 -b 127.0.0.1:8000 --timeout 300 "src.app:create_app()"
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable proptradepro
systemctl start proptradepro

# Configure firewall
echo "🔒 Configuring firewall..."
ufw allow 22/tcp -qq
ufw allow 80/tcp -qq
ufw allow 443/tcp -qq
ufw allow 5000/tcp -qq
echo "y" | ufw enable > /dev/null 2>&1

echo ""
echo "======================================"
echo "✅ Installation Complete!"
echo "======================================"
echo ""
echo "🌐 Access URLs:"
echo "   Frontend: http://${SERVER_IP}"
echo "   Backend API: http://${SERVER_IP}:5000/api/v1"
echo ""
echo "🔐 Default Admin Login:"
echo "   Email: admin@proptradepro.com"
echo "   Password: admin123"
echo ""
echo "📊 Useful Commands:"
echo "   systemctl status proptradepro"
echo "   journalctl -u proptradepro -f"
echo "   systemctl restart proptradepro"
echo ""
echo "🎉 Enjoy your PropTradePro platform!"
echo ""

