<?php
require 'database.php';

if(!isset($_GET['name']))
	die();
$name=$_GET['name'];
$name = mysqli_real_escape_string($con, $name);
$response = json_decode(file_get_contents("https://gender-api.com/get?name=$name&key=XckFuhBRtSeaCluSma"));

if($response.gender == "male"){
    die(1);
}
else if($response.gender="female"){
    die(2);
}
else{
    die(3);
}
