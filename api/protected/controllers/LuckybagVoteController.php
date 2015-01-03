<?php

class LuckybagVoteController extends Controller {


    protected function JSONMapper($item) {

        $newitem = array();
        $newitem['id'] = $item->id;
        $newitem['bonus'] = $item->bonus;
        $newitem['createdTime'] = $item->created_time;
        $newitem['headimgurl'] = $item->headimgurl;
        $newitem['nickname'] = $item->nickname;

        return $newitem;
    }

    protected function JSONArrayMapper($items) {
        $newitems = array();
        foreach ($items as $item) {
            array_push($newitems, $this->JSONMapper($item));
        }
        return $newitems;
    }

    /*
        Post api/activity/luckybag/{luckybagId}/vote 
        投票
    */
    public function actionRestcreate() {
        $this->checkRestAuth();

        if (!isset($_GET['luckybagId']) ||!isset($_POST['subOpenId'])) {
            return $this->sendResponse(400, 'missed required properties');
        }

        $luckybag = Luckybag::model()->findByPk($_GET['luckybagId']);
        if ($luckybag == null || $luckybag->nickname == null) {
            $this->sendResponse(404, 'not found');
        }

        if ($luckybag->sub_open_id == $_POST['subOpenId']) {
            $this->sendResponse(400, 'forbidden to vote');
        }

        $criteria = new CDbCriteria();
        $criteria->addCondition('luckybag_id=:luckybagId', 'and');
        $criteria->addCondition('sub_open_id=:sub_open_id');
        $criteria->params = array(':sub_open_id' => $_POST['subOpenId'], ':luckybagId' => $_GET['luckybagId']);
        $results = LuckybagVote::model()->findAll($criteria);

        if (count($results) > 0) {
            $this->sendResponse(400, 'voted');
        }

        // create vote
        $vote = new LuckybagVote();
        $vote->luckybag_id = $_GET['luckybagId'];
        $vote->sub_open_id = $_POST['subOpenId'];
        $vote->nickname = $_POST['nickname'];
        $vote->headimgurl = $_POST['headimgurl'];
        $vote->bonus = 1;

        if (!$vote->save()) {
            return $this->sendResponse(500, 'faild to save vote');
        }

        $luckybag->bonus += $vote->bonus;
        if (!$luckybag->save()) {
            return $this->sendResponse(500, 'faild to save luckybag');
        }

        $this->sendResponse(201, $vote->id);
    }

    /**
     * 助力数据
     * GET api/activity/luckybag/{luckybagId}/vote 
     */
    public function actionRestlist() {
        $this->checkRestAuth();

        $luckybag = Luckybag::model()->findByPk($_GET['luckybagId']);
        if ($luckybag == null || $luckybag->nickname == null) {
            $this->sendResponse(404, 'not found');
        }

        $criteria = new CDbCriteria();
        $take = 100;
        $criteria->compare('luckybag_id', $luckybag->id);
        
        $criteria->limit = $take;
        $criteria->offset = 0;
        $criteria->order = 'created_time DESC';

        $result = LuckybagVote::model()->findAll($criteria);

        $json = new JsonData();
        $json->limit = $take;
        $json->total = (int)LuckybagVote::model()->count($criteria);
        $json->result = $this->JSONArrayMapper($result);

        echo CJSON::encode($json);
    }
}

?>