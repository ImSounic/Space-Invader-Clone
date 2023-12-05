<?php
// open a connection to the database as a PDO
require 'get_db_connection.php';
$conn = get_db_connection();

$query = $conn->prepare("SELECT * FROM game_leaderboard ORDER BY score DESC LIMIT 10");
$query->execute();
$leaderboardData = $query->fetchAll(PDO::FETCH_ASSOC);
echo json_encode($leaderboardData);

// Close database connection
$conn = null;
?>