<?php
Yii::import('application.controllers.BaseController');
class CouponController extends BaseController
{

	/**
	 * mapper the json object.
	 */
	protected function JSONMapper($coupon) {
		$newcoupon = array();

		$newcoupon['id'] = $coupon->id;
		
		$newcoupon['code'] = $coupon->code;
		$newcoupon['batch'] = $coupon->batch;
		$newcoupon['openId'] = $coupon->open_id;
		$newcoupon['activityId'] = $coupon->activity_id;
		$newcoupon['achievedTime'] = $coupon->achieved_time;

		return $newcoupon;
	}

	/**
	 * mapper the json array.
	 */
	protected function JSONArrayMapper($persistenceds) {
		$coupons = array();
		foreach ($persistenceds as $coupon) {
			if ($coupon->archived == 0) { continue; }
			array_push($coupons, $this->JSONMapper($coupon));
		}
		return $coupons;
	}

	/**
	 * 优惠券集合数据
	 * GET /api/coupon
	 * GET /api/activity/{activityId}/coupon
	 */
	public function actionRestindex() {
		$this->checkRestAuth();

        // 分页
        $curPage = 1;
        $offset = 0;
        $limit = 100;

        if (isset($_GET['limit'])) {
            $limit = intval($_GET['limit']);
        }
        if (isset($_GET['curPage'])) {
            $curPage = intval($_GET['curPage']);
            $offset = $limit * ($curPage - 1);
        }

        $criteria = new CDbCriteria();
        $criteria->compare('archived', 1);
        $criteria->order = 'achieved_time desc';
        $criteria->offset = $offset;
        $criteria->limit = $limit;

        if (isset($_GET['activityId'])) {
        	// check activity
			$activity = Activity::model()->findByPk($_GET['activityId']);
			if ($activity == null || $activity->archived == 0) {
				return $this->sendResponse(404, 'activity is not found');
			}
			$criteria->compare('activity_id', $activity->id);
        }
        if (isset($_GET['id'])) {
        	$criteria->compare('id', $_GET['id']);
        }
        if (isset($_GET['openId'])) {
            $criteria->compare('open_id', $_GET['openId']);
        }
        if (isset($_GET['unachieved'])) {
            $criteria->addCondition('achieved_time IS NULL');
        	$criteria->addCondition('open_id IS NULL');
        }
        if (isset($_GET['achieved'])) {
            $criteria->addCondition('achieved_time IS NOT NULL');
        	$criteria->addCondition('open_id IS NOT NULL');
        }
        if (isset($_GET['code'])) {
        	$criteria->addSearchCondition('code', $_GET['code']);
        }
        if (isset($_GET['limit'])) { // 该参数仅仅是为了活动已领取和未领取得数目
        	$criteria->limit = 1;
        }

		$json = new JsonData();
		$json->total = (int)Coupon::model()->count($criteria);
		$json->result = $this->JSONArrayMapper(Coupon::model()->findAll($criteria));

		echo CJSON::encode($json);
	}

	/**
	 * 优惠券获取时间节点
	 * GET /api/activity/{activityId}/coupon/timeline
	 */
	public function actionResttimeline() {
		//$this->checkRestAuth();

		// check activity
		$activity = Activity::model()->findByPk($_GET['activityId']);
		if ($activity == null || $activity->archived == 0) {
			return $this->sendResponse(404, 'activity is not found');
		}

        $criteria = new CDbCriteria();
        $criteria->compare('archived', 1);
        $criteria->compare('activity_id', $activity->id);
        $criteria->addCondition('open_id IS NOT NULL');
        $criteria->addCondition('achieved_time IS NOT NULL');
        $criteria->order = 'achieved_time asc';

        $result = array();
        $coupons = Coupon::model()->findAll($criteria);
        foreach ($coupons as $coupon) {
     
        	$key = strtotime($coupon->achieved_time);
        	$result[''.$key] = 1;
        }

        echo CJSON::encode($result);
	}

	/**
	 * 检查编码是否唯一
	 */
	protected function checkCodeIsUnqinue($activityId, $code) {
		$criteria = new CDbCriteria();
		//$criteria->compare('activity_id', $activityId);
		$criteria->compare('code', $code);
		$criteria->compare('archived', 1);

		$results = Coupon::model()->findAll($criteria);

		$unique = true;
		if (count($results) > 0) {
			$unique = false;
		}
		return $unique;
	}

