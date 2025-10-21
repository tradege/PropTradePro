# PropTradePro - מדריך גישה למערכת (Access Guide)

**תאריך:** 18 אוקטובר 2024  
**גרסה:** 1.0

---

## 🔐 איך להיכנס לכל דרג במערכת

המערכת תומכת ב-3 תפקידים עיקריים:
1. **Admin** (מנהל מערכת)
2. **Agent** (סוכן)
3. **Trader** (סוחר)

---

## 🎯 גישה מהירה - Quick Access

### אופציה 1: התחברות עם חשבונות בדיקה (Mock Data)

כרגע המערכת עובדת עם **mock data** (נתוני בדיקה), כך שתוכל להיכנס ישירות:

#### 👨‍💼 Admin (מנהל)
```
Email: admin@proptradepro.com
Password: admin123
```
**גישה ל:**
- `/admin` - פאנל ניהול מלא
- ניהול משתמשים
- ניהול תוכניות
- אישור KYC
- ניהול תשלומים
- הגדרות מערכת

#### 🤝 Agent (סוכן)
```
Email: agent@proptradepro.com
Password: agent123
```
**גישה ל:**
- `/agent` - פאנל סוכן
- ניהול סוחרים
- מעקב עמלות
- דוחות ביצועים

#### 📊 Trader (סוחר)
```
Email: trader@proptradepro.com
Password: trader123
```
**גישה ל:**
- `/trader` - פאנל סוחר
- Dashboard אישי
- היסטוריית מסחר
- משיכות
- העלאת מסמכים

---

## 🚀 אופציה 2: יצירת חשבונות חדשים

### שלב 1: הרצת המערכת

#### Frontend בלבד (ללא Backend):
```bash
cd /home/ubuntu/PropTradePro/frontend
npm run dev
```
**כתובת:** http://localhost:5173

#### Frontend + Backend (מערכת מלאה):
```bash
cd /home/ubuntu/PropTradePro
docker-compose up -d
```
**כתובות:**
- Frontend: http://localhost:80
- Backend API: http://localhost:5000

---

### שלב 2: יצירת חשבון Admin (מנהל ראשון)

#### דרך 1: דרך ה-Database (מומלץ)

1. **התחבר ל-PostgreSQL:**
```bash
docker exec -it proptradepro-postgres psql -U postgres -d proptradepro_dev
```

2. **צור משתמש Admin:**
```sql
-- הצפנת סיסמה (דוגמה - צריך להשתמש ב-bcrypt בפועל)
INSERT INTO users (
    email, 
    password_hash, 
    first_name, 
    last_name, 
    role, 
    is_active, 
    is_verified,
    email_verified_at,
    kyc_status,
    created_at,
    updated_at
) VALUES (
    'admin@yourcompany.com',
    'scrypt:32768:8:1$...',  -- צריך להצפין עם bcrypt
    'Admin',
    'User',
    'admin',
    true,
    true,
    NOW(),
    'approved',
    NOW(),
    NOW()
);
```

3. **צא מ-PostgreSQL:**
```sql
\q
```

#### דרך 2: דרך Python Script

צור קובץ `create_admin.py`:

```python
import sys
sys.path.insert(0, '/home/ubuntu/PropTradePro/backend')

from src.database import db
from src.models.user import User
from src.app import create_app
from datetime import datetime

app = create_app()

with app.app_context():
    # בדוק אם Admin כבר קיים
    existing_admin = User.query.filter_by(email='admin@yourcompany.com').first()
    
    if existing_admin:
        print("Admin user already exists!")
    else:
        # צור Admin חדש
        admin = User(
            email='admin@yourcompany.com',
            first_name='Admin',
            last_name='User',
            role='admin',
            is_active=True,
            is_verified=True,
            email_verified_at=datetime.utcnow(),
            kyc_status='approved'
        )
        admin.set_password('YourSecurePassword123!')
        
        db.session.add(admin)
        db.session.commit()
        
        print(f"Admin user created successfully!")
        print(f"Email: {admin.email}")
        print(f"Role: {admin.role}")
```

הרץ את הסקריפט:
```bash
cd /home/ubuntu/PropTradePro/backend
python3 create_admin.py
```

---

### שלב 3: יצירת חשבון Agent (סוכן)

