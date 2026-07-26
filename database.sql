-- =========================================================
-- EduSphere E-Learning Platform - Database Schema
-- Import this file in phpMyAdmin OR run:
--   mysql -u root -p < database.sql
-- =========================================================

CREATE DATABASE IF NOT EXISTS elearning_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE elearning_db;

-- ---------------------------------------------------------
-- USERS  (students, teachers, admins)
-- ---------------------------------------------------------
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('student','teacher','admin') NOT NULL DEFAULT 'student',
    avatar VARCHAR(255) DEFAULT NULL,
    bio VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ---------------------------------------------------------
-- COURSES
-- ---------------------------------------------------------
CREATE TABLE courses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    category VARCHAR(80) NOT NULL,
    teacher_id INT NOT NULL,
    thumbnail VARCHAR(20) DEFAULT '📘',
    level ENUM('Beginner','Intermediate','Advanced') DEFAULT 'Beginner',
    duration VARCHAR(50) DEFAULT NULL,
    price DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------
-- LESSONS / CLASSES  (each course has multiple lessons)
-- ---------------------------------------------------------
CREATE TABLE lessons (
    id INT AUTO_INCREMENT PRIMARY KEY,
    course_id INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    content TEXT,
    video_url VARCHAR(255) DEFAULT NULL,
    order_no INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------
-- ENROLLMENTS
-- ---------------------------------------------------------
CREATE TABLE enrollments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    course_id INT NOT NULL,
    progress INT DEFAULT 0,
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_enrollment (student_id, course_id),
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------
-- NOTES  (students can save notes per lesson / course)
-- ---------------------------------------------------------
CREATE TABLE notes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    course_id INT DEFAULT NULL,
    lesson_id INT DEFAULT NULL,
    title VARCHAR(150) NOT NULL,
    content TEXT,
    is_important TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE SET NULL,
    FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- =========================================================
-- SAMPLE DATA
-- =========================================================

-- Password for ALL sample accounts below is:  123456
-- (bcrypt hash, verifiable with PHP's password_verify())
INSERT INTO users (name, email, password, role) VALUES
('Admin User', 'admin@edusphere.com', '$2b$10$gVH9GZKvwFbsymeGUXKJIudTtEZvBrroVbFsW.ZdGHjws1SwboaFa', 'admin'),
('Rafiul Islam', 'teacher1@edusphere.com', '$2b$10$gVH9GZKvwFbsymeGUXKJIudTtEZvBrroVbFsW.ZdGHjws1SwboaFa', 'teacher'),
('Nusrat Jahan', 'teacher2@edusphere.com', '$2b$10$gVH9GZKvwFbsymeGUXKJIudTtEZvBrroVbFsW.ZdGHjws1SwboaFa', 'teacher'),
('Tanvir Ahmed', 'student@edusphere.com', '$2b$10$gVH9GZKvwFbsymeGUXKJIudTtEZvBrroVbFsW.ZdGHjws1SwboaFa', 'student');

-- Courses (teacher_id 2 = Rafiul, 3 = Nusrat)
INSERT INTO courses (title, description, category, teacher_id, thumbnail, level, duration) VALUES
('Complete Web Development Bootcamp', 'Learn full-stack web development from scratch with HTML, CSS, JavaScript, PHP and MySQL.', 'Web Development', 2, '💻', 'Beginner', '10 weeks'),
('Modern JavaScript & React', 'Learn ES6+, the DOM, async/await, and build interactive web apps with React.', 'Web Development', 2, '⚛️', 'Intermediate', '8 weeks'),
('Python for Data Science', 'Data analysis and visualization with Pandas, NumPy, and Matplotlib.', 'Data Science', 3, '📊', 'Beginner', '6 weeks'),
('UI/UX Design Fundamentals', 'Learn user-centered design, wireframing, and prototyping with Figma.', 'Design', 3, '🎨', 'Beginner', '5 weeks'),
('Digital Marketing Mastery', 'Hands-on SEO, social media marketing, and content strategy.', 'Business', 2, '📈', 'Beginner', '4 weeks'),
('Advanced PHP & MySQL', 'Object-oriented PHP, PDO, API development, and secure authentication.', 'Web Development', 3, '🐘', 'Advanced', '7 weeks');

-- Lessons for course 1 (Web Development Bootcamp)
INSERT INTO lessons (course_id, title, content, video_url, order_no) VALUES
(1, 'Getting Started with HTML', 'HTML5 tags, semantic structure, and building your first basic page.', 'https://www.youtube.com/watch?v=916GWv2Qs08', 1),
(1, 'Styling with CSS', 'Flexbox, Grid, and the basics of responsive design.', 'https://www.youtube.com/watch?v=K1naz9wBwKU', 2),
(1, 'JavaScript Basics', 'Variables, functions, loops, and DOM manipulation.', 'https://www.youtube.com/watch?v=PkZNo7MFNFg', 3),
(1, 'Backend with PHP', 'PHP syntax, form handling, and connecting to MySQL.', 'https://www.youtube.com/watch?v=btoVIlr7rAQ', 4);

-- Lessons for course 2 (React)
INSERT INTO lessons (course_id, title, content, video_url, order_no) VALUES
(2, 'ES6+ Essentials', 'Arrow functions, destructuring, and the spread/rest operators.', 'https://www.youtube.com/watch?v=PkZNo7MFNFg', 1),
(2, 'React Components', 'Functional components, props, and JSX.', 'https://www.youtube.com/watch?v=P5p3vMeJ6LQ', 2),
(2, 'React Hooks', 'Managing state and side effects with useState and useEffect.', 'https://www.youtube.com/watch?v=P5p3vMeJ6LQ', 3);

-- Lessons for course 3 (Python)
INSERT INTO lessons (course_id, title, content, video_url, order_no) VALUES
(3, 'Python Basics', 'Variables, data types, lists, and dictionaries.', 'https://www.youtube.com/watch?v=_8TJF8DD3bw', 1),
(3, 'Data Analysis with Pandas', 'Creating DataFrames, filtering, and grouping data.', 'https://www.youtube.com/watch?v=_8TJF8DD3bw', 2),
(3, 'Data Visualization', 'Building charts and graphs with Matplotlib.', 'https://www.youtube.com/watch?v=_8TJF8DD3bw', 3);

-- Lessons for course 4 (UI/UX)
INSERT INTO lessons (course_id, title, content, video_url, order_no) VALUES
(4, 'Design Thinking', 'User research and building personas.', 'https://www.youtube.com/watch?v=jwCmIBJ8Jtc', 1),
(4, 'Wireframing', 'Creating low-fidelity wireframes.', 'https://www.youtube.com/watch?v=jwCmIBJ8Jtc', 2);

-- Lessons for course 5 (Digital Marketing)
INSERT INTO lessons (course_id, title, content, video_url, order_no) VALUES
(5, 'SEO Fundamentals', 'Keyword research and on-page SEO.', 'https://www.youtube.com/watch?v=-0XqkDNkQHU', 1),
(5, 'Social Media Strategy', 'Content calendars and audience engagement.', 'https://www.youtube.com/watch?v=oG6HXDpsu9o', 2);

-- Lessons for course 6 (Advanced PHP)
INSERT INTO lessons (course_id, title, content, video_url, order_no) VALUES
(6, 'OOP PHP', 'Classes, objects, and inheritance.', 'https://www.youtube.com/watch?v=btoVIlr7rAQ', 1),
(6, 'PDO & Prepared Statements', 'Writing secure database queries.', 'https://www.youtube.com/watch?v=btoVIlr7rAQ', 2),
(6, 'Building a REST API', 'Building API endpoints that return JSON.', 'https://www.youtube.com/watch?v=btoVIlr7rAQ', 3);

-- Sample enrollment for the demo student (Tanvir, id 4) in course 1
INSERT INTO enrollments (student_id, course_id, progress) VALUES (4, 1, 40);

-- Sample note for the demo student
INSERT INTO notes (student_id, course_id, title, content, is_important) VALUES
(4, 1, 'CSS Flexbox tips to remember', 'justify-content controls horizontal alignment, align-items controls vertical alignment. Setting flex-direction: column flips the axis.', 1);
