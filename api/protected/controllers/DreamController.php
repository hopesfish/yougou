<?php

class DreamController extends Controller {


    /**
     * mapper the data into json object
     */
    protected function JSONMapper($dream) {

        $newdream = array();
        $newdream['id'] = $dream->id;
        $newdream['name'] = $dream->name;
        $newdream['gender'] = intval($dream->gender);
        $newdream['school'] = $dream->school;
        $newdream['mobile'] = $dream->mobile;
        $newdream['dream'] = $dream->dream;
        $newdream['detail'] = $dream->detail;
        $newdream['headimgurl'] = $dream->headimgurl;
        $newdream['open_id'] = $dream->open_id;
        $newdream['nickname'] = $dream->nickname;

        return $newdream;
    }
    protected function JSONArrayMapper($users) {
        $newreplys = array();
        foreach ($users as $user) {
            array_push($newreplys, $this->JSONMapper($user));
        }
        return $newreplys;
    }

    /* GET: api/activity/dream 
        获取所有梦想盒伙人的信息
    */
    public function actionRestlist() {
        $criteria = new CDbCriteria();
        $criteria->order = 'created_time DESC';


        $result = Dream::model()->findAll($criteria);

        $json = new JsonData();
        $json->limit = 0;
        $json->total = Dream::model()->count($criteria);
        $json->result = $this->JSONArrayMapper($result);

        //echo CJSON::encode($result);
        echo CJSON::encode($json);
    }

    /*  GET  api/activity/dream/paging?skip=0&take=5
        返回梦想盒伙人的分页记录
    */

    public function actionRestlistpaging() {
        if (!isset($_GET['skip'])) {
            $skip = 0;
        } else {
            $skip = $_GET['skip'];
        }

        if (!isset($_GET['take'])) {
            $take = 10;
        } else {
            $take = $_GET['take'];
        }

        $criteria = new CDbCriteria();
        $criteria->limit = $take;
        $criteria->offset = $skip;
        $criteria->order = 'created_time DESC';


        $result = Dream::model()->findAll($criteria);

        $json = new JsonData();
        $json->limit = $take;
        $json->total = Dream::model()->count($criteria);
        $json->result = $this->JSONArrayMapper($result);

        //echo CJSON::encode($result);
        echo CJSON::encode($json);
    }

    /* POST : api/activity/dream 
        填写表单
    */
    public function actionRestcreate() {
        //$this->checkRestAuth();
        
        //判断是否全部填写
        if (!isset($_POST['name']) || !isset($_POST['gender']) || !isset($_POST['school']) || 
            !isset($_POST['mobile']) || !isset($_POST['dream']) || 
            !isset($_POST['detail']) || !isset($_POST['openid']) || !isset($_POST['headimgurl']) || 
            !isset($_POST['nickname'])) {
            return $this->sendResponse(400, 'missed required properties');
        }

        $dream = new Dream();
        $dream->name = $_POST['name'];
        $dream->gender = $_POST['gender'];
        $dream->school = $_POST['school'];
        $dream->mobile = $_POST['mobile'];
        $dream->dream = $_POST['dream'];
        $dream->detail = $_POST['detail'];
        $dream->headimgurl = $_POST['headimgurl'];
        $dream->nickname = $_POST['nickname'];
        $dream->open_id = $_POST['openid'];


        $criteria = new CDbCriteria();
        $criteria->condition = 'open_id=:openid and isdel=0';
        $criteria->params = array(':openid' => $_POST['openid']);
        $result = Dream::model()->exists($criteria);
        if ($result) {
            return $this->sendResponse(400, 'exists');
        }

        if (!$dream->save()) {
            return $this->sendResponse(500, 'faild to save dream');
        }

        if (!isset($_POST['ip_address'])) {
            $ip = '';
        } else {
            $ip = $_POST['ip_address'];
        }
        $vote = new Vote();
        $vote->dream_id = $dream->id;
        $vote->level = 1;
        $vote->open_id = $_POST['openid'];
        $vote->ip_address = $ip;
        $vote->vote_at = time();
        if(!$vote->save()) {
            return $this->sendResponse(500, 'faild to save vote');
        }

        //跳转到详情页
         $this->sendResponse(201, $dream->id);

    }


    /* GET : api/activity/dream/{dreamId} 
        获取盒伙人信息
    */
    public function actionRestget() {
        //$this->checkRestAuth();

        if (!isset($_GET['dreamId'])) {
            return $this->sendResponse(404, 'id is not provided.');
        }

        $dream = Dream::model()->findByPk($_GET['dreamId']);
        if($dream == null || $dream->isdel == 1) {
            return $this->sendResponse(404, 'dream is not found.');
        }

        echo CJSON::encode($this->JSONMapper($dream));
    }

    public function actionRestgetbyopenid() {

        if (!isset($_GET['openid'])) {
            return $this->sendResponse(404, 'id is not provided.');
        }

        $criteria = new CDbCriteria();
        $criteria->addCondition('open_id=:openid', 'and');
        $criteria->addCondition('isdel=0');

        $criteria->params = array(':openid' => $_GET['openid']);

        $dreams = Dream::model()->findAll($criteria);
        if(count($dreams) == 1) {
            echo CJSON::encode($dreams[0]);
        } else {
            $this->sendResponse(404, 'not found');            
        }

        //$this->sendResponse(201, $dream);
        //echo $dream;
    }

    public function actionResetdelete() {
        if (!isset($_GET['dreamId'])) {
            return $this->sendResponse(404, 'dreamid not found');
        }

        $dream = Dream::model()->findByPk($_GET['dreamId']);
        if ($dream) {
            $dream->isdel = 1;
            $dream->open_id = 'del-'.$dream->id.'-'.$dream->open_id;
            if (!$dream->update()) {
                $this->sendResponse(500, 'fail');
            } else {
                $this->sendResponse(200, 'success');
            }
        } else {
            $this->sendResponse(404, 'dreamId not found');
        }
    }
}
?>