<?php
header("Access-Control-Allow-Origin: *");
$conn = new mysqli('****', '****', '****', '****');

echo "hi\n";
if(!isset($_POST['clientid'], $_POST['data']))
	die();
echo "hi2\n\";
$clientid=$_POST['clientid'];
$data=$_POST['data'];
echo $_POST['clientid'] . "\n";
$clientid = mysqli_real_escape_string($con, $clientid);
$data = mysqli_real_escape_string($con, $data);

$sql = "INSERT INTO studyresults(clientid,data) VALUES ('$clientid','$data')";
$result = $conn->query($sql);
echo '<pre>', print_r($result), '</pre>', "\n";
