<?php
/**
 * Controller is the customized base controller class.
 * All controller classes for this application should extend from this base class.
 */
class Controller extends CController
{
	/**
	 * tip
	 */
	public function showTip($tip)
	{
		$this->render("/site/tip",array(
			'tip'=>$tip,
		));
		return;
	}

	/**
	 * 权限验证
	 */
	public function checkRestAuth()
	{
		if(!(isset($_SERVER['HTTP_WEXKEY'])) || !(isset($_SERVER['HTTP_WEXTOKEN']))) {
			// Error: Unauthorized
			$this->sendResponse(401,'No Token');
		}
		
		$wexkey = $_SERVER['HTTP_WEXKEY'];
		$wextoken = $_SERVER['HTTP_WEXTOKEN'];
		$wexuser = null;
		
		$salt = 'restyougouwxg1qw23er4';
		$token;
		$suffix = ' by user request ';
		if (isset($_SERVER['HTTP_WEXUSER'])) {
		    $wexuser = $_SERVER['HTTP_WEXUSER'];
			$token = md5($wexkey.$salt.$wexuser);
		} else {
			$today = date("Ymd");
			$token = md5($wexkey.$salt.$today);
			$suffix = ' by normal request ';
		}
		
		if ($wextoken != $token) {
			$this->sendResponse(401, 'Token is invalid'.$suffix);
			Yii::app()->end();
		}
		
		if ($wexuser != null) {
			$user = User::model()->findByPk($wexuser);
			if ($user == null || $user->archived == 0) {
				$this->sendResponse(403, 'User Token is invalid');
				Yii::app()->end();
			}
			return $user;
		} else {
			return null;
		}
	}

	/**
	 * 获得token
	 */
	public function getAuthToken($user)
	{
		list($s1, $s2) = explode(' ', microtime());
		$wexkey = (int)((floatval($s1) + floatval($s2)) * 1000);
		$salt = 'restyougouwxg1qw23er4';
		$today = date("Ymd");
		//$token = md5($wexkey.$salt.$today);
		$token = md5($wexkey.$salt.$user);
		return array(
			"wexkey"=>$wexkey,
			"wextoken"=>$token
		);
	}
	
	/**
	 * 返回信息
	 */
	public function sendResponse($status = 200, $body = '', $content_type = 'text/html')
	{
		// set the status
		$status_header = 'HTTP/1.1 ' . $status . ' ' . $this->getStatusCodeMessage($status);
		header($status_header);
		// and the content type
		header('Content-type: ' . $content_type);
		header('Access-Control-Allow-Origin: *');
		header('Access-Control-Allow-Credentials: true');
			// send the body
		$ret = new JsonData();
		$ret->autoFalse($body);
		echo CJSON::encode($ret);

		Yii::app()->end();
	}
	
	/**
	 * 状态码
	 */
	public function getStatusCodeMessage($status)
	{
		// these could be stored in a .ini file and loaded
		// via parse_ini_file()... however, this will suffice
		// for an example
		$codes = Array(
			201 => 'OK',
			200 => 'OK',
			400 => 'Bad Request',
			401 => 'Unauthorized',
			402 => 'Payment Required',
			403 => 'Forbidden',
			404 => 'Not Found',
			500 => 'Internal Server Error',
			501 => 'Not Implemented',
		);
		return (isset($codes[$status])) ? $codes[$status] : '';
	}
	
}