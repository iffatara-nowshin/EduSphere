<?php
/**
 * Database connection (PDO)
 * Put your local/server database credentials below
 */

$DB_HOST = "localhost";
$DB_NAME = "elearning_db";
$DB_USER = "root";      // সাধারণত XAMPP/WAMP এ root
$DB_PASS = "";          // XAMPP এ সাধারণত পাসওয়ার্ড ফাঁকা থাকে

try {
    $pdo = new PDO(
        "mysql:host=$DB_HOST;dbname=$DB_NAME;charset=utf8mb4",
        $DB_USER,
        $DB_PASS,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]
    );
} catch (PDOException $e) {
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode(["success" => false, "message" => "Database connection failed: " . $e->getMessage()]);
    exit;
}
