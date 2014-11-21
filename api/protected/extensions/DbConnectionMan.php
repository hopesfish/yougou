<?php

/**
 * DbConnectionMan(Database Connection Manager) class is a manager of database connections.
 * for the purpose of database read/write splitting.
 * It override the createCommand method,
 * detect the sql statement to decide which connection will be used.
 * Default it use the master connection.
 * @author CJ
 * @link http://jex.im/
 * */
class DbConnectionMan extends CDbConnection {

    public $timeout=10;//set default 10 seconds connection timeout

    public $markDeadSeconds=600;//default,if connect a slave db cause error,then mark this slave as dead for 10 minutes.
    //after 10 minutes,mark dead cache will automatically expire.


    //use cache as global flags storage
    public $cacheID='cache';

    /**
    * @var array $slaves.Slave database connection(Read) config array.
    * The array value's format is the same as CDbConnection.
    * @example
    * 'components'=>array(
    * 		'db'=>array(
    * 			'connectionString'=>'mysql://<master>',
    * 			'slaves'=>array(
    * 				array('connectionString'=>'mysql://<slave01>'),
    * 				array('connectionString'=>'mysql://<slave02>'),
    * 			)
    * 		)
    * )
    * */
    public $slaves=array();



    /**
    * Whether enable the slave database connection.
    * Defaut is true.Set this property to false for the purpose of only use the master database.
    * @var bool $enableSlave
    * */
    public $enableSlave=true;



    /**
    * @var _slave
    */
    private $_slave;

    /**
    * @var _disableWrite Emergency use when master server is unavailable switch to readonly slave server.
    */
    private $_disableWrite=false;


    /**
    * Creates a CDbCommand object for excuting sql statement.
    * It will detect the sql statement's behavior.
    * While the sql is a simple read operation.
    * It will use a slave database connection to contruct a CDbCommand object.
    * Default it use current connection(master database).
    *
    * @override
    * @param string $sql
    * @return CDbCommand
    * */
    public function createCommand($sql=null) {
        if ($this->enableSlave
                && !empty($this->slaves)
                && is_string($sql)
                && !$this->getCurrentTransaction()
                && self::isReadOperation($sql)
                && ($slave=$this->getSlave())
        ) {
            return $slave->createCommand($sql);
        } else {
            if ($this->_disableWrite && !self::isReadOperation($sql)) {
                throw new CDbException("Master db server is not available now!Disallow write operation on slave server!");
            }
            return parent::createCommand($sql);
        }
    }


    /**
    * Construct a slave connection CDbConnection for read operation.
    * @return CDbConnection
    * */
    public function getSlave() {
        if (!isset($this->_slave)) {
            shuffle($this->slaves);
            foreach ($this->slaves as $slaveConfig) {
                if ($this->_isDeadServer($slaveConfig['connectionString'])) {
                    continue;
                }
                if (!isset($slaveConfig['class']))
                    $slaveConfig['class']='CDbConnection';

                $slaveConfig['autoConnect']=false;
                try {
                    if ($slave=Yii::createComponent($slaveConfig)) {
                        Yii::app()->setComponent('dbslave',$slave);
                        $slave->setAttribute(PDO::ATTR_TIMEOUT,$this->timeout);
                        $slave->setActive(true);
                        $this->_slave=$slave;
                        break;
                    }
                } catch (Exception $e) {
                    $this->_markDeadServer($slaveConfig['connectionString']);
                    Yii::log("Slave database connection failed!\n\tConnection string:{$slaveConfig['connectionString']}",'warning');

                    continue;
                }
            }

            if (!isset($this->_slave)) {
                $this->_slave=null;
                $this->enableSlave=false;
            }
        }
        return $this->_slave;
    }

    public function setActive($value) {
        if($value!=$this->getActive()) {
            if($value) {
                try {
                    if ($this->_isDeadServer($this->connectionString)) {
                        throw new CDbException('Master db server is already dead!');
                    }
                    try {
                        //PDO::ATTR_TIMEOUT must set before pdo instance create
                        $this->setAttribute(PDO::ATTR_TIMEOUT,$this->timeout);
                        $this->open();
                    } catch(Exception $e) {
                        $this->_markDeadServer($this->connectionString);
                        throw $e;
                    }
                } catch (Exception $e) {
                    $slave=$this->getSlave();
                    Yii::log($e->getMessage(),CLogger::LEVEL_ERROR,'exception.CDbException');
                    if ($slave) {
                        $this->connectionString=$slave->connectionString;
                        $this->username=$slave->username;
                        $this->password=$slave->password;
                        $this->_disableWrite=true;
                        $this->open();
                    } else { //Slave also unavailable
                        throw new CDbException(Yii::t('yii','CDbConnection failed to open the DB connection.'),(int)$e->getCode(),$e->errorInfo);
                    }
                }
            } else {
                $this->close();
            }
        }
    }

    /**
    * Detect whether the sql statement is just a simple read operation.
    * Read Operation means this sql will not change any thing ang aspect of the database.
    * Such as SELECT,DECRIBE,SHOW etc.
    * On the other hand:UPDATE,INSERT,DELETE is write operation.
    * */
    public static function isReadOperation($sql) {
        $sql=substr(ltrim($sql),0,10);
        $sql=str_ireplace(array('SELECT','SHOW','DESCRIBE','PRAGMA'),'^O^',$sql);//^O^,magic smile
        return strpos($sql,'^O^')===0;
    }

    /**
     * Detect is this slave config already marked as dead for a period time in cache.
     */
    private function _isDeadServer($c) {
        $cache=Yii::app()->{$this->cacheID};
        if ($cache && $cache->get('DeadServer::'.$c)==1) {
            return true;
        }
        return false;
    }

    /**
     * Mark this slave config as dead.
     */
    private function _markDeadServer($c) {
        $cache=Yii::app()->{$this->cacheID};
        if ($cache) {
            $cache->set('DeadServer::'.$c,1,$this->markDeadSeconds);
        }
    }

}
