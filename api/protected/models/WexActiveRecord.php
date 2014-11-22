<?php 
 
abstract class WexActiveRecord extends CActiveRecord 
{
    /**
     * Create UUID
     */
    protected function createUUID()
    {
        if (function_exists('com_create_guid')){
            return strtolower(trim(com_create_guid(), '{}'));
        }else{
            mt_srand((double)microtime()*10000);//optional for php 4.2.0 and up.
            $charid = strtoupper(md5(uniqid(rand(), true)));
            $hyphen = chr(45);// "-"
            $uuid = chr(123)// "{"
                .substr($charid, 0, 8).$hyphen
                .substr($charid, 8, 4).$hyphen
                .substr($charid,12, 4).$hyphen
                .substr($charid,16, 4).$hyphen
                .substr($charid,20,12)
                .chr(125);// "}"
            return strtolower(trim($uuid, '{}'));
        }
    }
    
    /**
     * Prepares create_time, create_user_id, update_time and
     * update_user_ id attributes before performing validation.
     */
    protected function beforeValidate() {
 
        if ($this->isNewRecord) {
            // set the create date, last updated date
            // and the user doing the creating
            if ($this->id == null) {
                $this->id = $this->createUUID();
            }

            $this->created_time = $this->updated_time = new CDbExpression('NOW()');
 
            if ($this->created_by == null)
                $this->created_by = Yii::app()->user->id;
                
            if ($this->updated_by == null)
                $this->updated_by = Yii::app()->user->id;
        } else {
            //not a new record, so just set the last updated time
            //and last updated user id
            $this->updated_time = new CDbExpression('NOW()');
            //$this->updated_by = Yii::app()->user->id;
            
            if ($this->updated_by == null)
                $this->updated_by = Yii::app()->user->id;
        }
        return parent::beforeValidate();
    }
 
}