# הוראות פריסה - מערכת אישורי תשלומים

## שלב 1: התחברות לשרת

```bash
ssh root@146.190.21.113
```

## שלב 2: משיכת הקוד החדש מ-GitHub

```bash
cd /root/PropTradePro
git pull origin master
```

## שלב 3: הרצת מיגרציית מסד הנתונים

```bash
PGPASSWORD='<YOUR_DB_PASSWORD>' psql \
  -h <YOUR_DB_HOST> \
  -p <YOUR_DB_PORT> \
  -U <YOUR_DB_USER> \
  -d <YOUR_DB_NAME> \
  -f /root/PropTradePro/backend/migrations/add_payment_approval_system.sql
```

**הערה:** החלף את הערכים בסוגריים עם פרטי החיבור שלך למסד הנתונים.

**הערה:** המיגרציה כבר הורצה במסד הנתונים, אז אם תקבל שגיאות על טבלאות/עמודות קיימות - זה תקין.

## שלב 4: הפעלה מחדש של Backend

```bash
cd /root/PropTradePro/backend

# עצירת תהליכים קיימים
pkill -f "python.*app.py" || true
sleep 2

# הפעלת Backend מחדש
PYTHONPATH=/root/PropTradePro/backend nohup python3 src/app.py > /tmp/backend.log 2>&1 &
sleep 3

# בדיקה שהשרת עובד
curl http://localhost:5000/health
```

אמור להחזיר:
```json
{
  "service": "MarketEdgePros API",
  "status": "healthy",
  "version": "1.0.0"
}
```

## שלב 5: בנייה ופריסה של Frontend

```bash
cd /root/PropTradePro/frontend

# בנייה
npm run build

# פריסה
rm -rf /var/www/marketedgepros/*
cp -r /root/PropTradePro/frontend/dist/* /var/www/marketedgepros/
chown -R www-data:www-data /var/www/marketedgepros
```

## שלב 6: טעינה מחדש של Nginx

```bash
nginx -t
systemctl reload nginx
```

## שלב 7: בדיקת הפריסה

```bash
# בדיקת Backend
curl http://localhost:5000/ | grep payment_approvals

# בדיקת Frontend
ls -la /var/www/marketedgepros/index.html
```

## אלטרנטיבה: שימוש בסקריפט האוטומטי

אם אתה רוצה להריץ הכל בפקודה אחת:

```bash
cd /root/PropTradePro
bash deploy_payment_approval_system.sh
```

**שים לב:** הסקריפט ידלג על מיגרציית מסד הנתונים, אז תצטרך להריץ אותה ידנית (שלב 3).

## בדיקת הפונקציונליות

1. היכנס ל-https://marketedgepros.com/admin
2. התחבר כ-Super Admin (תפקיד: `supermaster`)
3. בתפריט הצד, אמור להופיע "Payment Approvals"
4. לחץ עליו ותראה את עמוד ניהול אישורי התשלומים

## Endpoints חדשים

- `GET /api/v1/payment-approvals/pending` - בקשות ממתינות
- `GET /api/v1/payment-approvals/my-requests` - הבקשות שלי
- `POST /api/v1/payment-approvals/create` - יצירת בקשה
- `POST /api/v1/payment-approvals/:id/approve` - אישור
- `POST /api/v1/payment-approvals/:id/reject` - דחייה
- `GET /api/v1/payment-approvals/stats` - סטטיסטיקות

## פתרון בעיות

### Backend לא עולה

```bash
tail -50 /tmp/backend.log
```

### Frontend לא מוצג

```bash
ls -la /var/www/marketedgepros/
nginx -t
systemctl status nginx
```

### בעיות במסד נתונים

```bash
PGPASSWORD='<YOUR_DB_PASSWORD>' psql \
  -h <YOUR_DB_HOST> \
  -p <YOUR_DB_PORT> \
  -U <YOUR_DB_USER> \
  -d <YOUR_DB_NAME> \
  -c "SELECT * FROM payment_approval_requests LIMIT 1;"
```

