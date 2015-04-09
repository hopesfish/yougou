<?php
class FinddiffController extends Controller
{

    protected function JSONMapper($finddiff) {

        $newfinddiff = array();
        $newfinddiff['id'] = $finddiff->id;
        $newfinddiff['nickname'] = $finddiff->nickname;
        $newfinddiff['headimgurl'] = $finddiff->headimgurl;
        $newfinddiff['unionId'] = $finddiff->union_id;
        $newfinddiff['openId'] = $finddiff->open_id;
        $newfinddiff['subOpenId'] = $finddiff->sub_open_id;
        $newfinddiff['bonus'] = $finddiff->bonus;
        $newfinddiff['rank'] = $finddiff->rank;

        return $newfinddiff;
    }

    protected function JSONArrayMapper($finddiffes) {
        $newfinddiffes = array();
        foreach ($finddiffes as $finddiff) {
            array_push($newfinddiffes, $this->JSONMapper($finddiff));
        }
        return $newfinddiffes;
    }

    /**
     * 记录集合数据
     * GET /api/activity/finddiff
     */
    public function actionRestlist() {
        $this->checkRestAuth();

        $criteria = new CDbCriteria();

        if (!isset($_GET['skip'])) {
            $skip = 0;
        } else {
            $skip = $_GET['skip'];
        }

        if (!isset($_GET['take'])) {
            $take = 50;
        } else {
            $take = $_GET['take'];
        }

        if (isset($_GET['nickname'])) {
            $criteria->addSearchCondition('nickname', $_GET['nickname']);
        }

        if (isset($_GET['openId'])) {
            $criteria->compare('open_id', $_GET['openId']);
        }

        if (isset($_GET['unionId'])) {
            $criteria->compare('union_id', $_GET['unionId']);
        }
        
        $criteria->limit = $take;
        $criteria->offset = $skip;
        $criteria->order = 'bonus DESC';


        $result = Finddiff::model()->findAll($criteria);

        $json = new JsonData();
        $json->limit = $take;
        $json->total = (int)Finddiff::model()->count($criteria);
        $json->result = $this->JSONArrayMapper($result);

        echo CJSON::encode($json);
    }

    /**
     * 排名排序
     * GET /api/activity/sort
     */
    public function actionRestsort() {
        $this->checkRestAuth();

        $criteria = new CDbCriteria();

        $criteria->order = 'bonus DESC';

        $items = Finddiff::model()->findAll($criteria);

        $rank = 389;
        foreach ($items as $item) {
            $item->rank = $rank;
            $rank++;
        }
        /*
        foreach ($items as $item) {
            $item->rank = $rank;
            $item->save();
            if ($rank == 1) {
                $rank = 6;
            } else if ($rank == 7){
                $rank = 11;
            } else if ($rank == 13){
                $rank = 31;
            } else {
                $rank++;
            }
        }*/

        $this->sendResponse(200, 'ok');
    }

    /**
     * 排行榜
     * GET /api/activity/finddiff/rank
     */
    public function actionRestrank() {
        $this->checkRestAuth();

        $criteria = new CDbCriteria();

        $criteria->limit = 200;
        $criteria->offset = 0;
        $criteria->order = 'rank DESC';


        $result = Finddiff::model()->findAll($criteria);

        $json = new JsonData();
        $json->limit = 200;
        $json->total = (int)Finddiff::model()->count($criteria);
        $json->result = $this->JSONArrayMapper($result);

        echo CJSON::encode($json);
    }

    /* 
     * 发起记录
     * GET /api/activity/finddiff/start?openId=xxx
     */
    public function actionReststart() {
        $this->checkRestAuth();
        
        //判断是否全部填写
        if (!isset($_GET['unionId'])) {
            return $this->sendResponse(400, 'missed required properties');
        }
        $unionId = $_GET['unionId'];

        // 查询是否已经生成
        $criteria = new CDbCriteria();
        $criteria->compare("union_id", $unionId);

        $finddiffes = Finddiff::model()->findAll($criteria);
        $finddiff = null;

        if (count($finddiffes) == 0) {
            $finddiff = new Finddiff();
            $finddiff->union_id = $unionId;
            $finddiff->bonus = 0; // 使用分为计量单位,从零开始
            $finddiff->rank = Finddiff::model()->count(new CDbCriteria()) + 1;

            if (!$finddiff->save()) {
                return $this->sendResponse(500, 'faild to save finddiff');
            }
        }  else {
            $finddiff = $finddiffes[0];
        }

        echo CJSON::encode($this->JSONMapper($finddiff));
    }

    /* 
     * 获得记录
     * GET /api/activity/finddiff/{id}
     */
    public function actionRestget() {
        $this->checkRestAuth();
        
        //判断是否全部填写
        if (!isset($_GET['id'])) {
            return $this->sendResponse(400, 'missed required properties');
        }
        $id = $_GET['id'];

        $finddiff = Finddiff::model()->findByPk($id);

        if ($finddiff == null) {
            return $this->sendResponse(404, 'faild to get');
        }

        echo CJSON::encode($this->JSONMapper($finddiff));
    }

    /* 
     * 更新记录
     * POST /api/activity/finddiff/{id}
     */
    public function actionRestupdate() {
        $this->checkRestAuth();
        
        //判断是否全部填写
        if (!isset($_POST['subOpenId']) || !isset($_POST['headimgurl']) || !isset($_POST['nickname'])) {
            return $this->sendResponse(400, 'missed required properties');
        }

        // 查询是否已经生成
        $finddiff = Finddiff::model()->findByPk($_GET['finddiffId']);

        if ($finddiff == null) {
            return $this->sendResponse(404, 'not found');
        }

        // 只允许提交一次
        if ($finddiff->sub_open_id == null) {
            $finddiff->sub_open_id = $_POST['subOpenId'];
            $finddiff->headimgurl = $_POST['headimgurl'];
            $finddiff->nickname = $_POST['nickname'];
        }

        if (!$finddiff->save()) {
            return $this->sendResponse(500, 'faild to save finddiff');
        }

        echo CJSON::encode($this->JSONMapper($finddiff));
    }
}
