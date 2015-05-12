<?php
class WxgiftController extends Controller
{

    protected function JSONMapper($wxgift) {

        $newwxgift = array();
        $newwxgift['id'] = $wxgift->id;
        $newwxgift['nickname'] = $wxgift->nickname;
        $newwxgift['headimgurl'] = $wxgift->headimgurl;
        $newwxgift['openId'] = $wxgift->open_id;
        $newwxgift['subOpenId'] = $wxgift->sub_open_id;
        $newwxgift['unionId'] = $wxgift->union_id;
        $newwxgift['shared'] = (int)$wxgift->shared;
        $newwxgift['code'] = $wxgift->code;

        return $newwxgift;
    }

    /* 
     * 发起记录
     * GET /api/activity/wxgift/start?openId=xxx
     */
    public function actionReststart() {
        $this->checkRestAuth();
        
        //判断是否全部填写
        if (!isset($_GET['unionId']) || !isset($_GET['subOpenId']) || 
            !isset($_GET['headimgurl']) || !isset($_GET['nickname'])) {
            return $this->sendResponse(400, 'missed required properties');
        }
        $unionId = $_GET['unionId'];

        // 查询是否已经生成
        $criteria = new CDbCriteria();
        $criteria->compare("union_id", $unionId);
        $criteria->compare("sub_open_id", $_GET['subOpenId']);

        $wxgiftes = Wxgift::model()->findAll($criteria);
        $wxgift = null;

        if (count($wxgiftes) == 0) {
            $wxgift = new Wxgift();
            $wxgift->union_id = $unionId;
            $wxgift->sub_open_id = $_GET['subOpenId'];
            $wxgift->headimgurl = $_GET['headimgurl'];
            $wxgift->nickname = $_GET['nickname'];


            if (!$wxgift->save()) {
                return $this->sendResponse(500, 'faild to save wxgift');
            }
        }  else {
            $wxgift = $wxgiftes[0];
        }

        echo CJSON::encode($this->JSONMapper($wxgift));
    }

    /* 
     * 获得记录
     * GET /api/activity/wxgift/{id}
     */
    public function actionRestget() {
        $this->checkRestAuth();
        
        //判断是否全部填写
        if (!isset($_GET['id'])) {
            return $this->sendResponse(400, 'missed required properties');
        }
        $id = $_GET['id'];

        $wxgift = Wxgift::model()->findByPk($id);

        if ($wxgift == null) {
            return $this->sendResponse(404, 'faild to get');
        }

        echo CJSON::encode($this->JSONMapper($wxgift));
    }

    /* 
     * 更新记录
     * POST /api/activity/wxgift/{id}
     */
    public function actionRestupdate() {
        $this->checkRestAuth();
        
        //判断是否全部填写
        if (!isset($_POST['shared']) || !isset($_POST['code'])) {
            return $this->sendResponse(400, 'missed required properties');
        }

        if ($_POST['shared'] == 1 && !isset($_POST['code'])) {
            return $this->sendResponse(400, 'missed code');
        }

        // 查询是否已经生成
        $wxgift = Wxgift::model()->findByPk($_GET['wxgiftId']);

        if ($wxgift == null) {
            return $this->sendResponse(404, 'not found');
        }

        // 只允许提交一次
        if ($wxgift->shared == 1) {
            $wxgift->code = $_POST['code'];
        }

        if (!$wxgift->save()) {
            return $this->sendResponse(500, 'faild to save wxgift');
        }

        echo CJSON::encode($this->JSONMapper($wxgift));
    }
}
