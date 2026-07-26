<?php
require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../includes/functions.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(false, [], "Only POST requests are allowed.", 405);
}

$input = getJsonInput();
$email    = trim(strtolower($input['email'] ?? ''));
$password = $input['password'] ?? '';

if ($email === '' || $password === '') {
    respond(false, [], "Please enter email and password.", 400);
}

$stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
$stmt->execute([$email]);
$user = $stmt->fetch();

if (!$user || !password_verify($password, $user['password'])) {
    respond(false, [], "Incorrect email or password.", 401);
}

$_SESSION['user_id'] = $user['id'];
$_SESSION['name']    = $user['name'];
$_SESSION['email']   = $user['email'];
$_SESSION['role']    = $user['role'];

respond(true, [
    "user" => [
        "id" => $user['id'],
        "name" => $user['name'],
        "email" => $user['email'],
        "role" => $user['role']
    ]
], "Welcome back, " . $user['name'] . "!");
