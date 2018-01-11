<?php
$conn = new mysqli('****', '****', '****', '****');

if(!isset($_POST['clientid'], $_POST['data']))
	die();
$clientid=$_POST['clientid'];
$data=$_POST['data'];
$clientid = mysqli_real_escape_string($con, $clientid);
$data = mysqli_real_escape_string($con, $data);

$sql = "SELECT * FROM studyresults where clientid='$clientid'";
$result = $conn->query($sql);
$count = mysqli_num_rows($result);
if($count==0){
	$sql = "INSERT INTO studyresults(clientid,data) VALUES ('$clientid','$data')";
	$result = $conn->query($sql);
}
else{
	$sql = "UPDATE studyresults SET data='$data' WHERE clientid = '$clientid'";
	$result = $conn->query($sql);
}