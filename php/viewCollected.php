<?php
session_start();
header("Access-Control-Allow-Origin: *");
$conn = new mysqli('****', '****', '****', '****');

if(isset($_POST['username'], $_POST['password'])){
    $_POST['username'] = mysqli_real_escape_string($conn, $_POST['username']);
    $_POST['password'] = mysqli_real_escape_string($conn, $_POST['password']);

    $sql = "SELECT `id` FROM `users` WHERE `name`='{$_POST['username']}' AND `password`='{$_POST['password']}'";
    $query = $conn->query($sql);
    if(mysqli_num_rows($query) == 0){
        die("Unauthorised user");
    }
    $_SESSION['user'] = '(tiyFUIOYP{}(IuiyhuRCYTE5Y5UI';
}

if(!isset($_SESSION['user'])){
    die(0);
}

$sql = "SELECT `id`, `clientid`, `data`, `create_time`, `isViewed` FROM `studyresults` WHERE `isViewed` = 0";
$query = $conn->query($sql);
......
.....
....
...
..
.