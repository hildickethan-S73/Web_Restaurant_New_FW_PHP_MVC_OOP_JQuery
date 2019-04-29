<?php
$method = $_SERVER['REQUEST_METHOD'];
$object = Login::getInstance();

if ($method == 'POST'){
    if (isset($_GET['register']) && $_GET['register']){
        unset($_POST['data']['password2']);
        $_POST['data']['password']=password_hash($_POST['data']['password'],PASSWORD_BCRYPT);
        $_POST['data'] = json_encode($_POST['data']);
        include_once CONTROLLER_PATH.'ApiController.class.php';
        echo json_encode($results);
    }

    if (isset($_GET['email']) && $_GET['email']){
        include_once UTILS_PATH.'mail.inc.php';

        $mailgundata = parse_ini_file(INI_PATH.'mailgun.ini');
        $results = send_email($_POST['email'], $mailgundata, 'recover');
        echo json_encode($results);
    }
} else if ($method == 'GET'){
    if (isset($_GET['login']) && $_GET['login']){
        unset($_GET['login']);
        $loginpassword = $_GET['password'];
        unset($_GET['password']);
        include_once CONTROLLER_PATH.'ApiController.class.php';
        
        if($results){
            if(password_verify($loginpassword,$results[0]->password)){
                $_SESSION['user']=$results;
            } else {
                echo 'badpw';
            }
        } else {
            echo 'nouser';
        }
    }

    if (isset($_GET['check']) && $_GET['check']){
        if (isset($_SESSION['user'])){
            echo json_encode($_SESSION['user']);
        } else {
            echo json_encode('notlogged');
        }
    }

    if (isset($_GET['activity']) && $_GET['activity']){
        if (isset($_SESSION['user'])){
            if (isset($_SESSION["time"])){  
                // error_log(print_r($_SESSION["time"],1));
                if((time() - $_SESSION["time"]) >= 1200){ //seconds
                    echo true; 
                    exit();
                }
            }
        }
    }
} else if ($method == 'DELETE'){
    if (isset($_GET['logout']) && $_GET['logout']){
        if (isset($_SESSION['user'])){
            unset($_SESSION['user']);
            session_destroy();
        } 
    }
}



// include_once CONTROLLER_PATH.'ApiController.class.php';
// echo json_encode($results);