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
            'details'
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

    public function run(){
        $allowedPages=$this->getAllowedPages();

        $this->uri=rtrim($this->uri, '/');
        $cutUrl=explode('/',$this->uri);

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