<?php
Yii::import('application.controllers.BaseController');
class ActivityController extends BaseController
{

    /**
     * mapper the json object.
     */
    protected function JSONMapper($activity) {
        $newactivity = array();

        $newactivity['id'] = $activity->id;
        $newactivity['name'] = $activity->name;
        $newactivity['type'] = (int)$activity->type;
        $newactivity['enabled'] = (int)$activity->enabled;
        $newactivity['reply'] = $activity->reply;
        $newactivity['endReply'] = $activity->end_reply;
        $newactivity['restrictDaysReply'] = $activity->restrict_days_reply;
        $newactivity['restrictDays'] = $activity->restrict_days;
        $newactivity['code'] = $activity->code;
        $newactivity['createdTime'] = $activity->created_time;
        $newactivity['startTime'] = $activity->start_time;
        $newactivity['endTime'] = $activity->end_time;

        return $newactivity;
    }

    /**
     * mapper the json array.
     */
    protected function JSONArrayMapper($persistenceds) {
        $activitys = array();
        foreach ($persistenceds as $activity) {
            if ($activity->archived == 0) { continue; }
            array_push($activitys, $this->JSONMapper($activity));
        }
        return $activitys;
    }

    /**
     * 活动集合数据
     * GET /api/activity
     */
    public function actionRestindex() {
        $this->checkRestAuth();

        // 分页
        $curPage = 1;
        $offset = 0;
        $limit = 500;

        if (isset($_GET['limit'])) {
            $limit = intval($_GET['limit']);
        }
        if (isset($_GET['curPage'])) {
            $curPage = intval($_GET['curPage']);
            $offset = $limit * ($curPage - 1);
        }

        $criteria = new CDbCriteria();
        $criteria->compare('archived', 1);
        $criteria->offset = $offset;
        $criteria->limit = $limit;
        $criteria->order = 'created_time desc';

        if (isset($_GET['id'])) {
            $criteria->compare('id', $_GET['id']);
        }
        if (isset($_GET['name'])) {
            $criteria->addSearchCondition('name', $_GET['name']);
        }
        if (isset($_GET['type'])) {
            $criteria->compare('type', $_GET['type']);
        }
        if (isset($_GET['enabled'])) {
            $criteria->compare('enabled', $_GET['enabled']);
        }
        if (isset($_GET['code'])) {
            $criteria->addSearchCondition('code', $_GET['code']);
        }
        if (isset($_GET['type']) && isset($_GET['code'])) {
        	if (intval($_GET['type']) == 1) {
        		$criteria->compare('code', $_GET['code']);
        	}
        }

        $json = new JsonData();
        $json->total = (int)Activity::model()->count($criteria);
        $json->result = $this->JSONArrayMapper(Activity::model()->findAll($criteria));

        echo CJSON::encode($json);
    }

    protected function findAllByCode($code) {
        $criteria = new CDbCriteria();
        $criteria->compare('code', $code);
        $criteria->compare('archived', 1);

        return Activity::model()->findAll($criteria);
    }

