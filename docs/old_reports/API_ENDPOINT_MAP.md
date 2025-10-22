# MarketEdgePros API Endpoint Map

## Complete Backend API Inventory

### 1. Authentication (`/api/v1/auth`)
| Endpoint | Method | Purpose | Status |
|----------|--------|---------|--------|
| `/register` | POST | User registration | ✅ Exists |
| `/login` | POST | User login | ✅ Exists |
| `/login/2fa` | POST | Two-factor authentication | ✅ Exists |
| `/logout` | POST | User logout | ✅ Exists |
| `/refresh` | POST | Refresh JWT token | ✅ Exists |
| `/verify-email/<token>` | GET | Email verification | ✅ Exists |
| `/verify-email` | POST | Email verification | ✅ Exists |
| `/resend-verification` | POST | Resend verification email | ✅ Exists |
| `/password/reset-request` | POST | Request password reset | ✅ Exists |
| `/password/reset` | POST | Reset password | ✅ Exists |
| `/password/verify-code` | POST | Verify reset code | ✅ Exists |
| `/password/reset-with-code` | POST | Reset with code | ✅ Exists |
| `/2fa/enable` | POST | Enable 2FA | ✅ Exists |
| `/2fa/confirm` | POST | Confirm 2FA setup | ✅ Exists |
| `/2fa/disable` | POST | Disable 2FA | ✅ Exists |
| `/me` | GET | Get current user info | ✅ Exists |

**Total: 16 endpoints**

---

### 2. Users (`/api/v1/users`)
| Endpoint | Method | Purpose | Status |
|----------|--------|---------|--------|
| `/dashboard` | GET | User dashboard data | ✅ Exists |
| `/profile` | GET | Get user profile | ✅ Exists |
| `/profile` | PUT | Update user profile | ✅ Exists |

**Total: 3 endpoints**

---

### 3. Profile (`/api/v1/profile`)
| Endpoint | Method | Purpose | Status |
|----------|--------|---------|--------|
| `` | GET | Get profile | ✅ Exists |
| `` | PUT | Update profile | ✅ Exists |
| `/password` | PUT | Change password | ✅ Exists |
| `/avatar` | POST | Upload avatar | ✅ Exists |
| `/avatar` | DELETE | Delete avatar | ✅ Exists |
| `/stats` | GET | Profile statistics | ✅ Exists |

**Total: 6 endpoints**

---

### 4. Programs (`/api/v1/programs`)
| Endpoint | Method | Purpose | Status |
|----------|--------|---------|--------|
| `/` | GET | List all programs | ✅ Exists |
| `/<program_id>` | GET | Get program details | ✅ Exists |
| `/` | POST | Create program (admin) | ✅ Exists |
| `/<program_id>` | PUT | Update program (admin) | ✅ Exists |
| `/<program_id>/addons` | POST | Add program addons | ✅ Exists |
| `/<program_id>/purchase` | POST | Purchase program | ✅ Exists |
| `/my-challenges` | GET | Get user's challenges | ✅ Exists |
| `/challenges/<challenge_id>` | GET | Get challenge details | ✅ Exists |

**Total: 8 endpoints**

---

### 5. Challenges (`/api/v1/challenges`)
| Endpoint | Method | Purpose | Status |
|----------|--------|---------|--------|
| `/` | POST | Create challenge | ✅ Exists |
| `/<challenge_id>/start` | POST | Start challenge | ✅ Exists |
| `/<challenge_id>/evaluate` | POST | Evaluate challenge | ✅ Exists |
| `/<challenge_id>/fund` | POST | Fund challenge | ✅ Exists |
| `/<challenge_id>/trades` | POST | Submit trades | ✅ Exists |
| `/admin/all` | GET | Get all challenges (admin) | ✅ Exists |
| `/admin/<challenge_id>` | DELETE | Delete challenge (admin) | ✅ Exists |

**Total: 7 endpoints**

---

### 6. KYC (`/api/v1/kyc`)
| Endpoint | Method | Purpose | Status |
|----------|--------|---------|--------|
| `/documents` | GET | Get user documents | ✅ Exists |
| `/documents/<type>/upload` | POST | Upload document | ✅ Exists |
| `/admin/submissions` | GET | Get all submissions (admin) | ✅ Exists |
| `/admin/submissions/<user_id>` | GET | Get user submission (admin) | ✅ Exists |
| `/admin/submissions/<user_id>/approve` | POST | Approve KYC (admin) | ✅ Exists |
| `/admin/submissions/<user_id>/reject` | POST | Reject KYC (admin) | ✅ Exists |
| `/admin/submissions/<user_id>/documents/<type>` | PUT | Update document (admin) | ✅ Exists |

**Total: 7 endpoints**

---

### 7. Payments (`/api/v1/payments`)
| Endpoint | Method | Purpose | Status |
|----------|--------|---------|--------|
| `/create-payment-intent` | POST | Create payment intent | ✅ Exists |
| `/confirm-payment` | POST | Confirm payment | ✅ Exists |
| `/webhook` | POST | Stripe webhook | ✅ Exists |
| `/refund/<challenge_id>` | POST | Refund payment | ✅ Exists |
| `/status/<payment_intent_id>` | GET | Get payment status | ✅ Exists |

