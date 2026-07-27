# EduSphere — Full-Stack E-Learning Platform

**Stack:** HTML, CSS, JavaScript (Frontend) + PHP (Backend, Session Auth) + MySQL (Database)

##  File structure


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

##  Core features

- Secure authentication— passwords hashed with `password_hash()`/`password_verify()`, login state via PHP sessions
- Role-based access — Student / Teacher / Admin
- Course enrollment — one-click enroll, progress tracking
- Search & filter — real-time search by name or category
- Video lectures — YouTube/Vimeo links embedded per lesson
- Note-taking — save notes directly from any lesson, mark important ones with 
- Responsive design — works on desktop, tablet, and mobile
- Animations — smooth scroll-reveal, hover effects, animated progress bars, toast notifications



  ## deployment link:
  
  https://edusphereonline.free.nf

  ## Author: Iffat Ara Nowshin