    protected function checkCodeIsUnqinue($code) {
        $criteria = new CDbCriteria();
        $criteria->compare('code', $code);
        $criteria->compare('archived', 1);

        $results = Activity::model()->findAll($criteria);

        $unique = true;
        if (count($results) > 0) {
            $unique = false;
        }
        return $unique;
    }
    /**
     * 新增活动信息
     * POST /api/activity
     */
    public function actionRestcreate() {
        $this->checkRestAuth();

        if (!isset($_POST['name']) || !isset($_POST['type']) || !isset($_POST['code']) || !isset($_POST['reply'])) {
            return $this->sendResponse(400, "missed parameters");
        }

        // 判断code是否唯一
        if (!$this->checkCodeIsUnqinue($_POST['code'])) {
            return $this->sendResponse(400, 'code is not unique');
        }

        $activity = new Activity;
        $activity->name = $_POST['name'];
        $activity->type = (int)$_POST['type'];
        $activity->code = $_POST['code'];
        $activity->reply = $_POST['reply'];

        if (isset($_POST['endReply'])) {
            $activity->end_reply = $_POST['endReply'];
        }

        if (isset($_POST['restrictDays'])) {
            $activity->restrict_days = intval($_POST['restrictDays']);
            if ($activity->restrict_days < 0) {
                $activity->restrict_days = 0;
            } else if ($activity->restrict_days > 9999) {
                $activity->restrict_days = 9999;
            }
        }

        if (isset($_POST['enabled'])) {
            $activity->enabled = $_POST['enabled'];
        }

        if (isset($_POST['restrictDaysReply'])) {
            $activity->restrict_days_reply = $_POST['restrictDaysReply'];
        }

        if (isset($_POST['startTime'])) {
            $activity->start_time = $_POST['startTime'];
        }
        if (isset($_POST['endTime'])) {
            $activity->end_time = $_POST['endTime'];
        }
        if (isset($_POST['createdBy'])) {
            $activity->created_by = $_POST['createdBy'];
        }

        if ($activity->save()) {
            $this->sendResponse(201, $activity->id);
        } else {
            $this->sendResponse(500, 'failed to create.');
        }
    }

    /**
     * 某名活动数据
     * GET /api/activity/{id}
     */
    public function actionRestget() {
        $this->checkRestAuth();
        $id = $_GET['id'];
        if (!isset($id)) {
            return $this->sendResponse(404, 'id is not provided.');
        }
        $activity = Activity::model()->findByPk($id);
        if ($activity == null || $activity->archived == 0) {
            return $this->sendResponse(400, 'activity is not found.');
        }
        echo CJSON::encode($this->JSONMapper($activity));
    }

    /**
     * 更新活动信息
     * POST /api/activity/{activityId}
     */
    public function actionRestupdate() {
        $this->checkRestAuth();

        $activity = Activity::model()->findByPk($_GET['activityId']);
        if ($activity == null || $activity->archived == 0) {
            return $this->sendResponse(404, 'activity is not found');
        }

        if (isset($_POST['name'])) {
            $activity->name = $_POST['name'];
        }

        if (isset($_POST['code'])) {
            // 判断新的code是否唯一
            if ($activity->code != $_POST['code'] && !$this->checkCodeIsUnqinue($_POST['code'])) {
                return $this->sendResponse(400, 'code is not unique');
            }
            $activity->code = $_POST['code'];
        }

        if (isset($_POST['reply'])) {
            $activity->reply = $_POST['reply'];
        }

        if (isset($_POST['enabled'])) {
            $activity->enabled = intval($_POST['enabled']);
        }

        if (isset($_POST['endReply'])) {
            $activity->end_reply = $_POST['endReply'];
        }

        if (isset($_POST['restrictDays'])) {
            $activity->restrict_days = intval($_POST['restrictDays']);
            if ($activity->restrict_days < 0) {
                $activity->restrict_days = 0;
            } else if ($activity->restrict_days > 9999) {
                $activity->restrict_days = 9999;
            }
        }

        if (isset($_POST['restrictDaysReply'])) {
            $activity->restrict_days_reply = $_POST['restrictDaysReply'];
        }

        if ($activity->type == 0 && isset($_POST['reply'])) {
            $activity->reply = $_POST['reply'];
        }

        if (isset($_POST['updatedBy'])) {
            $activity->updated_by = $_POST['updatedBy'];
        }

        if ($activity->save()) {
            $this->sendResponse(200, 'updated.');
        } else {
            $this->sendResponse(500, 'failed to update.');
        }
    }

