<?php
class FrontController {
    static $_instance;

    public static function getInstance() {
        if (!(self::$_instance instanceof self))
            self::$_instance = new self();
        return self::$_instance;
    }

    public function FrontController(){
        $this->uri=$_SERVER['REQUEST_URI'];
        $this->uri=str_replace('/new_framework_github/',"",$this->uri);

        $this->run();
    }

    private function getAllowedPages(){
        $allowedPages=array(
            'home',
            'restaurants',
            'contact',
            'shop',
            'details',
            'login'
        );
        return $allowedPages;
    }
    
    private function loadFiles($module,$folder,$filename,$extension){
        if (file_exists(COMPONENTS_PATH.$module.$folder.$filename.$extension)) {
            include_once COMPONENTS_PATH.$module.$folder.$filename.$extension;
        } else {
            include_once MODULES_PATH.$module.$folder.$filename.$extension;
        }
    }

    private function updateTime($uri){
        if (isset($_SESSION["user"])) {
            if (!(isset($uri[2]) && $uri[2] == 'activity-true'))
                $_SESSION["time"] = time();
        }
    }

    public function run(){
        session_start();
        $allowedPages=$this->getAllowedPages();
        
        $this->uri=rtrim($this->uri, '/');
        $cutUrl=explode('/',$this->uri);
        $this->updateTime($cutUrl);   


        if (isset($cutUrl[0]) && $cutUrl[0]=='api') {
            if (in_array($cutUrl[1],$allowedPages)){
                $getParams=array_slice($cutUrl,2);
                foreach ($getParams as $getParam){
                    $params = explode('-',$getParam);
                    $_GET[$params[0]]=$params[1];
                }
                $this->loadFiles($cutUrl[1],'/model/',$cutUrl[1],'.php');
            } else {
                header('HTTP/1.0 404 Not found');
            }
        } else {
            include_once VIEW_PATH_INC . 'top_page.html';
            include_once VIEW_PATH_INC . 'header.html';
            include_once LOGIN_VIEW_PATH . 'login.html';

            if (in_array($this->uri,$allowedPages)){
                if ($cutUrl[0] == 'details'){
                    $this->loadFiles('shop','/view/',$cutUrl[0],'.html');
                } else {
                    $this->loadFiles($cutUrl[0],'/view/',$cutUrl[0],'.html');
                }
            } else if($this->uri==""||$this->uri=="/"){
                include_once MODULES_PATH . "home/view/home.html";
            } else {
                include_once "404.html";
            }

            include_once VIEW_PATH_INC . 'footer.html';
        }
    }
}
?>