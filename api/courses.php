<?php
require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../includes/functions.php';

$method = $_SERVER['REQUEST_METHOD'];

// ---------- GET: list courses (with search/category filter) OR single course ----------
if ($method === 'GET') {

    // Single course detail
    if (!empty($_GET['id'])) {
        $stmt = $pdo->prepare("
            SELECT c.*, u.name AS teacher_name
            FROM courses c JOIN users u ON u.id = c.teacher_id
            WHERE c.id = ?
        ");
        $stmt->execute([$_GET['id']]);
        $course = $stmt->fetch();
        if (!$course) respond(false, [], "Course not found.", 404);

        $lessonsStmt = $pdo->prepare("SELECT * FROM lessons WHERE course_id = ? ORDER BY order_no ASC");
        $lessonsStmt->execute([$_GET['id']]);
        $course['lessons'] = $lessonsStmt->fetchAll();

        $countStmt = $pdo->prepare("SELECT COUNT(*) AS c FROM enrollments WHERE course_id = ?");
        $countStmt->execute([$_GET['id']]);
        $course['students_count'] = (int)$countStmt->fetch()['c'];

        // is current student enrolled?
        $course['is_enrolled'] = false;
        if (!empty($_SESSION['user_id'])) {
            $enStmt = $pdo->prepare("SELECT id FROM enrollments WHERE student_id=? AND course_id=?");
            $enStmt->execute([$_SESSION['user_id'], $_GET['id']]);
            $course['is_enrolled'] = (bool)$enStmt->fetch();
        }

        respond(true, ["course" => $course]);
    }

    // List + search + category filter
    $search   = trim($_GET['search'] ?? '');
    $category = trim($_GET['category'] ?? '');

    $sql = "SELECT c.*, u.name AS teacher_name,
                   (SELECT COUNT(*) FROM enrollments e WHERE e.course_id = c.id) AS students_count,
                   (SELECT COUNT(*) FROM lessons l WHERE l.course_id = c.id) AS lessons_count
            FROM courses c JOIN users u ON u.id = c.teacher_id
            WHERE 1=1";
    $params = [];

    if ($search !== '') {
        $sql .= " AND (c.title LIKE ? OR c.description LIKE ?)";
        $params[] = "%$search%";
        $params[] = "%$search%";
    }
    if ($category !== '' && $category !== 'All') {
        $sql .= " AND c.category = ?";
        $params[] = $category;
    }
    $sql .= " ORDER BY c.created_at DESC";

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $courses = $stmt->fetchAll();

    $catStmt = $pdo->query("SELECT DISTINCT category FROM courses ORDER BY category");
    $categories = array_column($catStmt->fetchAll(), 'category');

    respond(true, ["courses" => $courses, "categories" => $categories]);
}

// ---------- POST: create a new course (teacher/admin only) ----------
if ($method === 'POST') {
    requireRole(['teacher', 'admin']);
    $input = getJsonInput();

    $title       = trim($input['title'] ?? '');
    $description = trim($input['description'] ?? '');
    $category    = trim($input['category'] ?? '');
    $level       = in_array($input['level'] ?? '', ['Beginner','Intermediate','Advanced']) ? $input['level'] : 'Beginner';
    $duration    = trim($input['duration'] ?? '');
    $thumbnail   = trim($input['thumbnail'] ?? '📘');

    if ($title === '' || $category === '') {
        respond(false, [], "Course title and category are required.", 400);
    }

    $stmt = $pdo->prepare("INSERT INTO courses (title, description, category, teacher_id, thumbnail, level, duration)
                            VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmt->execute([$title, $description, $category, $_SESSION['user_id'], $thumbnail, $level, $duration]);

    respond(true, ["id" => $pdo->lastInsertId()], "Course created successfully.");
}

respond(false, [], "Unsupported method", 405);
