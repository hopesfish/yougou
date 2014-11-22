<?php
class UserController extends Controller
{
	/**
	 * REST 登录认证接口
	 * /api/auth
	 * 返回 { wexschool: **, wexuser: **, wexkey: **, wextoken: **}
	 */
	public function actionRestauth() {
		$username = $_POST['username'];
		$password = $_POST['password'];
		if (!isset($username) || !isset($password)) {
			return $this->sendResponse(400, 'login info is not provided.');
		}

		$criteria=new CDbCriteria();
        $criteria->compare('username', $username);
        $criteria->compare('archived', 1);
        $criteria->order = 'created_time desc';

		$users = User::model()->findAll($criteria);
		$user;
		if (count($users) == 0) {
			return $this->sendResponse(404, 'user is not found.');
		} else if (count($users) > 1) {
			$this->sendResponse(400, "too many user, not supported yet");
		} else {
			$user = $users[0];
		}
		if ($user->archived == 0) {
			return $this->sendResponse(404, 'user is not found.');
		}
		if ($user->encrypt($password) != $user->password) {
			return $this->sendResponse(401, 'login info is invalid.');
		}
		$token = $this->getAuthToken($user->id);
		$token['wexuser'] = $user->id;
		echo CJSON::encode($token);
	}

	/**
	 * mapper the json object.
	 */
	protected function JSONMapper($user) {
		$newuser = array();

		$newuser['id'] = $user->id;
		$newuser['username'] = $user->username;
		$newuser['name'] = $user->name;
		$newuser['mobile'] = $user->mobile;
		$newuser['email'] = $user->email;

		$newuser['actived'] = false;
		if ($user->open_id != null) {
			$newuser['actived'] = true;
		}
		return $newuser;
	}

	/**
	 * mapper the json array.
	 */
	protected function JSONArrayMapper($persistenceds) {
		$users = array();
		foreach ($persistenceds as $user) {
			if ($user->archived == 0) { continue; }
			array_push($users, $this->JSONMapper($user));
		}
		return $users;
	}

	/**
	 * 用户集合数据
	 * GET /api/user
	 */
	public function actionRestindex() {
		$this->checkRestAuth();

        $criteria = new CDbCriteria();
        $criteria->compare('archived', 1);
        $criteria->order = 'created_time desc';

        if (isset($_GET['id'])) {
        	$criteria->compare('id', $_GET['id']);
        }
        if (isset($_GET['schoolId'])) {
        	$criteria->compare('school_id', $_GET['schoolId']);
        }
        if (isset($_GET['openId'])) {
        	$criteria->compare('open_id', $_GET['openId']);
        }
        if (isset($_GET['mobile'])) {
        	$criteria->compare('mobile', $_GET['mobile']);
        }

		$json = new JsonData();
		$json->result = $this->JSONArrayMapper(User::model()->findAll($criteria));

		echo CJSON::encode($json);
	}

	/**
	 * 某名用户数据
	 * GET /api/user/{id}
	 * GET /api/school/{schoolId}/user/{id}
	 */
	public function actionRestget() {
		$this->checkRestAuth();
		$id = $_GET['id'];
		if (!isset($id)) {
			$this->sendResponse(404, 'id is not provided.');
			Yii::app()->end();
		}
		$user = User::model()->findByPk($id);
		if ($user == null) {
			$this->sendResponse(400, 'user is not found.');
			Yii::app()->end();
		}
		echo CJSON::encode($this->JSONMapper($user));
	}

