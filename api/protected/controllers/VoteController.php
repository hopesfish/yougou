<?php

class VoteController extends Controller {


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
            $this->sendResponse(201, '');
        }

        $criteria = new CDbCriteria();
        $criteria->addCondition('dream_id=:dreamId', 'and');
        $criteria->addCondition('sub_open_id=:sub_open_id');
        $criteria->params = array(':sub_open_id' => $_POST['subOpenId'], ':dreamId' => $_GET['dreamId']);
        $results = Vote::model()->findAll($criteria);

        if (count($results) > 0) {
            $this->sendResponse(201, $results[0]->id);
        }

        // create vote
        $vote = new Vote();
        $vote->dream_id = $_GET['dreamId'];
        $vote->sub_open_id = $_POST['subOpenId'];
        $vote->bonus = (int)($total * rand(0, 300));

        if (!$vote->save()) {
            return $this->sendResponse(500, 'faild to save vote');
        }

        $dream->bonus += $vote->bonus;
        if (!$dream->save()) {
            return $this->sendResponse(500, 'faild to save dream');
        }

        $this->sendResponse(201, $vote->id);
    }
}

?>