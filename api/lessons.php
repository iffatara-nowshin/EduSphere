<?php
require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../includes/functions.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    if (empty($_GET['course_id'])) respond(false, [], "course_id is required.", 400);
    $stmt = $pdo->prepare("SELECT * FROM lessons WHERE course_id = ? ORDER BY order_no ASC");
    $stmt->execute([$_GET['course_id']]);
    respond(true, ["lessons" => $stmt->fetchAll()]);
}

if ($method === 'POST') {
    requireRole(['teacher', 'admin']);
    $input = getJsonInput();
    $courseId = $input['course_id'] ?? 0;
    $title    = trim($input['title'] ?? '');
    $content  = trim($input['content'] ?? '');
    $videoUrl = trim($input['video_url'] ?? '');

    if (!$courseId || $title === '') respond(false, [], "Course and lesson title are required.", 400);

    // Only the owning teacher (or admin) can add lessons
    $chk = $pdo->prepare("SELECT teacher_id FROM courses WHERE id = ?");
    $chk->execute([$courseId]);
    $course = $chk->fetch();
    if (!$course) respond(false, [], "Course not found.", 404);
    if ($_SESSION['role'] !== 'admin' && $course['teacher_id'] != $_SESSION['user_id']) {
        respond(false, [], "Only the course's own teacher can add lessons.", 403);
    }

    $orderStmt = $pdo->prepare("SELECT COALESCE(MAX(order_no),0)+1 AS next_order FROM lessons WHERE course_id=?");
    $orderStmt->execute([$courseId]);
    $nextOrder = $orderStmt->fetch()['next_order'];

    $stmt = $pdo->prepare("INSERT INTO lessons (course_id, title, content, video_url, order_no) VALUES (?, ?, ?, ?, ?)");
    $stmt->execute([$courseId, $title, $content, $videoUrl, $nextOrder]);

    respond(true, ["id" => $pdo->lastInsertId()], "Lesson added successfully.");
}

respond(false, [], "Unsupported method", 405);
