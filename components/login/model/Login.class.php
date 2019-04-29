<?php
class Login extends ModelController{
    protected $tableName='users';
    private static $instance;
    
    protected function __construct(){
        parent::__construct();
    }
    public static function getInstance(){
        if (!(self::$instance instanceof self))
            self::$instance = new self();
        return self::$instance;
    }
}