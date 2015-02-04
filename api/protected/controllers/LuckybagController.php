<?php
class LuckybagController extends Controller
{

    protected function JSONMapper($luckybag) {

        $newluckybag = array();
        $newluckybag['id'] = $luckybag->id;
        $newluckybag['nickname'] = $luckybag->nickname;
        $newluckybag['headimgurl'] = $luckybag->headimgurl;
        $newluckybag['openId'] = $luckybag->open_id;
        $newluckybag['subOpenId'] = $luckybag->sub_open_id;
        $newluckybag['bonus'] = (int)$luckybag->bonus;
        $newluckybag['exchange'] = (int)$luckybag->exchange;

        return $newluckybag;
    }

    protected function JSONArrayMapper($luckybags) {
        $newluckybags = array();
        foreach ($luckybags as $luckybag) {
            array_push($newluckybags, $this->JSONMapper($luckybag));
        }
        return $newluckybags;
    }

    /**
     * 福袋集合数据
     * GET /api/activity/luckybag
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
        
        $criteria->limit = $take;
        $criteria->offset = $skip;
        $criteria->order = 'updated_time DESC';


        $result = Luckybag::model()->findAll($criteria);

        $json = new JsonData();
        $json->limit = $take;
        $json->total = (int)Luckybag::model()->count($criteria);
        $json->result = $this->JSONArrayMapper($result);

        echo CJSON::encode($json);
    }

    /**
     * 福袋领取单
     * GET /api/activity/luckybag/rank
     */
    public function actionRestrank() {
        $this->checkRestAuth();

        // 活动
        $criteria = new CDbCriteria();
        $criteria->compare('code', '2015ACODEFORGREETINGFROMWEIXIN');
        $criteria->compare('archived', 1);

        $activities = Activity::model()->findAll($criteria);

        if (count($activities) == 0) {
            return $this->sendResponse(400, "no code");
        }

        // 已领的奖品
        $criteria = new CDbCriteria();
        $criteria->compare('activity_id', $activities[0]->id);
        $criteria->compare('archived', 1);
        $criteria->addCondition('open_id IS NOT NULL');
        $criteria->order = 'achieved_time desc';
        $criteria->limit = 100;
        $prizes = Coupon::model()->findAll($criteria);

        $openIds = array();
        foreach ($prizes as $prize) {
            array_push($openIds, $prize->open_id);
        }

        // 获奖人
        $criteria = new CDbCriteria();
        $criteria->addInCondition('open_id', $openIds);
        $result = Luckybag::model()->findAll($criteria);
        $winners = $this->JSONArrayMapper($result);

        /*
        $idx = 0;
        foreach ($winners as $winner) {
            foreach ($prizes as $prize) {
                if ($winner['openId'] == $prize->open_id) {
                    $winners[$idx]['prize'] = $prize->code;
                }
            }
            $idx++;
        }*/

        echo CJSON::encode($winners);
    }

    /* 
     * 发起福袋
     * GET /api/activity/luckybag/start?openId=xxx
     */
    public function actionReststart() {
        $this->checkRestAuth();
        
        //判断是否全部填写
        if (!isset($_GET['openId'])) {
            return $this->sendResponse(400, 'missed required properties');
        }
        $openId = $_GET['openId'];

        // 查询是否已经生成
        $criteria = new CDbCriteria();
        $criteria->compare("open_id", $openId);

        $luckybags = Luckybag::model()->findAll($criteria);
        $luckybag = null;

        if (count($luckybags) == 0) {
            $luckybag = new Luckybag();
            $luckybag->open_id = $openId;
            $luckybag->bonus = 0; // 使用分为计量单位,从零开始

            if (!$luckybag->save()) {
                return $this->sendResponse(500, 'faild to save luckybag');
            }
        }  else {
            $luckybag = $luckybags[0];
        }

        echo CJSON::encode($this->JSONMapper($luckybag));
    }

    /* 
     * 获得福袋
     * GET /api/activity/luckybag/{id}
     */
    public function actionRestget() {
        $this->checkRestAuth();
        
        //判断是否全部填写
        if (!isset($_GET['id'])) {
            return $this->sendResponse(400, 'missed required properties');
        }
        $id = $_GET['id'];

        $luckybag = Luckybag::model()->findByPk($id);

        if ($luckybag == null) {
            return $this->sendResponse(404, 'faild to get');
        }

        echo CJSON::encode($this->JSONMapper($luckybag));
    }

    /* 
     * 更新福袋
     * POST /api/activity/luckybag/{id}
     */
    public function actionRestupdate() {
        $this->checkRestAuth();
        
        //判断是否全部填写
        if (!isset($_POST['subOpenId']) || !isset($_POST['headimgurl']) || !isset($_POST['nickname'])) {
            return $this->sendResponse(400, 'missed required properties');
        }

        // 查询是否已经生成
        $luckybag = Luckybag::model()->findByPk($_GET['luckybagId']);

        if ($luckybag == null) {
            return $this->sendResponse(404, 'not found');
        }

        $luckybag->sub_open_id = $_POST['subOpenId'];
        $luckybag->headimgurl = $_POST['headimgurl'];
        $luckybag->nickname = $_POST['nickname'];

        if (!$luckybag->save()) {
            return $this->sendResponse(500, 'faild to save luckybag');
        }

        echo CJSON::encode($this->JSONMapper($luckybag));
    }

    /* 
     * 兑换福袋
     * POST /api/activity/luckybag/{id}/actions/exchange
     */
    public function actionRestexchange() {
        $this->checkRestAuth();
        
        //判断是否全部填写
        if (!isset($_POST['bag'])) {
            return $this->sendResponse(400, 'missed required properties');
        }

        // 查询是否已经生成
        $luckybag = Luckybag::model()->findByPk($_GET['luckybagId']);

        if ($luckybag == null) {
            return $this->sendResponse(404, 'not found');
        }

        if ($luckybag->exchange == 1) {
            return $this->sendResponse(400, 'exchanged');
        }

        $luckybag->exchange = 1;
        $luckybag->exchange_bag = $_POST['bag'];

        if (!$luckybag->save()) {
            return $this->sendResponse(500, 'faild to save luckybag');
        }

        echo CJSON::encode($this->JSONMapper($luckybag));
    }
}
