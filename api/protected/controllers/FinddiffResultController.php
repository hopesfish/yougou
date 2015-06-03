<?php

class FinddiffResultController extends Controller {


    protected function JSONMapper($item) {

        $newitem = array();
        $newitem['id'] = $item->id;
        $newitem['subOpenId'] = $item->sub_open_id;
        $newitem['bonus'] = (int)$item->bonus;
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
        Post api/activity/finddiff/{finddiffId}/result 
        投票
    */
    public function actionRestcreate() {
        $this->checkRestAuth();

        if (!isset($_GET['finddiffId']) ||
            !isset($_POST['subOpenId']) ||
            //!isset($_POST['nickname']) ||
            //!isset($_POST['headimgurl']) ||
            !isset($_POST['bonus'])) {
            return $this->sendResponse(400, 'missed required properties');
        }

        if (!is_numeric($_POST['bonus'])) {
            return $this->sendResponse(400, 'bonus should be number');
        }

        $finddiff = Finddiff::model()->findByPk($_GET['finddiffId']);
        if ($finddiff == null) {
            $this->sendResponse(404, 'not found');
        }

        $criteria = new CDbCriteria();
        $criteria->addCondition('finddiff_id=:finddiffId', 'and');
        $criteria->addCondition('sub_open_id=:sub_open_id');
        $criteria->params = array(':sub_open_id' => $_POST['subOpenId'], ':finddiffId' => $_GET['finddiffId']);
        $results = FinddiffResult::model()->findAll($criteria);

        $result = 0;

        if (count($results) > 0) {
            $result = $results[0];
        } else {
            // create result
            $result = new FinddiffResult();
            $result->finddiff_id = $_GET['finddiffId'];
            $result->sub_open_id = $_POST['subOpenId'];
            $result->bonus = 0;
            $result->save();
        }

        if (isset($_POST['nickname'])) {
            $result->nickname = $_POST['nickname'];
        }

        if (isset($_POST['headimgurl'])) {
            $result->headimgurl = $_POST['headimgurl'];
        }

        if (intval($_POST['bonus']) > intval($result->bonus)) {
            if (intval($_POST['bonus']) > 35) {
                $result->bonus = 1;
            } else {
                $diff = intval($_POST['bonus']) - intval($result->bonus);
                if ($diff < 35) {
                    $finddiff->bonus += $diff;
                    $result->bonus = intval($_POST['bonus']);
                }
            }
        }

        if (!$result->save()) {
            return $this->sendResponse(500, 'faild to save result');
        }
        
        if (!$finddiff->save()) {
            return $this->sendResponse(500, 'faild to save finddiff');
        }

        $this->sendResponse(201, $result->id);
    }

    /**
     * 助力数据
     * GET api/activity/finddiff/{finddiffId}/result 
     */
    public function actionRestlist() {
        $this->checkRestAuth();

        $finddiff = Finddiff::model()->findByPk($_GET['finddiffId']);
        if ($finddiff == null) {
            $this->sendResponse(404, 'not found');
        }

        $criteria = new CDbCriteria();
        $take = 1000;
        $criteria->compare('finddiff_id', $finddiff->id);
        
        $criteria->limit = $take;
        $criteria->offset = 0;
        $criteria->order = 'created_time DESC';

        $result = FinddiffResult::model()->findAll($criteria);

        $json = new JsonData();
        $json->limit = $take;
        $json->total = (int)FinddiffResult::model()->count($criteria);
        $json->result = $this->JSONArrayMapper($result);

        echo CJSON::encode($json);
    }
}

?>