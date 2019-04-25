<?php
session_start();

// if (isset($_GET['savesearch']) && $_GET['savesearch']){
//     $_SESSION['to_shop'] = $_POST;
// }

if (isset($_GET['savedetails']) && $_GET['savedetails']){
    $_SESSION['to_details'] = $_POST;
}

if (isset($_GET['details']) && $_GET['details']){
    echo json_encode($_SESSION['to_details']);
}

// if (isset($_GET['getsearch']) && $_GET['getsearch']){
//     echo json_encode($_SESSION['to_shop']);
// }