<?php
header("Access-Control-Allow-Origin: *");
$conn = new mysqli('****', '****', '****', '****');

if(!isset($_POST['clientid'], $_POST['data']))
	die('');

$clientid=$_POST['clientid'];
$data=$_POST['data'];
$clientid = mysqli_real_escape_string($conn, $clientid);
$data = mysqli_real_escape_string($conn, $data);

$sql = "INSERT INTO errorslist(clientid,data) VALUES ('$clientid','$data')";
$result = $conn->query($sql);
