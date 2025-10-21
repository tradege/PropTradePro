# PropTradePro - Quick Start Guide

## 🚀 Running the Application

### Prerequisites
- Node.js 18+ installed
- npm or yarn installed
- Backend API running (optional for development)

### Frontend Setup

1. **Navigate to frontend directory:**
```bash
cd /home/ubuntu/PropTradePro/frontend
```

2. **Install dependencies (if not already installed):**
```bash
npm install
```

3. **Start development server:**
```bash
npm run dev
```

The application will be available at: `http://localhost:5173`

### Build for Production

```bash
npm run build
```

Output will be in the `dist/` directory.

---

## 🔐 Test Accounts

### Admin Account
- **Email:** admin@proptradepro.com
- **Password:** admin123
- **Role:** super_admin
- **Access:** Full admin panel

### Agent Account
- **Email:** agent@proptradepro.com
- **Password:** agent123
- **Role:** agent
- **Access:** Agent panel

### Trader Account
- **Email:** trader@proptradepro.com
- **Password:** trader123
- **Role:** trader
- **Access:** Trader panel

---

## 📱 Available Routes

### Public Routes
- `/` - Home page
- `/programs` - Trading programs
- `/about` - About us
- `/how-it-works` - How it works
- `/faq` - FAQ
- `/contact` - Contact

### Auth Routes
- `/login` - Login
- `/register` - Register
- `/forgot-password` - Forgot password
- `/reset-password` - Reset password

### Admin Routes (requires admin role)
- `/admin` - Admin dashboard
- `/admin/users` - User management
- `/admin/programs` - Programs management
- `/admin/payments` - Payments management
- `/admin/kyc` - KYC approval
- `/admin/settings` - Settings

### Agent Routes (requires agent role)
- `/agent` - Agent dashboard
- `/agent/traders` - Traders management
- `/agent/commissions` - Commissions
- `/agent/reports` - Reports

### Trader Routes (requires trader role)
- `/trader` - Trader dashboard
- `/trader/history` - Trading history
- `/trader/withdrawals` - Withdrawals
- `/trader/documents` - Documents

---

## 🛠️ Development Notes

### Mock Data
All pages currently use mock data for development. To connect to real API:

1. Update `src/services/api.js` with your backend URL
2. Replace mock data with actual API calls in each page
3. Test all endpoints

### Environment Variables
Create a `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:3000/api/v1
VITE_APP_NAME=PropTradePro
```

### Code Structure
- `src/pages/` - All page components
- `src/components/` - Reusable components
- `src/store/` - State management (Zustand)
- `src/services/` - API services

---

## 📦 Features

### Admin Panel
✅ User management (CRUD)
✅ Programs management
✅ Payments tracking
✅ KYC approval
✅ System settings

### Agent Panel
✅ Trader portfolio
✅ Commission tracking
✅ Performance reports
✅ Analytics

### Trader Panel
✅ Account dashboard
✅ Trading history
✅ Withdrawal requests
✅ Document uploads

---

## 🐛 Troubleshooting

### Port already in use
```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
```

### Dependencies issues
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Build errors
```bash
# Check for TypeScript/ESLint errors
npm run lint
```

---

## 📞 Support

For issues or questions:
- Check the documentation in `/docs`
- Review the complete report: `FRONTEND_PAGES_COMPLETE_REPORT.md`
- Contact: support@proptradepro.com

---

**Last Updated:** October 18, 2024
