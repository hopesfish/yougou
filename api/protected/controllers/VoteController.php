<?php

class VoteController extends Controller {

    protected function JSONArrayMapper($users) {
        $newreplys = array();
        foreach ($users as $user) {
            array_push($newreplys, $user);
        }
        return $newreplys;
    }

    protected function JSONArrayMapperPaging($users, $start) {
        $newreplys = array();
        $rowNum = $start;
        foreach ($users as $user) {
            $user['num'] = $rowNum;
            $rowNum = $rowNum + 1;
            array_push($newreplys, $user);
        }
        return $newreplys;
    }

    /* GET 查询投票信息  测试用 */

    public function actionRestlist() {
        $sql = 'select * from wx_dream_vote ;';
        $command = Yii::app()->db->createCommand($sql);
        $rank = $command->query();
        echo CJSON::encode($this->JSONArrayMapper($rank));
    }

    /* Post api/activity/dream/{dreamId}/vote 
        投票
    */
    public function actionRestcreate() {
        $this->checkRestAuth();

        if (!isset($_POST['ip_address']) || !isset($_GET['dreamId']) || !isset($_POST['open_id'])) {
            return $this->sendResponse(400, 'missed required properties');
        }

        if (!isset($_GET['level'])) {
            $level = 1;
        } else {
            $level = $_GET['level'];
        }

        $vote = new Vote();
        $vote->dream_id = $_GET['dreamId'];
        $vote->level = $level;
        $vote->open_id = $_POST['open_id'];
        $vote->ip_address = $_POST['ip_address'];
        $vote->vote_at = time();


        $criteria = new CDbCriteria();
        $criteria->addCondition('dream_id=:dreamId', 'and');
        $criteria->addCondition('open_id=:open_id');
        $criteria->params = array(':open_id' => $_POST['open_id'], ':dreamId' => $_GET['dreamId']);
        $result = Vote::model()->exists($criteria);
        if ($result) {
            return $this->sendResponse(400, 'exists');
        }

        if (!$vote->save()) {
            return $this->sendResponse(500, 'faild to save vote');
        }

        $this->sendResponse(201, 'vote success');

        //$this->sendResponse(201, CJSON::encode($this->getRank($_GET['dreamId'])));
    }

    public function actionRestlistbyopenid() {
        if (!isset($_GET['openid'])) {
            return $this->sendResponse(404, 'id is not provided.');
        }

        $criteria = new CDbCriteria();
        $criteria->addCondition('open_id=:openid');

        $criteria->params = array(':openid' => $_GET['openid']);

        $votes = Vote::model()->findAll($criteria);
        
        echo CJSON::encode($this->JSONArrayMapper($votes));
    }

        /* GET : api/activity/dream/{dreamId}/rank 
            获取当前梦想盒伙人的投票支持情况
        */
    public function actionRestrankget() {
        //$this->checkRestAuth();

        if (!isset($_GET['dreamId'])) {
            return $this->sendResponse(404, 'id is not provided.');
        }

        $result = array();
        //TODO 排名  等级投票数列表
        // --等级积分排行榜
        $sql_level = '
        select dream_id, level,
        case level 
        when 1 then num * 10
        when 2 then num * 9
        when 3 then num * 8
        else num * 1
        end
        as score
        from (
            select dream_id, level, count(1) as num from wx_dream_vote group by dream_id, level
            ) vote where dream_id=:dream_id
        order by level;
        ';

        $command_level = Yii::app()->db->createCommand($sql_level);

        $rows = $command_level->query(array(':dream_id' => $_GET['dreamId']));

        if (count($rows) > 0) {
            foreach ($rows as $row) {
                $result["LV{$row['level']}"] = $row['score'];
            }
        }
        

        //--总排行榜

        $arrayName = array('vote' => $result, 'total' => $this->getRank($_GET['dreamId']));

        echo CJSON::encode($arrayName);
        //echo CJSON::encode($this->getRank($_GET['dreamId']));

    }