**Total: 5 endpoints**

---

### 8. Traders (`/api/v1/traders`)
| Endpoint | Method | Purpose | Status |
|----------|--------|---------|--------|
| `/dashboard` | GET | Trader dashboard | ✅ Exists |
| `/history` | GET | Trading history | ✅ Exists |
| `/withdrawals` | GET | Get withdrawals | ✅ Exists |
| `/withdrawals` | POST | Request withdrawal | ✅ Exists |
| `/challenges` | GET | Get trader challenges | ✅ Exists |
| `/challenges/<challenge_id>` | GET | Get challenge details | ✅ Exists |

**Total: 6 endpoints**

---

### 9. Agents (`/api/v1/agents`)
| Endpoint | Method | Purpose | Status |
|----------|--------|---------|--------|
| `/dashboard` | GET | Agent dashboard | ✅ Exists |
| `/traders` | GET | Get agent's traders | ✅ Exists |
| `/commissions` | GET | Get commissions | ✅ Exists |
| `/code/<agent_code>` | GET | Get agent by code | ✅ Exists |

**Total: 4 endpoints**

---

### 10. Hierarchy (`/api/v1/hierarchy`)
| Endpoint | Method | Purpose | Status |
|----------|--------|---------|--------|
| `/my-downline` | GET | Get downline | ✅ Exists |
| `/my-direct-team` | GET | Get direct team | ✅ Exists |
| `/create-user` | POST | Create user in hierarchy | ✅ Exists |
| `/user/<user_id>` | GET | Get user details | ✅ Exists |
| `/user/<user_id>` | PUT | Update user | ✅ Exists |
| `/tree` | GET | Get hierarchy tree | ✅ Exists |
| `/stats` | GET | Get hierarchy stats | ✅ Exists |

**Total: 7 endpoints**

---

### 11. CRM (`/api/v1/crm`)
| Endpoint | Method | Purpose | Status |
|----------|--------|---------|--------|
| `/leads` | GET | Get all leads | ✅ Exists |
| `/leads` | POST | Create lead | ✅ Exists |
| `/leads/<lead_id>` | GET | Get lead details | ✅ Exists |
| `/leads/<lead_id>` | PUT | Update lead | ✅ Exists |
| `/leads/<lead_id>/activities` | POST | Add activity | ✅ Exists |
| `/leads/<lead_id>/notes` | POST | Add note | ✅ Exists |
| `/leads/<lead_id>/convert` | POST | Convert lead | ✅ Exists |
| `/leads/<lead_id>/lost` | POST | Mark lead as lost | ✅ Exists |
| `/stats` | GET | Get CRM stats | ✅ Exists |
| `/pipeline` | GET | Get sales pipeline | ✅ Exists |

**Total: 10 endpoints**

---

### 12. Reports (`/api/v1/reports`)
| Endpoint | Method | Purpose | Status |
|----------|--------|---------|--------|
| `/agent/dashboard` | GET | Agent dashboard report | ✅ Exists |
| `/agent/traders` | GET | Agent traders report | ✅ Exists |
| `/agent/commissions` | GET | Agent commissions report | ✅ Exists |
| `/agent/analytics` | GET | Agent analytics | ✅ Exists |
| `/admin/analytics` | GET | Admin analytics | ✅ Exists |

**Total: 5 endpoints**

---

### 13. Admin (`/api/v1/admin`)
| Endpoint | Method | Purpose | Status |
|----------|--------|---------|--------|
| *Need to check admin.py* | - | Admin endpoints | ⚠️ Unknown |

**Total: Unknown**

---

### 14. Uploads (`/api/v1/uploads`)
| Endpoint | Method | Purpose | Status |
|----------|--------|---------|--------|
| `/kyc` | POST | Upload KYC document | ✅ Exists |
| `/profile-image` | POST | Upload profile image | ✅ Exists |
| `/tenant-logo` | POST | Upload tenant logo | ✅ Exists |
| `/<filename>` | GET | Get uploaded file | ✅ Exists |

**Total: 4 endpoints**

---

## Summary

| Blueprint | Endpoints | Status |
|-----------|-----------|--------|
| Auth | 16 | ✅ Complete |
| Users | 3 | ✅ Complete |
| Profile | 6 | ✅ Complete |
| Programs | 8 | ✅ Complete |
| Challenges | 7 | ✅ Complete |
| KYC | 7 | ✅ Complete |
| Payments | 5 | ✅ Complete |
| Traders | 6 | ✅ Complete |
| Agents | 4 | ✅ Complete |
| Hierarchy | 7 | ✅ Complete |
| CRM | 10 | ✅ Complete |
| Reports | 5 | ✅ Complete |
| Admin | ? | ⚠️ Need to check |
| Uploads | 4 | ✅ Complete |

**Total Mapped: 88+ endpoints**

---

## Next Steps
1. Check admin.py endpoints
2. Test critical endpoints
3. Identify frontend usage
4. Document missing features

