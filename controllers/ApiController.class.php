<?php
if ($method=='GET'||$method=='DELETE'){
    $data=$_GET;
    $results = [];
    $response = $object->$method($data);
    if ($method=='DELETE'){
        if ($response){
            $results=$response;
        } else {
            header('HTTP/1.0 400 Bad Request');
            die();
        }
    } else {
        if ($response){
            foreach ($response as $row){
                foreach ($row as &$element){
                    $element=utf8_encode($element);
                }
                $results[]=(object)$row;
            }
        } else {
            header('HTTP/1.0 400 Bad Request');
            die();
        }
    }
} else if ($method=='POST'){
    $data=json_decode($_POST['data']);
    $response = $object->$method($data);
    if ($response){
        $results=$response;
    } else {
        header('HTTP/1.0 400 Bad Request');
        die();
    }
} else if ($method=='PUT'){
    parse_str(file_get_contents("php://input"),$post_vars);
    $data = [$_GET, $post_vars];
    // error_log(print_r($data,1));
    $response = $object->$method($data);
    if ($response){
        $results=$response;
    } else {
        header('HTTP/1.0 400 Bad Request');
        die();
    }    
} else {
    header('HTTP/1.0 400 Bad Request');
    die();
}