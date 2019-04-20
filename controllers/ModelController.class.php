<?php
class ModelController extends ControllerCore{
    private $_instance;

    protected function __construct(){
    }

    public static function getInstance() {
        if (!(self::$_instance instanceof self))
            self::$_instance = new self();
        return self::$_instance;
    }

    public function GET($data){
        $query=$this->buildGetQuery($data);
        return $this->runQuery($query);
    }

    public function POST($data){
        $query=$this->buildPostQuery($data);
        return $this->runQuery($query);
    }
    
    public function PUT($data){
        $query=$this->buildPutQuery($data);
        return $this->runQuery($query);
    }
    
    public function DELETE($data){
        $query=$this->buildDeleteQuery($data);        
        return $this->runQuery($query);
    }
}