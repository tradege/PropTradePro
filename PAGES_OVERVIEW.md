# PropTradePro - Pages Overview

This document provides a comprehensive overview of all pages created for the PropTradePro trading platform.

---

## 🎯 System Architecture

The PropTradePro platform is built with a **role-based architecture** supporting three main user types:

### User Roles

**1. Admin (super_admin, admin)**
- Full system control and management
- User management, program configuration, payment tracking
- KYC approval, system settings

**2. Agent**
- Manages referred traders
- Tracks commissions and earnings
- Views performance reports and analytics

**3. Trader**
- Participates in trading challenges
- Tracks trading performance
- Manages withdrawals and documents

---

## 📊 Admin Panel

The Admin Panel provides comprehensive tools for platform management and oversight.

### Admin Dashboard (`/admin`)

**Purpose:** Central hub for administrators to monitor platform health and activity.

**Key Features:**
- Platform statistics overview with key metrics
- User metrics: Total users, active users, pending KYC
- Revenue tracking: Total revenue, monthly revenue, average per user
- Challenge statistics: Active, completed, failed, and funded challenges
- Recent users table with status and registration date
- Recent payments table with transaction details
- Quick action buttons for common tasks

**Visual Elements:**
- 4 statistics cards with icons (Users, Revenue, Challenges, Funded)
- 2 data tables (Recent Users, Recent Payments)
- Color-coded status badges
- Responsive grid layout

---

### User Management (`/admin/users`)

**Purpose:** Complete user lifecycle management.

**Key Features:**
- User list with search functionality
- Filter by role (all, admin, agent, trader)
- User statistics cards (total, active, pending KYC, suspended)
- Create new user modal with form
- Edit user functionality
- Delete user with confirmation
- Status management (active, suspended)
- Role assignment

**User Table Columns:**
- Name and email
- Role (with colored badge)
- Status (active/suspended)
- Registration date
- Actions (edit, delete)

---

### Programs Management (`/admin/programs`)

**Purpose:** Create and manage trading challenge programs.

**Key Features:**
- Program list with enrollment statistics
- Create/edit program modal
- Program configuration:
  - Name and description
  - Program type (Two Phase, One Phase, Instant Funding)
  - Account size ($10K to $200K)
  - Price ($99 to $999)
  - Profit target (5% to 10%)
  - Max daily loss (3% to 5%)
  - Max total drawdown (6% to 10%)
  - Minimum trading days (1 to 15)
- Active/inactive status toggle
- Delete program functionality

**Program Cards Display:**
- Program name and type badge
- Account size and price
- Profit target and drawdown limits
- Enrollment count
- Edit and delete buttons

---

### Payments Management (`/admin/payments`)

**Purpose:** Monitor and manage all platform transactions.

**Key Features:**
- Transaction statistics:
  - Total revenue
  - Pending payments
  - Refunded amount
  - Transaction count
- Transaction table with:
  - Transaction ID
  - User information
  - Amount
  - Type (enrollment, withdrawal, refund)
  - Status (completed, pending, refunded)
  - Date
- Refund processing functionality
- Export to CSV
- Transaction details modal

**Status Colors:**
- Completed: Green
- Pending: Yellow
- Refunded: Red

---

### Settings (`/admin/settings`)

**Purpose:** Configure system-wide settings and integrations.

**Settings Categories:**

**1. General Settings**
- Site name
- Site description
- Support email
- Timezone selection

**2. Email Settings**
- Email provider (SendGrid, Mailgun, SMTP)
- API key configuration
- Sender email and name

**3. Payment Settings**
- Stripe integration (API keys)
- PayPal integration (Client ID, Secret)

**4. Notification Settings**
- Email notifications toggle
- SMS notifications toggle
- Push notifications toggle

**5. Security Settings**
- Require 2FA toggle
- Session timeout (minutes)
- Password minimum length
- Require special characters

**6. Trading Settings**
- Maximum leverage
- Allowed markets (Forex, Stocks, Crypto, Commodities, Indices)

**Visual Layout:**
- Tabbed interface for different setting categories
- Form inputs with labels
- Save button for each section
- Success/error notifications

---

### KYC Approval (`/admin/kyc`)

**Purpose:** Review and approve trader KYC submissions.

**Key Features:**
- KYC submission statistics
- Pending submissions list
- Document viewer
- Approve/reject functionality
- Notes for rejection reasons

---

## 🤝 Agent Panel

The Agent Panel enables agents to manage their trader portfolio and track earnings.

### Agent Dashboard (`/agent`)

**Purpose:** Overview of agent performance and trader activity.

**Key Features:**
- Trader statistics:
  - Total traders
  - Active traders
  - Funded traders
- Commission overview:
  - Total commissions
  - Pending commissions
  - This month earnings
- Challenge performance metrics:
  - Pass rate
  - Average profit per trader
- Recent traders list
- Recent commissions list
- Quick action links

**Visual Elements:**
- 6 statistics cards with icons
- 2 data tables (Recent Traders, Recent Commissions)
- Performance metrics with percentages
- Color-coded status indicators

