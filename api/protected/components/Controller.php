<?php
/**
 * Controller is the customized base controller class.
 * All controller classes for this application should extend from this base class.
 */
class Controller extends CController
{
	/**
	 * @var string the default layout for the controller view. Defaults to '//layouts/column1',
	 * meaning using a single column layout. See 'protected/views/layouts/column1.php'.
	 */
	public $layout='//layouts/column1';
	/**
	 * @var array context menu items. This property will be assigned to {@link CMenu::items}.
	 */
	public $menu=array();
	/**
	 * @var array the breadcrumbs of the current page. The value of this property will
	 * be assigned to {@link CBreadcrumbs::links}. Please refer to {@link CBreadcrumbs::links}
	 * for more details on how to specify this property.
	 */
	public $breadcrumbs=array();


	protected $salt = 'restjimubox!@#123$%^456';

	/**
	 * 权限验证
	 */
	public function checkRestAuth()
	{
		$wexkey = null;
		$wextoken = null;

		if(isset($_SERVER['HTTP_WEXKEY']) && isset($_SERVER['HTTP_WEXTOKEN'])) {
			$wexkey = $_SERVER['HTTP_WEXKEY'];
			$wextoken = $_SERVER['HTTP_WEXTOKEN'];
		}

		$cookies = Yii::app()->request->getCookies();
		if (isset($cookies['wexkey']) && isset($cookies['wextoken'])) {
			$wexkey = $cookies['wexkey'];
			$wextoken = $cookies['wextoken'];
		}

		if (!isset($wexkey) || !isset($wextoken)) {
			return $this->sendResponse('403', 'Unauthorized');
		}
		
		$token;
		$today = date("Ymd");
		$token = md5($wexkey.$this->salt.$today);
	
		if ($wextoken != $token) {
			return $this->sendResponse(403, 'invalid token');
		}
	
		return null;
	}
	
	/**
	 * 获得token
	 */
	public function getAuthToken($user = null)
	{
		list($s1, $s2) = explode(' ', microtime());
		$wexkey = (int)((floatval($s1) + floatval($s2)) * 1000);
		$salt = $this->salt;
		$today = date("Ymd");
		//$token = md5($wexkey.$salt.$today);
		if ($user == null) {
			$token = md5($wexkey.$salt.$today);
		} else {
			$token = md5($wexkey.$salt.$user);
		}
		
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