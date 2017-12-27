<?php
require 'database.php';

if(!isset($_GET['class'], $_GET['data']))
	die();
$class=$_GET['class'];
$data=$_GET['data'];
$class = mysqli_real_escape_string($con, $class);
$sql = "SELECT * FROM dataattributes where class='$class' AND data='$data'";
$result = $conn->query($sql);
$count = mysqli_num_rows($result);
if($count==0){
	$sql = "INSERT INTO dataattributes(class,data) VALUES ('$class','$data')";
	$result = $conn->query($sql);
}