#### דרך ה-Admin Panel:

1. **התחבר כ-Admin**
2. **לך ל:** `/admin/users`
3. **לחץ על:** "Create User"
4. **מלא את הפרטים:**
   - Email: agent@example.com
   - Password: SecurePassword123!
   - First Name: Agent
   - Last Name: Name
   - **Role: agent** ⭐
   - Status: active
5. **שמור**

#### דרך ה-API:

```bash
curl -X POST http://localhost:5000/api/v1/admin/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "email": "agent@example.com",
    "password": "SecurePassword123!",
    "first_name": "Agent",
    "last_name": "Name",
    "role": "agent",
    "status": "active",
    "email_verified": true
  }'
```

---

### שלב 4: יצירת חשבון Trader (סוחר)

#### דרך הרשמה רגילה:

1. **לך ל:** `/register`
2. **מלא את הפרטים:**
   - Email
   - Password
   - First Name
   - Last Name
   - Phone (אופציונלי)
3. **לחץ:** "Sign Up"
4. **אמת אימייל** (אם נדרש)

**תפקיד ברירת מחדל:** `trader`

#### דרך ה-Admin Panel:

1. **התחבר כ-Admin**
2. **לך ל:** `/admin/users`
3. **לחץ על:** "Create User"
4. **מלא את הפרטים:**
   - Email: trader@example.com
   - Password: SecurePassword123!
   - First Name: Trader
   - Last Name: Name
   - **Role: trader** ⭐
   - Status: active
5. **שמור**

---

## 🔑 פרטי התחברות לפי סביבה

### Development (פיתוח)

#### Mock Data (ללא Backend):
```
Admin:  admin@proptradepro.com / admin123
Agent:  agent@proptradepro.com / agent123
Trader: trader@proptradepro.com / trader123
```

#### עם Backend (Docker):
- צור משתמשים דרך Database או Admin Panel
- השתמש באימיילים וסיסמאות שלך

---

### Production (פרודקשן)

⚠️ **חשוב מאוד!**

1. **אל תשתמש בסיסמאות ברירת מחדל!**
2. **צור Admin ראשון דרך Database**
3. **השתמש בסיסמאות חזקות:**
   - מינימום 8 תווים
   - אותיות גדולות וקטנות
   - מספרים
   - תווים מיוחדים

4. **הפעל 2FA (Two-Factor Authentication)**
5. **החלף את JWT_SECRET_KEY**

---

## 📋 טבלת תפקידים והרשאות

| תפקיד | דרג | גישה לדפים | הרשאות |
|-------|-----|-----------|---------|
| **Admin** | מנהל מערכת | `/admin/*` | כל ההרשאות |
| | | `/trader/*` | צפייה בכל המשתמשים |
| | | `/agent/*` | ניהול מלא |
| **Agent** | סוכן | `/agent/*` | ניהול סוחרים שלו |
| | | | מעקב עמלות |
| | | | דוחות |
| **Trader** | סוחר | `/trader/*` | ניהול חשבון אישי |
| | | | מסחר |
| | | | משיכות |

---

## 🛠️ פתרון בעיות (Troubleshooting)

### בעיה: לא מצליח להתחבר

**פתרון 1:** בדוק שהמערכת רצה
```bash
# Frontend
curl http://localhost:5173

# Backend
curl http://localhost:5000/health
```

**פתרון 2:** נקה Cache
```javascript
// בקונסול של הדפדפן
localStorage.clear()
location.reload()
```

**פתרון 3:** בדוק שהמשתמש קיים
```sql
-- בתוך PostgreSQL
SELECT email, role, is_active, is_verified FROM users;
```

---

### בעיה: "Invalid credentials"

**סיבות אפשריות:**
1. סיסמה שגויה
2. משתמש לא קיים
3. משתמש לא פעיל (`is_active = false`)
4. אימייל לא מאומת (`is_verified = false`)

**פתרון:**
```sql
-- בדוק סטטוס המשתמש
SELECT email, is_active, is_verified, role 
FROM users 
WHERE email = 'your@email.com';

-- אפשר משתמש
UPDATE users 
SET is_active = true, is_verified = true 
WHERE email = 'your@email.com';
```

---

### בעיה: "Insufficient permissions"