---

### Traders Management (`/agent/traders`)

**Purpose:** View and manage referred traders.

**Key Features:**
- Trader portfolio overview
- Search traders by name
- Filter by status (all, active, funded, failed)
- Trader statistics cards
- Trader table with:
  - Name and email
  - Challenge phase
  - Balance
  - Profit/Loss
  - Win rate
  - Status
  - View details action
- Trader details modal with:
  - Contact information
  - Trading statistics
  - Challenge progress
  - Recent trades

**Status Colors:**
- Active: Blue
- Funded: Green
- Failed: Red
- Pending: Yellow

---

### Commissions (`/agent/commissions`)

**Purpose:** Track earnings and commission history.

**Key Features:**
- Commission statistics:
  - Total earned
  - This month earnings
  - Pending commissions
  - Paid out amount
- Commission types information:
  - Enrollment commission (30%)
  - Profit share commission (10%)
  - Renewal commission (20%)
- Commission history table with:
  - Date
  - Trader name
  - Commission type
  - Program
  - Rate
  - Amount
  - Status
  - Payout date
- Period filter (all time, this month, last month, this year)
- Export to CSV

**Commission Types:**
- Enrollment: Blue badge
- Profit Share: Green badge
- Renewal: Purple badge

---

### Reports (`/agent/reports`)

**Purpose:** Analytics and performance insights.

**Key Features:**
- Overview statistics:
  - New traders
  - Active traders
  - Total commissions
  - Average commission per trader
- Performance metrics:
  - Pass rate with progress bar
  - Average win rate with progress bar
  - Average profit per trader
  - Funded accounts count
- Monthly trends visualization:
  - Traders count
  - Commissions earned
  - Funded accounts
  - Bar chart visualization
- Top performing traders table:
  - Rank (with medals for top 3)
  - Trader name
  - Profit
  - Win rate
  - Total trades
- Period selection
- Export report functionality

---

## 📈 Trader Panel

The Trader Panel provides traders with tools to monitor performance and manage their account.

### Trader Dashboard (`/trader`)

**Purpose:** Central hub for trader account and performance overview.

**Key Features:**
- Account overview cards:
  - Balance
  - Equity
  - Total P&L (with percentage)
  - Drawdown (current and max)
- Challenge progress tracking:
  - Profit target progress bar
  - Trading days progress bar
  - Remaining amounts display
- Trading statistics:
  - Total trades
  - Winning trades
  - Losing trades
  - Win rate
  - Average win
  - Average loss
  - Profit factor
- Recent trades table
- Quick action links to:
  - Trading history
  - Withdrawals
  - Documents

**Visual Elements:**
- 4 account metric cards
- 2 progress tracking cards with bars
- 7 statistics cards
- Recent trades table
- Color-coded P&L indicators (green/red)

---

### Trading History (`/trader/history`)

**Purpose:** Complete trade history with analysis.

**Key Features:**
- Trading statistics summary:
  - Total trades
  - Winning trades
  - Losing trades
  - Total profit
  - Total pips
- Search by symbol
- Filter by:
  - Trade type (all, buy, sell)
  - Period (all time, today, this week, this month)
- Comprehensive trade table:
  - Symbol
  - Type (buy/sell with icon)
  - Lots
  - Open price
  - Close price
  - Open time
  - Close time
  - Pips (color-coded)
  - Profit (color-coded)
- Export to CSV
- 50+ mock trades for demonstration

**Trade Type Indicators:**
- Buy: Green badge with up arrow
- Sell: Red badge with down arrow

---

### Withdrawals (`/trader/withdrawals`)

**Purpose:** Request and track payout requests.

**Key Features:**
- Withdrawal statistics:
  - Available balance
  - Total withdrawn
  - Pending withdrawals
  - Completed count
- New withdrawal request modal:
  - Amount input with validation
  - Withdrawal method selection (bank transfer, PayPal, crypto)
  - Account details textarea
  - Minimum $100 validation
- Withdrawal history table:
  - Transaction ID
  - Amount
  - Method
  - Status (with icon)
  - Requested date
  - Processed date
- Withdrawal information box with guidelines
- Status tracking:
  - Pending: Yellow with clock icon
  - Processing: Blue with clock icon
  - Completed: Green with checkmark
  - Rejected: Red with X icon

**Withdrawal Guidelines:**
- Minimum withdrawal: $100
- Processing time: 1-3 business days
- Weekdays only processing
- Funded accounts only
- Bank fees may apply

---

### Documents (`/trader/documents`)

**Purpose:** KYC document upload and verification.

**Key Features:**
- Verification status overview:
  - Required documents count
  - Approved documents
  - Pending review
  - Rejected documents
- Document types:
  - **ID Proof** (required): Passport, Driver's License, National ID
  - **Address Proof** (required): Utility bill, bank statement
  - **Selfie with ID** (required): Photo holding ID
  - **Bank Statement** (optional): For withdrawal verification
- Upload functionality:
  - File type validation (JPG, PNG, PDF)
  - File size validation (max 5MB)
  - Upload progress indicator
