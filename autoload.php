<?php
spl_autoload_register(null,false);
spl_autoload_extensions('.php,.class.php');
spl_autoload_register('loadClasses');
function loadClasses($className){
    // error_log(print_r($className,1));
    
    // controller
    if (file_exists(CONTROLLER_PATH.$className.'.class.php')){
        // error_log(print_r($className.' c loaded',1));
        include_once CONTROLLER_PATH.$className.'.class.php';
    }

    // model
    if (file_exists(MODEL_PATH.$className.'.class.php')){
        // error_log(print_r($className.' m loaded',1));
        include_once MODEL_PATH.$className.'.class.php';
    }

    // module controller
    if (file_exists(MODULES_PATH.strtolower($className).'/controller/'.strtolower($className).'.class.php')) {
        // error_log(print_r($className.' c loaded',1));
        include_once MODULES_PATH.strtolower($className).'/controller/'.strtolower($className).'.class.php';
    }

    // module model
    if (file_exists(MODULES_PATH.strtolower($className).'/model/'.strtolower($className).'.class.php')) {
        // error_log(print_r($className.' m loaded',1));
        include_once MODULES_PATH.strtolower($className).'/model/'.strtolower($className).'.class.php';
    }

    // components controller
    if (file_exists(COMPONENTS_PATH.strtolower($className).'/controller/'.strtolower($className).'.class.php')) {
        // error_log(print_r($className.' c loaded',1));
        include_once COMPONENTS_PATH.strtolower($className).'/controller/'.strtolower($className).'.class.php';
    }

    // components model
    if (file_exists(COMPONENTS_PATH.strtolower($className).'/model/'.strtolower($className).'.class.php')) {
        // error_log(print_r($className.' m loaded',1));
        include_once COMPONENTS_PATH.strtolower($className).'/model/'.strtolower($className).'.class.php';
    }
}