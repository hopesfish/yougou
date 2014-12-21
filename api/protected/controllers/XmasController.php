<?php
class XmasController extends Controller
{

    protected function JSONMapper($xmas) {

        $newxmas = array();
        $newxmas['id'] = $xmas->id;
        $newxmas['nickname'] = $xmas->nickname;
        $newxmas['headimgurl'] = $xmas->headimgurl;
        $newxmas['openId'] = $xmas->open_id;
        $newxmas['subOpenId'] = $xmas->sub_open_id;
        $newxmas['bonus'] = $xmas->bonus;

        return $newxmas;
    }

    protected function JSONArrayMapper($xmases) {
        $newxmases = array();
        foreach ($xmases as $xmas) {
            array_push($newxmases, $this->JSONMapper($xmas));
        }
        return $newxmases;
    }

    /**
     * 梦想集合数据
     * GET /api/activity/xmas
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
        $criteria->order = 'bonus DESC';


        $result = Xmas::model()->findAll($criteria);

        $json = new JsonData();
        $json->limit = $take;
        $json->total = (int)Xmas::model()->count($criteria);
        $json->result = $this->JSONArrayMapper($result);

        echo CJSON::encode($json);
    }

    /**
     * 获奖人
     * GET /api/activity/xmas/winner
     */
    public function actionRestwinner() {
        $this->checkRestAuth();

        // 活动
        $criteria = new CDbCriteria();
        $criteria->compare('code', '2014ACODEFORXMASFROMWEIXIN');
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
        $prizes = Coupon::model()->findAll($criteria);

        $openIds = array();
        foreach ($prizes as $prize) {
            array_push($openIds, $prize->open_id);
        }

        // 获奖人
        $criteria = new CDbCriteria();
        $criteria->addInCondition('open_id', $openIds);
        $result = Xmas::model()->findAll($criteria);
        $winners = $this->JSONArrayMapper($result);

        $idx = 0;
        foreach ($winners as $winner) {
            foreach ($prizes as $prize) {
                if ($winner['openId'] == $prize->open_id) {
                    $winners[$idx]['prize'] = $prize->code;
                }
            }
            $idx++;
        }

        echo CJSON::encode($winners);
    }

    /* 
     * 发起梦想
     * GET /api/activity/xmas/start?openId=xxx
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

        $xmases = Xmas::model()->findAll($criteria);
        $xmas = null;

        if (count($xmases) == 0) {
            $xmas = new Xmas();
            $xmas->open_id = $openId;
            $xmas->bonus = 0; // 使用分为计量单位,从零开始

            if (!$xmas->save()) {
                return $this->sendResponse(500, 'faild to save xmas');
            }
        }  else {
            $xmas = $xmases[0];
        }

        echo CJSON::encode($this->JSONMapper($xmas));
    }

    /* 
     * 获得梦想
     * GET /api/activity/xmas/{id}
     */
    public function actionRestget() {
        $this->checkRestAuth();
        
        //判断是否全部填写
        if (!isset($_GET['id'])) {
            return $this->sendResponse(400, 'missed required properties');
        }
        $id = $_GET['id'];

        $xmas = Xmas::model()->findByPk($id);

        if ($xmas == null) {
            return $this->sendResponse(404, 'faild to get');
        }

        echo CJSON::encode($this->JSONMapper($xmas));
    }

    /* 
     * 更新梦想
     * POST /api/activity/xmas/{id}
     */
    public function actionRestupdate() {
        $this->checkRestAuth();
        
        //判断是否全部填写
        if (!isset($_POST['subOpenId']) || !isset($_POST['headimgurl']) || !isset($_POST['nickname'])) {
            return $this->sendResponse(400, 'missed required properties');
        }

        // 查询是否已经生成
        $xmas = Xmas::model()->findByPk($_GET['xmasId']);

        if ($xmas == null) {
            return $this->sendResponse(404, 'not found');
        }

        $xmas->sub_open_id = $_POST['subOpenId'];
        $xmas->headimgurl = $_POST['headimgurl'];
        $xmas->nickname = $_POST['nickname'];

        if (!$xmas->save()) {
            return $this->sendResponse(500, 'faild to save xmas');
        }

        echo CJSON::encode($this->JSONMapper($xmas));
    }
}
