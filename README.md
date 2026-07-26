# EduSphere — Full-Stack E-Learning Platform

**Stack:** HTML, CSS, JavaScript (Frontend) + PHP (Backend, Session Auth) + MySQL (Database)

---

## 📁 File structure

```
elearning-platform/
├── database.sql              # Database schema + sample data (courses, lessons, videos)
├── config/
│   └── db.php                 # Database connection
├── includes/
│   └── functions.php          # Shared helpers (session, JSON response)
├── api/
│   ├── register.php           # Registration
│   ├── login.php               # Login
│   ├── logout.php              # Logout
│   ├── me.php                  # Current user info
│   ├── courses.php             # List / search / create courses
│   ├── lessons.php             # List / add lessons (incl. video_url)
│   ├── enroll.php              # Course enrollment
│   └── notes.php               # Notes CRUD
├── css/style.css              # Full stylesheet + animations
├── js/                         # main.js, auth.js, courses.js, course-detail.js, dashboard.js, notes.js
├── index.html                  # Landing page
├── login.html / register.html  # Auth pages
├── dashboard.html               # Student dashboard
├── courses.html                 # Browse / search courses
├── course-detail.html           # Course details + lessons + video player + enroll
└── notes.html                   # Notes management page
```

---

## ⚙️ Setup (XAMPP / WAMP — easiest way)

### 1) Install XAMPP
Download and install XAMPP (Apache + MySQL + PHP) from [https://www.apachefriends.org](https://www.apachefriends.org).

### 2) Copy the project folder
Copy the whole `elearning-platform` folder into XAMPP's `htdocs` folder:
- Windows: `C:\xampp\htdocs\elearning-platform`
- macOS: `/Applications/XAMPP/htdocs/elearning-platform`
- Linux: `/opt/lampp/htdocs/elearning-platform`

### 3) Start Apache and MySQL
Open the XAMPP Control Panel and click **Start** next to **Apache** and **MySQL**.

### 4) Create the database
1. Go to `http://localhost/phpmyadmin`
2. Click the **Import** tab
3. Select `database.sql` and click **Go**
4. This auto-creates the `elearning_db` database, all tables, and sample courses/lessons/users (with videos already attached)

> If you already have an older `elearning_db` from a previous version, drop it first (right-click the database → Drop) before importing, so you get the fresh English content + video links.

> `config/db.php` defaults (`host: localhost`, `user: root`, `password: ""`) already work with XAMPP. Only change these for a live server or different setup.

### 5) IMPORTANT — don't use Live Server / VS Code preview
This project **must** run through Apache (PHP), not a static file server like VS Code's "Live Server" (port 5500). Live Server can't execute PHP, so login/register will always fail with "Couldn't connect to server."

Correct URL:
```
http://localhost/elearning-platform/index.html
```
Wrong (won't work):
```
http://127.0.0.1:5500/elearning-platform/index.html
```

### 6) Log in with a demo account
Password for every account: **`123456`**

| Role | Email |
|---|---|
| Student | student@edusphere.com |
| Teacher | teacher1@edusphere.com |
| Teacher | teacher2@edusphere.com |
| Admin | admin@edusphere.com |

Or create your own account from `register.html` (as a student or teacher).

---

## ➕ How to add new courses and lessons

**Teacher** accounts can add lessons directly from the site UI.

### Add a new course — 2 ways:

**Option 1 — Directly via phpMyAdmin (fastest, good for demos)**
1. Go to `http://localhost/phpmyadmin` → `elearning_db` → `courses` table
2. Click **Insert** and fill in a new row:
   - `title`: course name
   - `description`: details
   - `category`: e.g. `Web Development`, `Design`
   - `teacher_id`: which teacher (id from the `users` table, e.g. `2`)
   - `thumbnail`: an emoji, e.g. `📘`
   - `level`: `Beginner` / `Intermediate` / `Advanced`
3. Click **Go** — the course shows up on the site immediately, no code changes needed.

**Option 2 — Via the API** (while logged in as a teacher)
`api/courses.php` accepts a POST request to create a course. (You could add a "Create Course" form page later — currently the site's teacher UI covers **adding lessons** to an existing course.)

### Add a class (lesson) — from the site:
1. Log in as a **teacher** (e.g. teacher1@edusphere.com)
2. Open one of your courses from `courses.html`
3. Scroll to the **"➕ Add a new lesson"** form (only visible to the course's own teacher/admin)
4. Fill in the lesson title, details, and (optional) a video link — then click **"Add lesson"**
5. The new lesson appears instantly in the lesson list

---

## 🎥 Video lectures

Every sample lesson already has a `video_url` filled in — open any course, click **▶ Watch** next to a lesson, and it plays in a popup video player. Both YouTube and Vimeo links are auto-converted to embeddable form.

⚠️ **Note:** most sample video IDs are well-known free tutorials (freeCodeCamp, etc.) recalled from memory rather than individually re-verified — a couple may point to the wrong clip or occasionally go offline. Swap any of them out any time:
```sql
UPDATE lessons SET video_url = 'https://www.youtube.com/watch?v=YOUR_ID' WHERE id = 1;
```
Or, as a teacher, use the **"➕ Add a new lesson"** form to paste your own video link directly — no SQL needed.

---

## 🧩 Core features

- ✅ **Secure authentication** — passwords hashed with `password_hash()`/`password_verify()`, login state via PHP sessions
- ✅ **Role-based access** — Student / Teacher / Admin
- ✅ **Course enrollment** — one-click enroll, progress tracking
- ✅ **Search & filter** — real-time search by name or category
- ✅ **Video lectures** — YouTube/Vimeo links embedded per lesson
- ✅ **Note-taking** — save notes directly from any lesson, mark important ones with ⭐
- ✅ **Responsive design** — works on desktop, tablet, and mobile
- ✅ **Animations** — smooth scroll-reveal, hover effects, animated progress bars, toast notifications

## 🔒 Security notes

- All database queries use **prepared statements (PDO)** — protected against SQL injection
- Passwords are never stored in plain text
- Every sensitive API endpoint (`notes.php`, `enroll.php`, etc.) checks the session before responding

## 🚀 Possible next steps

- A dedicated "Create Course" frontend form (currently done via phpMyAdmin/API)
- Payment gateway integration
- Quizzes and certificates