    /**
     * 删除活动信息
     * DELETE /api/activity/{activityId}
     */
    public function actionRestremove() {
        $this->checkRestAuth();

        $activity = Activity::model()->findByPk($_GET['activityId']);
        if ($activity == null || $activity->archived == 0) {
            return $this->sendResponse(404, 'activity is not found');
        }

        $activity->archived = 0;
        $activity->code = $activity->code.'-removed-'.$activity->id; // 删除以后 编码需要释放

        $criteria = new CDbCriteria();
        $criteria->compare('archived', 1);
        $criteria->addCondition('achieved_time IS NULL');
        $criteria->addCondition('open_id IS NULL');
        $criteria->compare('activity_id', $activity->id);
        $criteria->order = 'achieved_time desc';

        $coupns = Coupon::model()->findAll($criteria);
        foreach ($coupns as $coupon) {
            $coupon->archived = 0;
            if (!$coupon->save()) {
                return $this->sendResponse(200, 'failed to update coupon.');
            }
        }

        if ($activity->save()) {
            $this->sendResponse(200, 'removed.');
        } else {
            $this->sendResponse(500, 'failed to remove.');
        }
    }

    /**
     * 获得该活动优惠码
     * GET /api/activity/{activityId}/achieve
     */
    public function actionRestachieve() {
        $this->checkRestAuth();

        $activity = Activity::model()->findByPk($_GET['activityId']);
        if ($activity == null || $activity->archived == 0) {
            return $this->sendResponse(404, 'activity is not found');
        }
        if ($activity->enabled == 0) {
            return $this->sendResponse(404, 'activity is disabled');
        }

        if (!isset($_GET['openId'])) {
            return $this->sendResponse(400, 'open id is required');
        }
        
        // 先判断有没有优惠券
        $criteria = new CDbCriteria();
        $criteria->compare('archived', 1);
        $criteria->addCondition('achieved_time IS NULL');
        $criteria->addCondition('open_id IS NULL');
        $criteria->compare('activity_id', $activity->id);
        $criteria->limit = 1;
        
        $total = Coupon::model()->count($criteria);
        
        if ($total == 0) {
            return $this->sendResponse(400, 'no code');
        }

        $openId = $_GET['openId'];

        // 判断是否可以继续领取
        if (intval($activity->restrict_days) > 0) {
            $criteria = new CDbCriteria();
            $criteria->compare('archived', 1);
            $criteria->compare('open_id', $openId);
            $criteria->addNotInCondition('activity_id', array($activity->id));
            $criteria->order = 'achieved_time desc';
            $criteria->limit = 1;

            $achieves = Coupon::model()->findAll($criteria);
            if (count($achieves) > 0) {
                if ((time() - strtotime($achieves[0]->achieved_time)) < (intval($activity->restrict_days) * 60 * 60 * 24)) {
                    return $this->sendResponse(400, 'you are restricted to archive '.time().' '.strtotime($achieves[0]->achieved_time));
                }
            }
        }

        // 判断是否领取过
        /*
        $criteria = new CDbCriteria();
        $criteria->compare('archived', 1);
        $criteria->compare('open_id', $openId);
        $criteria->compare('activity_id', $activity->id);

        $couponCount = Coupon::model()->count($criteria);
        if ($couponCount > 0) {
            return $this->sendResponse(400, 'you have got one.');
        }*/

        // 再次获取优惠券总数
        $criteria = new CDbCriteria();
        $criteria->compare('archived', 1);
        $criteria->addCondition('achieved_time IS NULL');
        $criteria->addCondition('open_id IS NULL');
        $criteria->compare('activity_id', $activity->id);
        
        $total = Coupon::model()->count($criteria);

         // 随机获得优惠券
        $offset = 0;
        if ($total == 0) {
            return $this->sendResponse(400, 'no code');
        } else if ($total == 1) {
            $offset = 0;
        } else if ($total > 1) {
            $offset = (int)($total * rand(0, 1));
            if ($offset != 0) {
                $offset -= 1;
            } if ($offset >= $total) {
                $offset = 0;
            }
        }

        $criteria->offset = $offset;
        $criteria->limit = 1;

        // 写入领取记录
        $coupons = Coupon::model()->findAll($criteria);
        $coupon = $coupons[0];
        $coupon->open_id = $openId;
        $coupon->achieved_time = new CDbExpression('NOW()');
        if ($coupon->save()) {
            $array = array();
            array_push($array, $coupon->code);
            echo CJSON::encode($array);
        } else {
            return $this->sendResponse(500, "failed");
        }

    }
}
























