<?php

class VoteController extends Controller {


    protected function JSONMapper($item) {

        $newitem = array();
        $newitem['id'] = $item->id;
        $newitem['bonus'] = $item->bonus;
        $newitem['createdTime'] = $item->created_time;

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
        Post api/activity/dream/{dreamId}/vote 
        投票
    */
    public function actionRestcreate() {
        $this->checkRestAuth();

        if (!isset($_GET['dreamId']) || !isset($_POST['subOpenId'])) {
            return $this->sendResponse(400, 'missed required properties');
        }

        $dream = Dream::model()->findByPk($_GET['dreamId']);
        if ($dream == null || $dream->nickname == null) {
            $this->sendResponse(404, 'not found');
        }

        if ($dream->sub_open_id == $_POST['subOpenId']) {
            $this->sendResponse(400, 'forbidden to vote');
        }

        $criteria = new CDbCriteria();
        $criteria->addCondition('dream_id=:dreamId', 'and');
        $criteria->addCondition('sub_open_id=:sub_open_id');
        $criteria->params = array(':sub_open_id' => $_POST['subOpenId'], ':dreamId' => $_GET['dreamId']);
        $results = Vote::model()->findAll($criteria);

        if (count($results) > 0) {
            $this->sendResponse(400, 'voted');
        }

        // create vote
        $vote = new Vote();
        $vote->dream_id = $_GET['dreamId'];
        $vote->sub_open_id = $_POST['subOpenId'];
        $vote->bonus = (int)rand(500, 800); // 5 - 8元之间随机

        if (!$vote->save()) {
            return $this->sendResponse(500, 'faild to save vote');
        }

        $dream->bonus += $vote->bonus;
        if (!$dream->save()) {
            return $this->sendResponse(500, 'faild to save dream');
        }

        $this->sendResponse(201, $vote->id);
    }

    /**
     * 助力数据
     * GET api/activity/dream/{dreamId}/vote 
     */
    public function actionRestlist() {
        $this->checkRestAuth();

        $dream = Dream::model()->findByPk($_GET['dreamId']);
        if ($dream == null || $dream->nickname == null) {
            $this->sendResponse(404, 'not found');
        }

        $criteria = new CDbCriteria();
        $take = 40;
        $criteria->compare('dream_id', $dream->id);
        
        $criteria->limit = $take;
        $criteria->offset = 0;
        $criteria->order = 'created_time DESC';

        $result = Vote::model()->findAll($criteria);

        $json = new JsonData();
        $json->limit = $take;
        $json->total = (int)Vote::model()->count($criteria);
        $json->result = $this->JSONArrayMapper($result);

        echo CJSON::encode($json);
    }
}

?>