	/*
	 * 检查OPEN_ID是否唯一
	 */
	protected function checkOpenIdIsUnqinue($activityId, $openId) {
		$criteria = new CDbCriteria();
		$criteria->compare('activity_id', $activityId);
		$criteria->compare('open_id', $openId);
		$criteria->compare('archived', 1);

		$results = Coupon::model()->findAll($criteria);

		$unique = true;
		if (count($results) > 0) {
			$unique = false;
		}
		return $unique;
	}
	

	/**
	 * 新增优惠券信息
	 * POST /api/activity/{activityId}/coupon
	 */
	public function actionRestcreate() {
		$this->checkRestAuth();

		// check activity
		$activity = Activity::model()->findByPk($_GET['activityId']);
		if ($activity == null || $activity->archived == 0) {
			return $this->sendResponse(404, 'activity is not found');
		}

		if (!isset($_POST['batch']) || !isset($_POST['code'])) {
			return $this->sendResponse(400, "missed parameters");
		}

		// 判断code是否唯一
		if (!$this->checkCodeIsUnqinue($activity->id, $_POST['code'])) {
			return $this->sendResponse(400, 'code is not unique');
		}

		$coupon = new Coupon;
		$coupon->activity_id = $activity->id;
		$coupon->batch = $_POST['batch'];
		$coupon->code = $_POST['code'];

		if (isset($_POST['createdBy'])) {
			$coupon->created_by = $_POST['createdBy'];
		}

		if ($coupon->save()) {
			$this->sendResponse(201, $coupon->id);
		} else {
			$this->sendResponse(500, 'failed to create.');
		}
	}

	/**
	 * 某名优惠券数据
	 * GET /api/activity/{activityId}/coupon/{id}
	 */
	public function actionRestget() {
		$this->checkRestAuth();
		$id = $_GET['id'];
		if (!isset($id)) {
			return $this->sendResponse(404, 'id is not provided.');
		}
		$coupon = Coupon::model()->findByPk($id);
		if ($coupon == null || $coupon->archived == 0) {
			return $this->sendResponse(400, 'coupon is not found.');
		}
		echo CJSON::encode($this->JSONMapper($coupon));
	}

	/**
	 * 更新优惠券信息
	 * POST /api/activity/{activityId}/coupon/{couponId}
	 */
	public function actionRestupdate() {
		$this->checkRestAuth();

		// check activity
		$activity = Activity::model()->findByPk($_GET['activityId']);
		if ($activity == null || $activity->archived == 0) {
			return $this->sendResponse(404, 'activity is not found');
		}

		$coupon = Coupon::model()->findByPk($_GET['couponId']);
		if ($coupon == null || $coupon->archived == 0) {
			return $this->sendResponse(404, 'coupon is not found');
		}

		if (isset($_POST['name'])) {
			$coupon->name = $_POST['name'];
		}

		if (isset($_POST['openId'])) {
			// 判断新的code是否唯一
			if ( $coupon->open_id != $_POST['openId'] && 
				!$this->checkOpenIdIsUnqinue($activity->id, $_POST['openId'])) {
				return $this->sendResponse(400, 'open id is not unique');
			}
			$coupon->openId = $_POST['openId'];
		}

		if (isset($_POST['updatedBy'])) {
			$coupon->updated_by = $_POST['updatedBy'];
		}

		if ($coupon->save()) {
			$this->sendResponse(200, 'updated.');
		} else {
			$this->sendResponse(500, 'failed to update.');
		}
	}

	/**
	 * 删除优惠券信息
	 * DELETE /api/activity/{activityId}/coupon/{couponId}
	 */
	public function actionRestremove() {
		$this->checkRestAuth();

		$coupon = Coupon::model()->findByPk($_GET['couponId']);
		if ($coupon == null || $coupon->archived == 0) {
			return $this->sendResponse(404, 'coupon is not found');
		}

		$coupon->archived = 0;
		$coupon->code = $coupon->code.'-removed-'.$coupon->id; // 删除以后 编码需要释放

		if ($coupon->save()) {
			$this->sendResponse(200, 'removed.');
		} else {
			$this->sendResponse(500, 'failed to remove.');
		}
	}
}
