#!/bin/bash
# Deployment script for Payment Approval System
# Run this script on the production server (146.190.21.113)

set -e  # Exit on error

echo "=========================================="
echo "  Payment Approval System Deployment"
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Step 1: Pull latest code from GitHub
echo -e "${YELLOW}Step 1: Pulling latest code from GitHub...${NC}"
cd /root/PropTradePro
git pull origin master
echo -e "${GREEN}✓ Code updated${NC}"
echo ""

# Step 2: Run database migration
echo -e "${YELLOW}Step 2: Running database migration...${NC}"
echo "Note: Database migration should be run manually or using environment variables"
echo "Command: PGPASSWORD=\$DB_PASSWORD psql -h \$DB_HOST -p \$DB_PORT -U \$DB_USER -d \$DB_NAME -f /root/PropTradePro/backend/migrations/add_payment_approval_system.sql"
echo -e "${YELLOW}⚠ Skipping migration - run manually if needed${NC}"
echo ""

# Step 3: Restart backend
echo -e "${YELLOW}Step 3: Restarting backend...${NC}"
cd /root/PropTradePro/backend

# Kill existing Flask processes
pkill -f "python.*app.py" || true
sleep 2

# Start Flask backend
PYTHONPATH=/root/PropTradePro/backend nohup python3 src/app.py > /tmp/backend.log 2>&1 &
sleep 3

# Check if backend is running
if curl -s http://localhost:5000/health | grep -q "healthy"; then
    echo -e "${GREEN}✓ Backend is running${NC}"
else
    echo -e "${RED}✗ Backend failed to start. Check /tmp/backend.log${NC}"
    tail -20 /tmp/backend.log
    exit 1
fi
echo ""

# Step 4: Build and deploy frontend
echo -e "${YELLOW}Step 4: Building frontend...${NC}"
cd /root/PropTradePro/frontend
npm run build
echo -e "${GREEN}✓ Frontend built${NC}"
echo ""

echo -e "${YELLOW}Step 5: Deploying frontend...${NC}"
rm -rf /var/www/marketedgepros/*
cp -r /root/PropTradePro/frontend/dist/* /var/www/marketedgepros/
chown -R www-data:www-data /var/www/marketedgepros
echo -e "${GREEN}✓ Frontend deployed${NC}"
echo ""

# Step 6: Reload Nginx
echo -e "${YELLOW}Step 6: Reloading Nginx...${NC}"
nginx -t && systemctl reload nginx
echo -e "${GREEN}✓ Nginx reloaded${NC}"
echo ""

# Step 7: Verify deployment
echo -e "${YELLOW}Step 7: Verifying deployment...${NC}"
echo ""

# Check backend
if curl -s http://localhost:5000/ | grep -q "payment_approvals"; then
    echo -e "${GREEN}✓ Backend API: Payment Approvals endpoint registered${NC}"
else
    echo -e "${RED}✗ Backend API: Payment Approvals endpoint not found${NC}"
fi

# Check frontend
if [ -f "/var/www/marketedgepros/index.html" ]; then
    echo -e "${GREEN}✓ Frontend: Files deployed${NC}"
else
    echo -e "${RED}✗ Frontend: Deployment failed${NC}"
fi

echo ""
echo "=========================================="
echo -e "${GREEN}  Deployment Complete!${NC}"
echo "=========================================="
echo ""
echo "New Features Available:"
echo "  • Payment Approval System"
echo "  • Cash/Free payment support"
echo "  • Super Admin approval workflow"
echo ""
echo "Access the admin panel at:"
echo "  https://marketedgepros.com/admin/payment-approvals"
echo ""
echo "API Endpoints:"
echo "  GET  /api/v1/payment-approvals/pending"
echo "  GET  /api/v1/payment-approvals/my-requests"
echo "  POST /api/v1/payment-approvals/create"
echo "  POST /api/v1/payment-approvals/:id/approve"
echo "  POST /api/v1/payment-approvals/:id/reject"
echo "  GET  /api/v1/payment-approvals/stats"
echo ""

