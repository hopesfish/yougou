<?php

class XmasVoteController extends Controller {


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
        Post api/activity/xmas/{xmasId}/vote 
        投票
    */
    public function actionRestcreate() {
        $this->checkRestAuth();

        if (!isset($_GET['xmasId']) ||!isset($_POST['subOpenId'])) {
            return $this->sendResponse(400, 'missed required properties');
        }

        $xmas = Xmas::model()->findByPk($_GET['xmasId']);
        if ($xmas == null || $xmas->nickname == null) {
            $this->sendResponse(404, 'not found');
        }

        if ($xmas->sub_open_id == $_POST['subOpenId']) {
            $this->sendResponse(400, 'forbidden to vote');
        }

        $criteria = new CDbCriteria();
        $criteria->addCondition('xmas_id=:xmasId', 'and');
        $criteria->addCondition('sub_open_id=:sub_open_id');
        $criteria->params = array(':sub_open_id' => $_POST['subOpenId'], ':xmasId' => $_GET['xmasId']);
        $results = XmasVote::model()->findAll($criteria);

        if (count($results) > 0) {
            $this->sendResponse(400, 'voted');
        }

        // create vote
        $vote = new XmasVote();
        $vote->xmas_id = $_GET['xmasId'];
        $vote->sub_open_id = $_POST['subOpenId'];
        $vote->nickname = $_POST['nickname'];
        $vote->headimgurl = $_POST['headimgurl'];
        $vote->bonus = (int)rand(100, 500); // 3 - 5元之间随机

        if (!$vote->save()) {
            return $this->sendResponse(500, 'faild to save vote');
        }

        $xmas->bonus += $vote->bonus;
        if (!$xmas->save()) {
            return $this->sendResponse(500, 'faild to save xmas');
        }

        $this->sendResponse(201, $vote->id);
    }

    /**
     * 助力数据
     * GET api/activity/xmas/{xmasId}/vote 
     */
    public function actionRestlist() {
        $this->checkRestAuth();

        $xmas = Xmas::model()->findByPk($_GET['xmasId']);
        if ($xmas == null || $xmas->nickname == null) {
            $this->sendResponse(404, 'not found');
        }

        $criteria = new CDbCriteria();
        $take = 100;
        $criteria->compare('xmas_id', $xmas->id);
        
        $criteria->limit = $take;
        $criteria->offset = 0;
        $criteria->order = 'created_time DESC';

        $result = XmasVote::model()->findAll($criteria);

        $json = new JsonData();
        $json->limit = $take;
        $json->total = (int)XmasVote::model()->count($criteria);
        $json->result = $this->JSONArrayMapper($result);

        echo CJSON::encode($json);
    }
}

?>