	/**
	 * 更新用户信息
	 * POST /api/user/{userId}
	 * POST /api/school/{schoolId}/user/{userId}
	 */
	public function actionRestupdate() {
		$authuser = $this->checkRestAuth();

		
        if (isset($_GET['schoolId'])) {
        	// check school
            $school = School::model()->findByPk($_GET['schoolId']);
            if ($school == null || $school->archived == 0) {
                return $this->sendResponse(404, 'school is not found');
            }
        }

		$user = User::model()->findByPk($_GET['userId']);
		if ($user == null || $user->archived == 0) {
			$this->sendResponse(404, 'user is not found');
			Yii::app()->end();
		}

		if (isset($_POST['name'])) {
			$user->name = $_POST['name'];
		}
		if (isset($_POST['mobile'])) {
			$user->mobile = $_POST['mobile'];
		}
		if (isset($_POST['oldPassword']) && isset($_POST['password'])) {
			if ($user->encrypt($_POST['oldPassword']) != $user->password) {
				$this->sendResponse(400, 'old password is not correct.');
				Yii::app()->end();
			}
			$password = $_POST['password'];
			if (strlen($password) < 4) {
				$this->sendResponse(400, 'at least 4 characters.');
				Yii::app()->end();
			}
			$user->password = $password;
			//$user->password = $user->encrypt($password);
		}

		if (isset($_POST['openId'])) {
			if (!isset($_POST['password'])) {
				return $this->sendResponse(400, 'password is required');
			}
			if ($user->password != $user->encrypt($_POST['password'])) {
				return $this->sendResponse(400, 'password is invalid');
			}
			if ($user->open_id != null) {
				return $this->sendResponse(400, 'registered');
			}
			$users = User::model()->findAll('open_id = :openId and school_id = :schoolId and archived=1', 
				array(':openId'=>$_POST['openId'], ':schoolId'=>$user->school_id));

			if (count($users) > 0) {
				return $this->sendResponse(400, 'open id is used');
			}
			$user->open_id = $_POST['openId'];
		}

		if (isset($_POST['photo'])) {
			$user->photo = $_POST['photo'];
			// 更新孩子的照片
		}

		if (isset($_POST['email'])) {
			$user->email = $_POST['email'];
		}

		if (isset($_POST['updatedBy'])) {
			$user->updated_by = $_POST['updatedBy'];
		}

		// 解绑定
		if (isset($_GET['unbind']) && $authuser != null) {
		    // TODO 只有同一个家庭的才可以解绑
		    /*
			if ($authuser->type == 0 && $authuser->id != $user->id) {
				return $this->sendResponse(400, 'can not unbind other.');
			}*/
			// TODO 同一个学校的老师才能unbind
			// TODO 如果是孩子的唯一家长，孩子的enabled状态应该为false
			$user->open_id = null;
		}

		if ($user->save()) {
			$this->sendResponse(200, 'updated.');
			Yii::app()->end();
		} else {
			$this->sendResponse(500, 'failed to update.');
			Yii::app()->end();
		}
	}

	/**
	 * 重置某个园所有未激活用户的密码为手机后四位
	 * GET /school/{schoolId}/user/reset
	 */
	public function actionRestresetpassword() {

		// check school
		if (isset($_GET['schoolId'])) {
			$school = School::model()->findByPk($_GET['schoolId']);
			if ($school == null || $school->archived == 0) {
				return $this->sendResponse(404, 'school is not found');
			}
		}
		
        $criteria = new CDbCriteria();
        $criteria->compare('archived', 1);
        $criteria->order = 'created_time desc';

        if (isset($_GET['schoolId'])) {
        	$criteria->compare('school_id', $_GET['schoolId']);
        }
        $criteria->compare('open_id', null);

		$users = User::model()->findAll($criteria);
		$count = 0;
		foreach ($users as $user) {
			if ($user->open_id != null) { continue; }

			$password = substr($user->mobile, -4);
			if($user->password != User::model()->encrypt($password)) {
				$count++;

				$user->username = trim($user->username);
				$user->mobile = trim($user->mobile);
				$user->password = $password;
				if (!$user->save()) {
					return $this->sendResponse(500, 'failed to reset password '.$user->id);
				} else {
					/*
					Notification::addNotification(
                        $user->id,
                        "您的优购优惠券管理后台激活密码已重置为您手机号码的后四位，请使用新密码激活您在优购优惠券管理后台的账号。如需帮助，请发邮件至support@yougouwx.com。对您造成的不便深表歉意。",
                        1
                    );*/
				}
			}
			
		}

		echo CJSON::encode($count);
	}
}
