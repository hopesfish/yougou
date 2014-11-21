<?php

/**
 * JsonData class.
 * 
 */
class JsonData
{
	public $status=1;//0:失败；1:成功。
	public $message='success';//返回的提示信息。
	public $curPage; //当前页数
	public $limit; //每页行数
	public $total; // 总共行数
	public $result=array();//返回的数据信息。
	
	public function autoFalse($mes = 'failed'){
		$this->status = 0;
		$this->message = $mes;
	}

	public function autoLoginFalse(){
		$this->status = -1;
		$this->message = '未登录!';
	}

}