    protected function getRank($dreamId) {
        //--总排行榜

        $sql_rank = '
        select dream_id, total from (
            select dream_id, sum(score) as total from (
                select dream_id, 
                    case level 
                    when 1 then num * 10
                    when 2 then num * 9
                    when 3 then num * 8
                    else num * 1
                    end
                    as score
                from (
                    select dream_id, level, count(1) as num from wx_dream_vote group by dream_id, level
                    ) vote
            ) vote_score group by dream_id 
        ) a where dream_id=:dream_id;
        ';

        $command_rank = Yii::app()->db->createCommand($sql_rank);

        $rank = $command_rank->query(array(':dream_id' => $dreamId));

        $user = $this->findDreamByDreamId($this->getRankAll(), $dreamId);

        $rankResult = array();
        if (count($rank) > 0) {
            foreach ($rank as $value) {
                $rankResult['score'] = intval($value['total']);
            }
        }
        $rankResult['rank'] = intval($user['num']);
        return $rankResult;
    }

    public function actionRestlistpaging() {

        if (isset($_GET['skip']) && is_numeric($_GET['skip'])) {
            $skip = $_GET['skip'];
        } else {
            $skip = 0;
        }

        if (isset($_GET['take']) && is_numeric($_GET['take'])) {
            $take = $_GET['take'];
        } else {
            $take = 5;
        }

        $sql_rank = '
        select (select count(1) from (
                select dream_id, sum(score) as total from (
                    select dream_id, 
                        case level 
                        when 1 then num * 10
                        when 2 then num * 9
                        when 3 then num * 8
                        else num * 1
                        end
                        as score
                    from (
                        select dream_id, level, count(1) as num from wx_dream_vote group by dream_id, level
                        ) vote
                ) vote_score group by dream_id 
            ) b where b.total > a.total
        ) as num, dream_id, total, d.name, d.gender, d.mobile, d.school, d.dream from (
            select dream_id, sum(score) as total from (
                select dream_id, 
                    case level 
                    when 1 then num * 10
                    when 2 then num * 9
                    when 3 then num * 8
                    else num * 1
                    end
                    as score
                from (
                    select dream_id, level, count(1) as num from wx_dream_vote group by dream_id, level
                    ) vote
            ) vote_score group by dream_id 
        ) a left join wx_dream d on a.dream_id = d.id
        where d.isdel = 0
        order by num, dream_id asc limit '.$skip.', '.$take.';
        ';

        $command = Yii::app()->db->createCommand($sql_rank);
        $rank = $command->query();

        $countCommand = Yii::app()->db->createCommand('
            select count(1) from (
                select distinct dream_id from wx_dream_vote
            ) a;
            ');
        $count = $countCommand->queryScalar();

        $json = new JsonData();
        $json->limit = $take;
        $json->total = intval($count);
        $json->result = $this->JSONArrayMapperPaging($rank, $skip);
        //$json->result = $this->JSONArrayMapper($rank);

        //echo CJSON::encode($result);
        echo CJSON::encode($json);

    }

    protected function findDreamByDreamId($users, $dreamId) {
        $rowNum = 0;
        foreach ($users as $user) {
            $user['num'] = $rowNum;
            $rowNum = $rowNum + 1;
            if ($user['dream_id'] == $dreamId) {
                return $user;
            }
        }
        return null;
    }

    protected function getRankAll() {
         $sql_rankall = '
        select (select count(1) from (
                select dream_id, sum(score) as total from (
                    select dream_id, 
                        case level 
                        when 1 then num * 10
                        when 2 then num * 9
                        when 3 then num * 8
                        else num * 1
                        end
                        as score
                    from (
                        select dream_id, level, count(1) as num from wx_dream_vote group by dream_id, level
                        ) vote
                ) vote_score group by dream_id 
            ) b where b.total > a.total
        ) as num, dream_id, total, d.name, d.gender, d.mobile, d.school, d.dream from (
            select dream_id, sum(score) as total from (
                select dream_id, 
                    case level 
                    when 1 then num * 10
                    when 2 then num * 9
                    when 3 then num * 8
                    else num * 1
                    end
                    as score
                from (
                    select dream_id, level, count(1) as num from wx_dream_vote group by dream_id, level
                    ) vote
            ) vote_score group by dream_id 
        ) a left join wx_dream d on a.dream_id = d.id
        where d.isdel = 0
        order by num,dream_id asc;
        ';

        $commandall = Yii::app()->db->createCommand($sql_rankall);
        $rankall = $commandall->queryAll();
        return $rankall;
    }
}

?>