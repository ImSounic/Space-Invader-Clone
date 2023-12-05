<?php
// Edel Sherratt October 2022
// random leaderboard demo
// save a player's score to a database


// open a connection to the database as a PDO
require 'get_db_connection.php';
$conn = get_db_connection();

// Get data from the POST request
$name = $_GET['name'];
$score = $_GET['score'];

$query = $conn->prepare("INSERT INTO game_leaderboard (name, score) VALUES (:name, :score)");
$query->bindParam(':name', $name);
$query->bindParam(':score', $score);
$query->execute();

// remove all references to the connection
$query = null;
$conn = null;

?>
