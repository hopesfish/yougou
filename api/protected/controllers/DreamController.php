<?php
class DreamController extends Controller
{

    protected function JSONMapper($dream) {

        $newdream = array();
        $newdream['id'] = $dream->id;
        $newdream['nickname'] = $dream->nickname;
        $newdream['headimgurl'] = $dream->headimgurl;
        $newdream['openId'] = $dream->open_id;
        $newdream['subOpenId'] = $dream->sub_open_id;
        $newdream['bonus'] = $dream->bonus;

        return $newdream;
    }

    protected function JSONArrayMapper($dreams) {
        $newdreams = array();
        foreach ($dreams as $dream) {
            array_push($newdreams, $this->JSONMapper($dream));
        }
        return $newdreams;
    }

    /**
     * 梦想集合数据
     * GET /api/activity/dream
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


        $result = Dream::model()->findAll($criteria);

        $json = new JsonData();
        $json->limit = $take;
        $json->total = (int)Dream::model()->count($criteria);
        $json->result = $this->JSONArrayMapper($result);

        echo CJSON::encode($json);
    }

    /* 
     * 发起梦想
     * GET /api/activity/dream/start?openId=xxx
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

        $dreams = Dream::model()->findAll($criteria);
        $dream = null;

        if (count($dreams) == 0) {
            $dream = new Dream();
            $dream->open_id = $openId;
            $dream->bonus = 8800; // 使用分为计量单位,

            if (!$dream->save()) {
                return $this->sendResponse(500, 'faild to save dream');
            }
        }  else {
            $dream = $dreams[0];
        }

        echo CJSON::encode($this->JSONMapper($dream));
    }

    /* 
     * 获得梦想
     * GET /api/activity/dream/{id}
     */
    public function actionRestget() {
        $this->checkRestAuth();
        
        //判断是否全部填写
        if (!isset($_GET['id'])) {
            return $this->sendResponse(400, 'missed required properties');
        }
        $id = $_GET['id'];

        $dream = Dream::model()->findByPk($id);

        if ($dream == null) {
            return $this->sendResponse(404, 'faild to get');
        }

        echo CJSON::encode($this->JSONMapper($dream));
    }

    /* 
     * 更新梦想
     * POST /api/activity/dream/{id}
     */
    public function actionRestupdate() {
        $this->checkRestAuth();
        
        //判断是否全部填写
        if (!isset($_POST['subOpenId']) || !isset($_POST['headimgurl']) || !isset($_POST['nickname'])) {
            return $this->sendResponse(400, 'missed required properties');
        }

        // 查询是否已经生成
        $dream = Dream::model()->findByPk($_GET['dreamId']);

        if ($dream == null) {
            return $this->sendResponse(404, 'not found');
        }

        $dream->sub_open_id = $_POST['subOpenId'];
        $dream->headimgurl = $_POST['headimgurl'];
        $dream->nickname = $_POST['nickname'];

        if (!$dream->save()) {
            return $this->sendResponse(500, 'faild to save dream');
        }

        echo CJSON::encode($this->JSONMapper($dream));
    }
}
