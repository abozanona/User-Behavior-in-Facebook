<?php
require 'database.php';

if(!isset($_GET['q']))
	die('4');
$q=$_GET['q'];
$q = mysqli_real_escape_string($con, $q);
$sql = "SELECT * FROM privacy where name='$q'";
$result = $conn->query($sql);
$count = mysqli_num_rows($result);
if($count!=0){
	$row = mysqli_fetch_array($result);
	echo $row['type'];
}
else{
	$sql = "INSERT INTO privacy(name) VALUES ('$q')";
	$result = $conn->query($sql);
	echo '4';
}