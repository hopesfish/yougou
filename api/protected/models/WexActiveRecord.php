<?php 
 
abstract class WexActiveRecord extends CActiveRecord 
{
    /**
     * Prepares create_time, create_user_id, update_time and
     * update_user_ id attributes before performing validation.
     */
    protected function beforeValidate() {
 
        if ($this->isNewRecord) {

            $this->created_at = $this->updated_at = new CDbExpression('NOW()');
 
            if ($this->created_by == null)
                $this->created_by = Yii::app()->user->id;
                
            if ($this->updated_by == null)
                $this->updated_by = Yii::app()->user->id;
        } else {
            //not a new record, so just set the last updated time
            //and last updated user id
            $this->updated_at = new CDbExpression('NOW()');
            //$this->updated_by = Yii::app()->user->id;
            
            if ($this->updated_by == null)
                $this->updated_by = Yii::app()->user->id;
        }
        return parent::beforeValidate();
    }
 
}