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
        // error_log(print_r($this,1));

        $this->run();
    }

    private function getAllowedPages(){
        $allowedPages=array(
            'home',
            'restaurants',
            'contact',
            'shop'
        );
        return $allowedPages;
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
                // components 
                if (file_exists(COMPONENTS_PATH.$cutUrl[1].'/model/'.$cutUrl[1].'.php')) {
                    include_once COMPONENTS_PATH.$cutUrl[1].'/model/'.$cutUrl[1].'.php';
                } else {
                    include_once MODULES_PATH.$cutUrl[1].'/model/'.$cutUrl[1].'.php';
                }
            } else {
                header('HTTP/1.0 404 Not found');
            }
        } else {
            include_once VIEW_PATH_INC . 'top_page.html';
            include_once VIEW_PATH_INC . 'header.html';

            if (in_array($this->uri,$allowedPages)){
                // components 
                if (file_exists(COMPONENTS_PATH.$this->uri.'/view/'.$this->uri.'.html')) {
                    include_once COMPONENTS_PATH.$this->uri.'/view/'.$this->uri.'.html';
                } else {
                    include_once MODULES_PATH . $this->uri.'/view/'.$this->uri.".html";
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