**סיבה:** התפקיד לא מתאים לדף

**פתרון:**
```sql
-- שנה תפקיד
UPDATE users 
SET role = 'admin'  -- או 'agent' או 'trader'
WHERE email = 'your@email.com';
```

---

### בעיה: Backend לא מגיב

**בדוק Docker:**
```bash
docker ps
docker logs proptradepro-backend
```

**הפעל מחדש:**
```bash
docker-compose restart backend
```

---

## 🔐 אבטחה - Security Best Practices

### 1. סיסמאות חזקות
```
❌ לא טוב: admin123
✅ טוב: Adm!n$ecur3P@ss2024
```

### 2. JWT Secret
```bash
# ב-.env
JWT_SECRET_KEY=your-very-long-random-secret-key-here-change-in-production
```

### 3. Two-Factor Authentication (2FA)

**הפעלה:**
1. התחבר למערכת
2. לך ל-Profile → Security
3. לחץ "Enable 2FA"
4. סרוק QR code עם Google Authenticator
5. הזן קוד לאימות

---

## 📱 גישה ממכשירים שונים

### Desktop (מחשב)
```
http://localhost:5173  (Development)
http://localhost:80    (Docker)
https://yourdomain.com (Production)
```

### Mobile (נייד)
- אותה כתובת
- העיצוב רספונסיבי ומתאים לנייד

### Tablet (טאבלט)
- אותה כתובת
- ממשק מותאם

---

## 🎯 תרחישי שימוש נפוצים

### תרחיש 1: מנהל חדש מתחיל לעבוד

1. ✅ צור משתמש Admin דרך Database
2. ✅ התחבר עם האימייל והסיסמה
3. ✅ לך ל-`/admin`
4. ✅ צור משתמשים נוספים
5. ✅ הגדר תוכניות מסחר
6. ✅ אשר KYC של סוחרים

### תרחיש 2: סוכן מצטרף למערכת

1. ✅ Admin יוצר חשבון Agent
2. ✅ Agent מקבל אימייל עם פרטי התחברות
3. ✅ Agent מתחבר ב-`/login`
4. ✅ מועבר אוטומטית ל-`/agent`
5. ✅ רואה את הסוחרים שלו
6. ✅ עוקב אחרי עמלות

### תרחיש 3: סוחר נרשם

1. ✅ סוחר נרשם ב-`/register`
2. ✅ מאמת אימייל
3. ✅ מתחבר ב-`/login`
4. ✅ מועבר ל-`/trader`
5. ✅ מעלה מסמכי KYC
6. ✅ ממתין לאישור
7. ✅ רוכש תוכנית
8. ✅ מתחיל לסחור

---

## 📞 עזרה נוספת

### לוגים (Logs)

**Frontend:**
```bash
# בקונסול של הדפדפן (F12)
# רואים שגיאות JavaScript
```

**Backend:**
```bash
# Docker logs
docker logs proptradepro-backend

# או בזמן אמת
docker logs -f proptradepro-backend
```

**Database:**
```bash
docker logs proptradepro-postgres
```

---

## 🎉 סיכום מהיר

### התחברות מהירה (Development):
```
Admin:  http://localhost:5173/login
        admin@proptradepro.com / admin123

Agent:  http://localhost:5173/login
        agent@proptradepro.com / agent123

Trader: http://localhost:5173/login
        trader@proptradepro.com / trader123
```

### יצירת Admin ראשון (Production):
```bash
# התחבר ל-Database
docker exec -it proptradepro-postgres psql -U postgres -d proptradepro_dev

# צור Admin
INSERT INTO users (email, password_hash, first_name, last_name, role, is_active, is_verified, created_at, updated_at)
VALUES ('admin@yourcompany.com', 'HASHED_PASSWORD', 'Admin', 'User', 'admin', true, true, NOW(), NOW());
```

### שינוי תפקיד:
```sql
UPDATE users SET role = 'admin' WHERE email = 'user@example.com';
UPDATE users SET role = 'agent' WHERE email = 'user@example.com';
UPDATE users SET role = 'trader' WHERE email = 'user@example.com';
```

---

**מדריך נוצר ב:** 18 אוקטובר 2024  
**גרסה:** 1.0  
**סטטוס:** ✅ מוכן לשימוש

