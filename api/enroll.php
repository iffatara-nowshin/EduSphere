<?php
require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../includes/functions.php';

$method = $_SERVER['REQUEST_METHOD'];

// ---------- GET: list the logged-in student's enrolled courses ----------
if ($method === 'GET') {
    requireLogin();
    $stmt = $pdo->prepare("
        SELECT c.*, u.name AS teacher_name, e.progress, e.enrolled_at,
               (SELECT COUNT(*) FROM lessons l WHERE l.course_id = c.id) AS lessons_count
        FROM enrollments e
        JOIN courses c ON c.id = e.course_id
        JOIN users u ON u.id = c.teacher_id
        WHERE e.student_id = ?
        ORDER BY e.enrolled_at DESC
    ");
    $stmt->execute([$_SESSION['user_id']]);
    respond(true, ["enrollments" => $stmt->fetchAll()]);
}

// ---------- POST: enroll in a course ----------
if ($method === 'POST') {
    requireRole('student');
    $input = getJsonInput();
    $courseId = $input['course_id'] ?? 0;
    if (!$courseId) respond(false, [], "course_id is required.", 400);

    $chk = $pdo->prepare("SELECT id FROM courses WHERE id = ?");
    $chk->execute([$courseId]);
    if (!$chk->fetch()) respond(false, [], "Course not found.", 404);

    $dupCheck = $pdo->prepare("SELECT id FROM enrollments WHERE student_id=? AND course_id=?");
    $dupCheck->execute([$_SESSION['user_id'], $courseId]);
    if ($dupCheck->fetch()) respond(false, [], "You are already enrolled in this course.", 409);

    $stmt = $pdo->prepare("INSERT INTO enrollments (student_id, course_id) VALUES (?, ?)");
    $stmt->execute([$_SESSION['user_id'], $courseId]);

    respond(true, [], "Successfully enrolled in the course!");
}

// ---------- PUT: update progress ----------
if ($method === 'PUT') {
    requireRole('student');
    $input = getJsonInput();
    $courseId = $input['course_id'] ?? 0;
    $progress = max(0, min(100, (int)($input['progress'] ?? 0)));
    if (!$courseId) respond(false, [], "course_id is required.", 400);

    $stmt = $pdo->prepare("UPDATE enrollments SET progress=? WHERE student_id=? AND course_id=?");
    $stmt->execute([$progress, $_SESSION['user_id'], $courseId]);

    respond(true, [], "Progress updated.");
}

respond(false, [], "Unsupported method", 405);
