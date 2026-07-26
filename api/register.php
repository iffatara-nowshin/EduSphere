<?php
require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../includes/functions.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(false, [], "Only POST requests are allowed.", 405);
}

$input = getJsonInput();
$name     = trim($input['name'] ?? '');
$email    = trim(strtolower($input['email'] ?? ''));
$password = $input['password'] ?? '';
$role     = in_array($input['role'] ?? '', ['student', 'teacher']) ? $input['role'] : 'student';

if ($name === '' || $email === '' || $password === '') {
    respond(false, [], "Name, email and password are required.", 400);
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond(false, [], "Please enter a valid email.", 400);
}
if (strlen($password) < 6) {
    respond(false, [], "Password must be at least 6 characters.", 400);
}

// Check if email already exists
$stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
$stmt->execute([$email]);
if ($stmt->fetch()) {
    respond(false, [], "An account with this email already exists.", 409);
}

$hashed = password_hash($password, PASSWORD_BCRYPT);

$stmt = $pdo->prepare("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)");
$stmt->execute([$name, $email, $hashed, $role]);
$userId = $pdo->lastInsertId();

// Auto login after registration
$_SESSION['user_id'] = $userId;
$_SESSION['name']    = $name;
$_SESSION['email']   = $email;
$_SESSION['role']    = $role;

respond(true, [
    "user" => ["id" => $userId, "name" => $name, "email" => $email, "role" => $role]
], "Account created successfully!");
