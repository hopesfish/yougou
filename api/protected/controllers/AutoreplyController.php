<?php

function getReplyId($kw) {
    return $kw->reply_id;            
}

class AutoreplyController extends Controller
{
        /**
     * mapper the data into json object
     */
    protected function JSONMapper($reply) {
        $newreply = array();
        $newreply['id'] = $reply->id;
        $newreply['name'] = $reply->name;
        $newreply['type'] = (int)$reply->type;
        $newreply['reply'] = $reply->reply;
        $newreply['enabled'] = intval($reply->enabled);
        if (isset($reply->keywords)) {
            $words = array();
            foreach ($reply->keywords as $keyword) {
                array_push($words, $keyword->word);
            }
            $newreply['keywords'] = join(",", $words);
        }

        return $newreply;
    }
    /**
     * mapper the array
     */
    protected function JSONArrayMapper($users) {
        $newreplys = array();
        foreach ($users as $user) {
            array_push($newreplys, $this->JSONMapper($user));
        }
        return $newreplys;
    }

    /**
     * 获得自动回复配置
     * GET /api/autoreply?keyword={keyword}
     */
    public function actionRestlist() {
        $this->checkRestAuth();

        $users = array();

        // 分页
        $curPage = 1;
        $offset = 0;
        $limit = 1000;

        $criteria = new CDbCriteria;
        // 根据关键词模糊查找
        if (isset($_GET['keyword:like']) && !empty($_GET['keyword:like'])) {
            $kwCriteria = new CDbCriteria;
            $kwCriteria->addSearchCondition('word', $_GET['keyword:like']);
            $kwCriteria->compare('archived', 1);
            $replies = array_map("getReplyId", Keyword::model()->findAll($kwCriteria));
            $criteria->addInCondition('id', $replies);
        }
        
        // 根据关键词精确查找
        if (isset($_GET['keyword'])) {
            $kwCriteria = new CDbCriteria;
            $kwCriteria->compare('word', $_GET['keyword']);
            $kwCriteria->compare('enabled', 1);
            $kwCriteria->compare('archived', 1);
            $keyword = Keyword::model()->find($kwCriteria);
            // 根据关键词ID查找
            if (isset($keyword)) {
                $criteria->compare('id', $keyword->reply_id);
            } else { // 如果找不到,就用一个不存在的id
                $criteria->compare('id', -1);
            }
        }

        // 查询已启用的词
        if (isset($_GET['enabled'])) {
            $criteria->compare('enabled', intval($_GET['enabled']));   
        }

        $criteria->compare('archived', 1);
        $criteria->order = 'created_time desc';

        // 分页
        $json = new JsonData();
        $json->limit = $limit;
        $json->curPage = $curPage;
        $json->total = Autoreply::model()->count($criteria);
        $json->result = $this->JSONArrayMapper(Autoreply::model()->findAll($criteria));
        echo CJSON::encode($json);
    }

    /**
     * 创建自动回复配置
     * POST /api/autoreply
     */
    public function actionRestcreate() {
        $this->checkRestAuth();

        // 判断属性都已经提供
        if (!isset($_POST['name']) || !isset($_POST['type']) || !isset($_POST['reply']) || !isset($_POST['keywords'])) {
            return $this->sendResponse(400, 'missed required properties');
        }

        // 创建回复内容
        $criteria = new CDbCriteria;
        $criteria->compare('name', $_POST['name']);
        $criteria->compare('archived', 1);

        if (Autoreply::model()->count($criteria) > 0) {
            return $this->sendResponse(400, 'same name');
        }

        // 创建reply
        $reply = new Autoreply;
        $reply->name = $_POST['name'];
        $reply->type = intval($_POST['type']);
        $reply->reply = $_POST['reply'];

        if (!$reply->save()) {
            return $this->sendResponse(500, 'failed to save reply');
        }

        // 创建keywords
        $keywords = split(',', $_POST['keywords']);

        $count = 0;

        foreach ($keywords as $keywordStr) {
            $criteria = new CDbCriteria;
            $criteria->compare('word', $keywordStr);
            $criteria->compare('archived', 1);

            if (Keyword::model()->count($criteria) == 0) {
                $keyword = new Keyword;
                $keyword->word = $keywordStr;
                $keyword->reply_id = $reply->id;

                $keyword->save();
            }
        }

        return $this->sendResponse(201, $reply->id);
    }

    /**
     * 单个reply数据
     * GET /api/autoreply/{replyId}
     */
    public function actionRestget() {
        $this->checkRestAuth();

        $id = $_GET['replyId'];
        if (!isset($id)) {
            return $this->sendResponse(404, 'id is not provided.');
        }

        $reply = Autoreply::model()->findByPk($id);
        if ($reply == null || $reply->archived == 0) {
            return $this->sendResponse(404, 'reply is not found.');
        }
        echo CJSON::encode($this->JSONMapper($reply));
    }
    /**
     * 更新
     * POST /api/autoreply/{id}
     */
    public function actionRestupdate() {
        $this->checkRestAuth();

        $id = $_GET['replyId'];
        if (!isset($id)) {
            return $this->sendResponse(404, 'id is not provided.');
        }

        $reply = Autoreply::model()->findByPk($id);
        if ($reply == null || $reply->archived == 0) {
            return $this->sendResponse(404, 'reply is not found.');
        }

        // 重置关键词
        if (isset($_POST['keywords'])) {
            // 删除原来的
            if (isset($reply->keywords)) {
                foreach ($reply->keywords as $keyword) {
                    if (!$keyword->delete()) {
                        return $this->sendResponse(500, 'failed to delete keyword');
                    }
                }
            }

            // 增加新的
            $keywords = split(',', $_POST['keywords']);

            $count = 0;

            foreach ($keywords as $keywordStr) {
                $criteria = new CDbCriteria;
                $criteria->compare('word', $keywordStr);
                $criteria->compare('archived', 1);

                if (Keyword::model()->count($criteria) == 0) {
                    $keyword = new Keyword;
                    $keyword->word = $keywordStr;
                    $keyword->reply_id = $reply->id;

                    $keyword->save();
                }
            }
        }

        // 修改name
        if (isset($_POST['name'])) {
            $reply->name = $_POST['name'];
        }

        // 修改type
        if (isset($_POST['type'])) {
            $reply->type = intval($_POST['type']);
        }

        // 修改reply
        if (isset($_POST['reply'])) {
            $reply->reply = $_POST['reply'];
        }

        // 启用/停用
        if (isset($_POST['enabled'])) {
            $reply->enabled = (int)$_POST['enabled'];
        }

        if (!$reply->save()) {
            return $this->sendResponse(500, 'failed to save');
        }
        

        return $this->sendResponse(200, $reply->id);
    }

    /**
     * 删除
     * DELETE /api/autoreply/{id}
     */
    public function actionRestremove() {
        $this->checkRestAuth();

        $id = $_GET['replyId'];
        if (!isset($id)) {
            return $this->sendResponse(404, 'id is not provided.');
        }

        $reply = Autoreply::model()->findByPk($id);
        if ($reply == null || $reply->archived == 0) {
            return $this->sendResponse(404, 'reply is not found.');
        }

        // 删除关键词
        if (isset($reply->keywords)) {
            foreach ($reply->keywords as $keyword) {
                if (!$keyword->delete()) {
                    return $this->sendResponse(500, 'failed to delete keyword');
                }
            }
        }

        // 删除回复规则
        $reply->archived = 0;
        if (!$reply->save()) {
            return $this->sendResponse(500, 'failed to delete');
        }

        return $this->sendResponse(200, 'deleted');
    }
}
