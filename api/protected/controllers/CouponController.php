<?php
class CouponController extends Controller
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
        	$criteria->compare('code', $_GET['code']);
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

	/**
	 * 通过活动编码和OpenId获得优惠券
	 * GET /api/coupon/achieve
	 */
	public function actionRestachieve() {
		$this->checkRestAuth();

		// 检查参数
		if (!isset($_GET['code']) || !isset($_GET['openId'])) {
			return $this->sendResponse(400, 'missed parameters');
		}

		$openId = $_GET['openId'];

		// 结果对象
		$result = array(
			'activities' => array(),
			'coupons' => array()
		);

		// 判断活动当前状态
		$criteria = new CDbCriteria();
		$criteria->compare('code', $_GET['code']);
        $criteria->compare('archived', 1);
        $criteria->limit = 1;
        $criteria->order = 'created_time desc';

        $activities = Activity::model()->findAll($criteria);
        $activity;
        // 找不到
        if (count($activities) != 1) {
        	echo CJSON::encode($result);
        	return;
        } else {
        	$result['activities'] = $activities;
        	$activity = $activities[0];
        	// 暂停状态
        	if ($activity->enabled == 0) {
        		echo CJSON::encode($result);
        		return;
        	}
        }
        
        // 先判断是否已领取
        $criteria = new CDbCriteria();
        $criteria->compare('archived', 1);
        $criteria->compare('open_id', $openId);
        $criteria->order = 'achieved_time desc';
        $criteria->limit = 1;

        $achieves = array();
        $isRestricted = false;

        if (intval($activity->restrict_days) > 0) {
        	// 如果已经领过优惠券,且不符合该活动有N天限制,不可以领取
        	$achieves = Coupon::model()->findAll($criteria);
            if (count($achieves) > 0) {
                if ((time() - strtotime($achieves[0]->achieved_time)) < (intval($activity->restrict_days) * 60 * 60 * 24)) {
        			$isRestricted = true;
                }
            }
        } 

    	$criteria->compare('activity_id', $activity->id);
    	$achieves = Coupon::model()->findAll($criteria);
    	$result['coupons'] = $achieves;

        // 判断是否还可以继续领取
        if ($isRestricted || count($achieves) > 0) {
        	echo CJSON::encode($result);
    		return;
        }

        // 再判断有没有优惠券
        $criteria = new CDbCriteria();
        $criteria->compare('archived', 1);
        $criteria->addCondition('achieved_time IS NULL');
        $criteria->addCondition('open_id IS NULL');
        $criteria->compare('activity_id', $activity->id);
        $criteria->limit = 10;
        
        $coupons = Coupon::model()->findAll($criteria);
        
        if (count($coupons) == 0) {
        	echo CJSON::encode($result);
        	return;
        }

        // 随机获得优惠券
        $total = count($coupons);
        $offset = 0;

        if ($total > 1) {
            $offset = (int)($total * rand(0, 1));
            if ($offset != 0) {
                $offset -= 1;
            } if ($offset >= $total) {
                $offset = 0;
            }
        }

        // 写入领取记录
        $coupon = $coupons[$offset];
        $coupon->open_id = $openId;
        $coupon->achieved_time = new CDbExpression('NOW()');
        if ($coupon->save()) {
        	array_push($result['coupons'], $coupon);
            echo CJSON::encode($result);
        } else {
        	echo CJSON::encode($result);
        }
	}
}
