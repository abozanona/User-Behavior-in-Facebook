<?php
require 'database.php';

if(!isset($_GET['email']))
	die();
$email=$_GET['email'];
$email = mysqli_real_escape_string($con, $email);

$sql = "SELECT * FROM emails where email='$email'";
$result = $conn->query($sql);
$count = mysqli_num_rows($result);
if($count==0){
	$sql = "INSERT INTO email(email) VALUES ('$email')";
	$result = $conn->query($sql);
}