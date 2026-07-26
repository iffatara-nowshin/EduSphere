<?php
require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../includes/functions.php';

requireLogin();
$method = $_SERVER['REQUEST_METHOD'];
$userId = $_SESSION['user_id'];

// ---------- GET: list notes (optionally filter by course_id) ----------
if ($method === 'GET') {
    $sql = "SELECT n.*, c.title AS course_title, l.title AS lesson_title
            FROM notes n
            LEFT JOIN courses c ON c.id = n.course_id
            LEFT JOIN lessons l ON l.id = n.lesson_id
            WHERE n.student_id = ?";
    $params = [$userId];

    if (!empty($_GET['course_id'])) {
        $sql .= " AND n.course_id = ?";
        $params[] = $_GET['course_id'];
    }
    $sql .= " ORDER BY n.is_important DESC, n.updated_at DESC";

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    respond(true, ["notes" => $stmt->fetchAll()]);
}

// ---------- POST: create note ----------
if ($method === 'POST') {
    $input = getJsonInput();
    $title       = trim($input['title'] ?? '');
    $content     = trim($input['content'] ?? '');
    $courseId    = $input['course_id'] ?? null;
    $lessonId    = $input['lesson_id'] ?? null;
    $isImportant = !empty($input['is_important']) ? 1 : 0;

    if ($title === '') respond(false, [], "Note title is required.", 400);

    $stmt = $pdo->prepare("INSERT INTO notes (student_id, course_id, lesson_id, title, content, is_important)
                            VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->execute([$userId, $courseId ?: null, $lessonId ?: null, $title, $content, $isImportant]);

    respond(true, ["id" => $pdo->lastInsertId()], "Note saved.");
}

// ---------- PUT: update note ----------
if ($method === 'PUT') {
    $input = getJsonInput();
    $id = $input['id'] ?? 0;
    if (!$id) respond(false, [], "Note id is required.", 400);

    $chk = $pdo->prepare("SELECT id FROM notes WHERE id=? AND student_id=?");
    $chk->execute([$id, $userId]);
    if (!$chk->fetch()) respond(false, [], "Note not found.", 404);

    $title       = trim($input['title'] ?? '');
    $content     = trim($input['content'] ?? '');
    $isImportant = !empty($input['is_important']) ? 1 : 0;

    $stmt = $pdo->prepare("UPDATE notes SET title=?, content=?, is_important=? WHERE id=? AND student_id=?");
    $stmt->execute([$title, $content, $isImportant, $id, $userId]);

    respond(true, [], "Note updated.");
}

// ---------- DELETE: remove note ----------
if ($method === 'DELETE') {
    $input = getJsonInput();
    $id = $input['id'] ?? ($_GET['id'] ?? 0);
    if (!$id) respond(false, [], "Note id is required.", 400);

    $stmt = $pdo->prepare("DELETE FROM notes WHERE id=? AND student_id=?");
    $stmt->execute([$id, $userId]);

    respond(true, [], "Note deleted.");
}

respond(false, [], "Unsupported method", 405);
