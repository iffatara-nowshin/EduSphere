-- =========================================================
-- RUN THIS if you already have data in your database and
-- don't want to lose your enrollments/notes/users.
-- Fixes: English text + replaces EVERY video with a
-- verified, currently-live video (checked via live search,
-- not guessed from memory this time).
--
-- Paste into phpMyAdmin -> elearning_db -> SQL tab -> Go
-- =========================================================

-- ---------- COURSES: translate title/description ----------
UPDATE courses SET
  title = 'Complete Web Development Bootcamp',
  description = 'Learn full-stack web development from scratch with HTML, CSS, JavaScript, PHP and MySQL.'
WHERE id = 1;

UPDATE courses SET
  title = 'Modern JavaScript & React',
  description = 'Build interactive web apps with ES6+, the DOM, async/await, and React.'
WHERE id = 2;

UPDATE courses SET
  title = 'Python for Data Science',
  description = 'Data analysis and visualization with Pandas, NumPy and Matplotlib.'
WHERE id = 3;

UPDATE courses SET
  title = 'UI/UX Design Fundamentals',
  description = 'Learn user-centered design, wireframing and prototyping with Figma.'
WHERE id = 4;

UPDATE courses SET
  title = 'Digital Marketing Mastery',
  description = 'Hands-on training in SEO, social media marketing, and content strategy.'
WHERE id = 5;

UPDATE courses SET
  title = 'Advanced PHP & MySQL',
  description = 'Build secure authentication and REST APIs with OOP PHP and PDO.'
WHERE id = 6;

-- ---------- LESSONS: translate title/content + verified video_url ----------

-- Course 1: Complete Web Development Bootcamp
UPDATE lessons SET title = 'Getting Started with HTML',
  content = 'HTML5 tags, semantic structure, and building your first basic page.',
  video_url = 'https://www.youtube.com/watch?v=916GWv2Qs08' WHERE id = 1;
UPDATE lessons SET title = 'Styling with CSS',
  content = 'Flexbox, Grid, and the basics of responsive design.',
  video_url = 'https://www.youtube.com/watch?v=K1naz9wBwKU' WHERE id = 2;
UPDATE lessons SET title = 'JavaScript Basics',
  content = 'Variables, functions, loops, and DOM manipulation.',
  video_url = 'https://www.youtube.com/watch?v=PkZNo7MFNFg' WHERE id = 3;
UPDATE lessons SET title = 'Backend with PHP',
  content = 'PHP syntax, form handling, and connecting to MySQL.',
  video_url = 'https://www.youtube.com/watch?v=btoVIlr7rAQ' WHERE id = 4;

-- Course 2: Modern JavaScript & React
UPDATE lessons SET title = 'ES6+ Essentials',
  content = 'Arrow functions, destructuring, and the spread/rest operators.',
  video_url = 'https://www.youtube.com/watch?v=PkZNo7MFNFg' WHERE id = 5;
UPDATE lessons SET title = 'React Components',
  content = 'Functional components, props, and JSX.',
  video_url = 'https://www.youtube.com/watch?v=P5p3vMeJ6LQ' WHERE id = 6;
UPDATE lessons SET title = 'React Hooks',
  content = 'Managing state and side effects with useState and useEffect.',
  video_url = 'https://www.youtube.com/watch?v=P5p3vMeJ6LQ' WHERE id = 7;

-- Course 3: Python for Data Science
UPDATE lessons SET title = 'Python Basics',
  content = 'Variables, data types, lists, and dictionaries.',
  video_url = 'https://www.youtube.com/watch?v=_8TJF8DD3bw' WHERE id = 8;
UPDATE lessons SET title = 'Data Analysis with Pandas',
  content = 'Creating DataFrames, filtering, and grouping data.',
  video_url = 'https://www.youtube.com/watch?v=_8TJF8DD3bw' WHERE id = 9;
UPDATE lessons SET title = 'Data Visualization',
  content = 'Building charts and graphs with Matplotlib.',
  video_url = 'https://www.youtube.com/watch?v=_8TJF8DD3bw' WHERE id = 10;

-- Course 4: UI/UX Design Fundamentals
UPDATE lessons SET title = 'Design Thinking',
  content = 'User research and building personas.',
  video_url = 'https://www.youtube.com/watch?v=jwCmIBJ8Jtc' WHERE id = 11;
UPDATE lessons SET title = 'Wireframing',
  content = 'Creating low-fidelity wireframes.',
  video_url = 'https://www.youtube.com/watch?v=jwCmIBJ8Jtc' WHERE id = 12;

-- Course 5: Digital Marketing Mastery
UPDATE lessons SET title = 'SEO Fundamentals',
  content = 'Keyword research and on-page SEO.',
  video_url = 'https://www.youtube.com/watch?v=-0XqkDNkQHU' WHERE id = 13;
UPDATE lessons SET title = 'Social Media Strategy',
  content = 'Content calendars and audience engagement.',
  video_url = 'https://www.youtube.com/watch?v=oG6HXDpsu9o' WHERE id = 14;

-- Course 6: Advanced PHP & MySQL
UPDATE lessons SET title = 'OOP PHP',
  content = 'Classes, objects, and inheritance.',
  video_url = 'https://www.youtube.com/watch?v=btoVIlr7rAQ' WHERE id = 15;
UPDATE lessons SET title = 'PDO & Prepared Statements',
  content = 'Writing secure database queries.',
  video_url = 'https://www.youtube.com/watch?v=btoVIlr7rAQ' WHERE id = 16;
UPDATE lessons SET title = 'Building a REST API',
  content = 'Creating API endpoints with JSON responses.',
  video_url = 'https://www.youtube.com/watch?v=btoVIlr7rAQ' WHERE id = 17;
