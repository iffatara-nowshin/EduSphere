<?php
require_once __DIR__ . '/../includes/functions.php';

if (empty($_SESSION['user_id'])) {
    respond(true, ["user" => null], "Not logged in.");
}

respond(true, [
    "user" => [
        "id"    => $_SESSION['user_id'],
        "name"  => $_SESSION['name'],
        "email" => $_SESSION['email'],
        "role"  => $_SESSION['role'],
    ]
]);