- Document status tracking:
  - Not uploaded: Gray with upload button
  - Pending: Yellow with clock icon
  - Approved: Green with checkmark
  - Rejected: Red with X icon and re-upload option
- Document review notes display
- Upload guidelines box

**Document Guidelines:**
- Clear, legible, color documents
- All four corners visible
- Accepted formats: JPG, PNG, PDF (max 5MB)
- Address proof not older than 3 months
- Selfie: Hold ID next to face
- Review time: 1-3 business days

---

## 🎨 Design System

### Color Palette

**Primary Colors:**
- Primary: Blue (#2563eb)
- Success: Green (#10b981)
- Warning: Yellow (#f59e0b)
- Danger: Red (#ef4444)
- Info: Purple (#8b5cf6)

**Neutral Colors:**
- Gray scale from 50 to 900
- White background
- Dark text

### Typography

**Font Family:** Inter (system font stack)

**Font Sizes:**
- Headings: 3xl (30px), 2xl (24px), xl (20px), lg (18px)
- Body: base (16px), sm (14px), xs (12px)

### Components

**Buttons:**
- Primary: Blue background, white text
- Secondary: Gray background, dark text
- Sizes: Small, medium, large
- States: Default, hover, active, disabled

**Cards:**
- White background
- Rounded corners (8px)
- Shadow: Small elevation
- Padding: 24px

**Badges:**
- Rounded full
- Small padding
- Color-coded by status
- Font weight: Medium

**Tables:**
- Striped rows on hover
- Header: Gray background
- Borders: Light gray
- Responsive: Horizontal scroll on mobile

**Forms:**
- Input fields: Border, rounded corners
- Labels: Above input, medium weight
- Validation: Red border on error
- Help text: Small, gray

### Icons

**Library:** Lucide React

**Common Icons:**
- Users, TrendingUp, DollarSign, Activity
- CheckCircle, Clock, XCircle, AlertTriangle
- Upload, Download, Search, Filter
- Menu, X, LogOut, Settings

### Responsive Design

**Breakpoints:**
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

**Layout:**
- Mobile: Single column, hamburger menu
- Tablet: 2-column grid
- Desktop: Sidebar + main content

---

## 🔐 Security Features

### Authentication
- JWT token-based authentication
- Token stored in localStorage
- Auto-refresh on page load
- Logout clears all auth data

### Authorization
- Role-based access control (RBAC)
- RoleGuard component for route protection
- Redirect to login if not authenticated
- Access denied page for unauthorized access

### Route Protection
- ProtectedRoute wrapper for authenticated routes
- PublicRoute wrapper for auth pages (redirects if logged in)
- RoleGuard for role-specific routes

---

## 📱 Mobile Responsiveness

All pages are fully responsive with:

**Mobile Features:**
- Hamburger menu for navigation
- Collapsible sidebar
- Touch-friendly buttons and inputs
- Horizontal scroll for tables
- Stacked cards on small screens
- Bottom sheet modals

**Tablet Features:**
- 2-column layouts
- Visible sidebar with toggle
- Grid layouts for cards
- Responsive tables

**Desktop Features:**
- Full sidebar navigation
- Multi-column layouts
- Large data tables
- Modal dialogs

---

## 🚀 Performance

### Build Optimization
- Vite bundler for fast builds
- Code splitting ready
- Tree shaking enabled
- CSS purging with TailwindCSS

### Loading States
- Skeleton screens
- Spinner indicators
- Progress bars
- Lazy loading ready

### Error Handling
- Try-catch blocks
- Error boundaries ready
- User-friendly error messages
- Fallback UI

---

## 📦 Dependencies

**Core:**
- React 18.3.1
- React Router DOM 7.1.1
- Vite 7.1.10

**UI:**
- TailwindCSS 3.4.17
- Lucide React 0.468.0

**State Management:**
- Zustand 5.0.2

**HTTP Client:**
- Axios 1.7.9

**Utilities:**
- date-fns (for date formatting)
- clsx (for conditional classes)

---

## 🎯 Next Steps

### Backend Integration
1. Connect all API endpoints
2. Replace mock data with real API calls
3. Implement error handling
4. Add loading states
5. Test all CRUD operations

### Testing
1. Unit tests for components
2. Integration tests for pages
3. E2E tests for user flows
4. Accessibility testing
5. Performance testing

### Deployment
1. Set up CI/CD pipeline
2. Configure environment variables
3. Build for production
4. Deploy to hosting service
5. Set up monitoring

### Enhancements
1. Add real-time updates (WebSocket)
2. Implement notifications system
3. Add chart visualizations
4. Enhance analytics
5. Add more filters and search

---

## 📞 Support

For technical support or questions:
- Email: support@proptradepro.com
- Documentation: `/docs`
- Quick Start: `QUICKSTART.md`
- Complete Report: `FRONTEND_PAGES_COMPLETE_REPORT.md`

---

**Document Version:** 1.0  
**Last Updated:** October 18, 2024  
**Total Pages:** 18 (Admin: 6, Agent: 4, Trader: 4, Guards: 1, Layouts: 3)

