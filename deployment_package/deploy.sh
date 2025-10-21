#!/bin/bash
echo "=== Deploying PropTradePro Updates ==="

# Create backup directory
BACKUP_DIR="/root/PropTradePro/backups/$(date +%Y%m%d_%H%M%S)"
echo "Creating backup directory: $BACKUP_DIR"
mkdir -p $BACKUP_DIR

# Backup existing files
echo "Backing up existing files..."
cp /root/PropTradePro/backend/src/routes/users.py $BACKUP_DIR/ 2>/dev/null || echo "users.py not found (new file)"
cp /root/PropTradePro/backend/src/config.py $BACKUP_DIR/ 2>/dev/null || true
cp /root/PropTradePro/backend/src/database.py $BACKUP_DIR/ 2>/dev/null || true
cp /root/PropTradePro/frontend/src/pages/user/UserDashboard_mui.jsx $BACKUP_DIR/ 2>/dev/null || true
cp /root/PropTradePro/frontend/src/pages/user/Profile_mui.jsx $BACKUP_DIR/ 2>/dev/null || true
cp /root/PropTradePro/frontend/src/pages/user/Documents.jsx $BACKUP_DIR/ 2>/dev/null || true

# Deploy backend files
echo "Deploying backend files..."
cp backend/users.py /root/PropTradePro/backend/src/routes/
cp backend/config.py /root/PropTradePro/backend/src/
cp backend/database.py /root/PropTradePro/backend/src/
cp backend/.env /root/PropTradePro/backend/

# Deploy frontend files
echo "Deploying frontend files..."
cp frontend/UserDashboard_mui.jsx /root/PropTradePro/frontend/src/pages/user/
cp frontend/Profile_mui.jsx /root/PropTradePro/frontend/src/pages/user/
cp frontend/Documents.jsx /root/PropTradePro/frontend/src/pages/user/

echo "✓ Files deployed successfully"
echo ""
echo "Next steps:"
echo "1. Restart backend: cd /root/PropTradePro/backend && ps aux | grep 'python.*app.py' | grep -v grep | awk '{print \$2}' | xargs kill"
echo "2. Start backend: cd /root/PropTradePro/backend && PYTHONPATH=/root/PropTradePro/backend nohup python3.11 src/app.py > backend.log 2>&1 &"
echo "3. Rebuild frontend: cd /root/PropTradePro/frontend && npm run build"
echo "4. Verify: curl http://localhost:5000/health"

