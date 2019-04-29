<?php
include_once UTILS_PATH.'mail.inc.php';

// error_log(print_r($_POST,1));

if (isset($_POST['email'])){
    $mailgundata = parse_ini_file(INI_PATH.'mailgun.ini');
    $results = send_email($_POST, $mailgundata, 'contact');
} else {
    $results = 'error, email not set';
}

echo json_encode($results);
