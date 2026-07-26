<?php
/**
 * Common helper functions used across all API endpoints
 */

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

header('Content-Type: application/json; charset=utf-8');

/** Send a JSON response and stop execution */
function respond($success, $data = [], $message = "", $code = 200) {
    http_response_code($code);
    echo json_encode(array_merge(
        ["success" => $success, "message" => $message],
        is_array($data) ? $data : ["data" => $data]
    ));
    exit;
}

/** Read JSON body sent from fetch() */
function getJsonInput() {
    $input = json_decode(file_get_contents("php://input"), true);
    return is_array($input) ? $input : [];
}

/** Require the user to be logged in */
function requireLogin() {
    if (empty($_SESSION['user_id'])) {
        respond(false, [], "You need to be logged in. Please log in again.", 401);
    }
}

/** Require a specific role (e.g. teacher, admin) */
function requireRole($roles) {
    requireLogin();
    $roles = is_array($roles) ? $roles : [$roles];
    if (!in_array($_SESSION['role'], $roles)) {
        respond(false, [], "You don't have permission to do this.", 403);
    }
}

function currentUserId() {
    return $_SESSION['user_id'] ?? null;
}
