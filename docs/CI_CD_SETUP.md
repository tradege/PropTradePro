# CI/CD Automation Setup - MarketEdgePros

## סקירה כללית

מערכת ה-CI/CD מאפשרת deployment אוטומטי של הפלטפורמה MarketEdgePros לשרת DigitalOcean בכל פעם שמתבצע push ל-GitHub.

## רכיבי המערכת

### 1. GitHub Actions Workflow
**מיקום:** `.github/workflows/deploy.yml`

הקובץ מגדיר תהליך אוטומטי שרץ בכל push ל-branches: `main` או `master`

### 2. GitHub Secrets
שלושה secrets נדרשים בהגדרות הריפוזיטורי:

| Secret Name | Value | תיאור |
|------------|-------|-------|
| `DO_HOST` | `146.190.21.113` | כתובת IP של שרת DigitalOcean |
| `DO_USERNAME` | `root` | שם משתמש לשרת |
| `DO_PASSWORD` | `dRagonbol1@g` | סיסמת השרת |

### 3. תהליך ה-Deployment

כאשר מתבצע push ל-GitHub, המערכת:

1. **מתחברת לשרת** - דרך SSH עם הפרטים מ-Secrets
2. **מושכת את הקוד החדש** - `git pull` מ-GitHub
3. **Backend Deployment:**
   - מתקינה dependencies: `pip3 install -r requirements.txt`
   - מפעילה מחדש את השירות: `systemctl restart marketedgepros-backend`
4. **Frontend Deployment:**
   - מתקינה packages: `npm install`
   - בונה את הפרויקט: `npm run build`
   - מפעילה מחדש את השירות: `systemctl restart marketedgepros-frontend`
5. **מפעילה מחדש את Nginx** - לעדכון התצורה

## איך להשתמש

### Deployment אוטומטי

פשוט תעשה push לריפוזיטורי:

```bash
git add .
git commit -m "Your commit message"
git push origin master
```

המערכת תזהה את ה-push ותתחיל deployment אוטומטית.

### מעקב אחר Deployment

1. לך ל-GitHub repository
2. לחץ על טאב **"Actions"**
3. תראה את כל ה-workflows שרצים/רצו
4. לחץ על workflow ספציפי לראות לוגים מפורטים

## פתרון בעיות

### Deployment נכשל

1. בדוק את הלוגים ב-GitHub Actions
2. וודא שהשירותים רצים על השרת:
   ```bash
   ssh root@146.190.21.113
   systemctl status marketedgepros-backend
   systemctl status marketedgepros-frontend
   systemctl status nginx
   ```

### בעיות חיבור לשרת

1. וודא ש-Secrets מוגדרים נכון ב-GitHub
2. בדוק שהשרת זמין:
   ```bash
   ping 146.190.21.113
   ```

### בעיות עם הקוד

1. בדוק שהקוד עובד locally לפני push
2. וודא שכל ה-dependencies מוגדרים ב-`requirements.txt` ו-`package.json`

## מידע טכני

**שרת DigitalOcean:**
- IP: 146.190.21.113
- מיקום הפרויקט: `/root/MarketEdgePros`
- Backend Port: 5000
- Frontend Port: 3000

**דומיין:**
- https://marketedgepros.com
- https://www.marketedgepros.com

**שירותים:**
- `marketedgepros-backend.service`
- `marketedgepros-frontend.service`
- `nginx.service`

## אבטחה

⚠️ **חשוב:** 
- אל תשתף את ה-Secrets עם אף אחד
- אל תעשה commit של סיסמאות או מפתחות לקוד
- השתמש תמיד ב-GitHub Secrets למידע רגיש

## תחזוקה

### עדכון Secrets

אם צריך לשנות סיסמה או פרטי חיבור:

1. לך ל: `Settings` → `Secrets and variables` → `Actions`
2. לחץ על העיפרון ליד ה-Secret
3. עדכן את הערך
4. שמור

### עדכון Workflow

לעדכן את תהליך ה-deployment:

1. ערוך את `.github/workflows/deploy.yml`
2. עשה commit ו-push
3. ה-workflow החדש יתחיל לעבוד מיד

---

**תאריך יצירה:** 22 אוקטובר 2025
**גרסה:** 1.0
**סטטוס:** פעיל ✅

