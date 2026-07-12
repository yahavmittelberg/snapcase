# SnapCase - חנות תליוני טלפון 📱✨

חנות אונליין בעברית למכירת תליוני טלפון.

## 🚀 העלאה ל-Vercel (חינם)

### שלב 1: צור חשבון GitHub
1. לך ל-[github.com](https://github.com)
2. לחץ "Sign up" וצור חשבון

### שלב 2: העלה את הקוד ל-GitHub
1. לחץ על "+" בפינה הימנית העליונה
2. בחר "New repository"
3. שם: `snapcase` (או כל שם אחר)
4. לחץ "Create repository"
5. גרור את כל הקבצים לתוך הדף

### שלב 3: התחבר ל-Vercel
1. לך ל-[vercel.com](https://vercel.com)
2. לחץ "Continue with GitHub"
3. לחץ "Add New Project"
4. בחר את ה-repository שיצרת

### שלב 4: הגדר Environment Variables
בדף ההגדרות של Vercel, הוסף:

```
DATABASE_URL = postgresql://neondb_owner:npg_ycwIkt0NbH4p@ep-billowing-glitter-atzvukn8.c-9.us-east-1.aws.neon.tech/neondb?sslmode=require
```

### שלב 5: Deploy!
לחץ "Deploy" ותקבל כתובת כמו: `snapcase.vercel.app`

---

## 💳 הוספת תשלומים (PayPal)

1. צור חשבון PayPal Business: [paypal.com/il/business](https://www.paypal.com/il/business)
2. קבל API keys מ-[developer.paypal.com](https://developer.paypal.com)
3. הוסף ב-Vercel:
   ```
   PAYPAL_CLIENT_ID = xxxxx
   PAYPAL_SECRET = xxxxx
   ```

---

## 📁 מבנה הפרויקט

```
src/
├── app/           # דפים
├── components/    # קומפוננטות
├── context/       # Cart context
├── db/            # מסד נתונים
└── lib/           # תרגומים
public/
└── images/        # תמונות מוצרים
```

---

## 🛠️ פיתוח מקומי

```bash
npm install
npm run dev
```

פתח http://localhost:3000

---

## 📞 תמיכה

נבנה עם ❤️ באמצעות Next.js, Tailwind CSS, ו-Drizzle ORM.
