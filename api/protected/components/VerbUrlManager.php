<?php
class VerbUrlManager extends CUrlManager{
    protected function processRules(){
        $rules=array();
		$method=strtolower(Yii::app()->getRequest()->getRequestType());
        //transform method's rules keys to lowercase
        $this->rules=array_combine(array_map(array($this,'__atToLowerCase'), array_keys($this->rules)),array_values($this->rules));
        //check if it has an index the same as the request type and if it does add its rules
        if(key_exists("@{$method}", $this->rules)){
            $rules=$this->rules["@{$method}"];
        }
        //add the default rules
        if(is_array($rules)){
            foreach($this->rules as $k=>$rule)
                if(substr($k,0,1)!=='@')
                    $rules[$k]=$rule;
        }elseif(is_string($rules)){
            $rules=array("."=>$rules);
        }
        //override the existing rules with only those that matche with the request type 
        $this->rules=$rules;
        //disable cache that causes it to load wrong rules 
        //cant use it as its defined as a constant and not able to change to use method's specific cache 
        $this->cacheID=false;

        parent::processRules();
	}
    private function __atToLowerCase($str){
        if(substr($str,0,1)==="@")
            return strtolower($str);
        return $str;
    }
}