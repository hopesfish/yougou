<?php

class Autoreply extends WexActiveRecord
{

    /**
     * @return string the associated database table name
     */
    public function tableName()
    {
        return 'webot_autoreply';
    }

    /**
     * @return array validation rules for model attributes.
     */
    public function rules()
    {
        // NOTE: you should only define rules for those attributes that
        // will receive user inputs.
        return array(
            array('name, type, reply, enabled', 'required'),
            // The following rule is used by search().
            // @todo Please remove those attributes that should not be searched.
            array('id, type, reply', 'safe', 'on'=>'search'),
        );
    }

    /**
     * @return array relational rules.
     */
    public function relations()
    {
        // NOTE: you may need to adjust the relation name and the related
        // class name for the relations automatically generated below.
        return array(
            'keywords' => array(self::HAS_MANY, 'Keyword', 'reply_id'),
        );
    }

    /**
     * @return array customized attribute labels (name=>label)
     */
    public function attributeLabels()
    {
        return array(
            'id' => 'ID',
            'name' => '规则名称',
            'type' => '类型',
            'reply' => '回复内容的JSON串',
            'enabled' => '是否启用',
            'created_at' => 'Created Time',
            'created_by' => 'Created By',
            'updated_at' => 'Updated Time',
            'updated_by' => 'Updated By',
            'archived' => '是否存档',
        );
    }

    /**
     * Retrieves a list of models based on the current search/filter conditions.
     *
     * Typical usecase:
     * - Initialize the model fields with values from filter form.
     * - Execute this method to get CActiveDataProvider instance which will filter
     * models according to data in model fields.
     * - Pass data provider to CGridView, CListView or any similar widget.
     *
     * @return CActiveDataProvider the data provider that can return the models
     * based on the search/filter conditions.
     */
    public function search()
    {
        // @todo Please modify the following code to remove attributes that should not be searched.

        $criteria=new CDbCriteria;

        $criteria->compare('id',$this->id,true);
        $criteria->compare('archived',$this->archived);

        return new CActiveDataProvider($this, array(
            'criteria'=>$criteria,
        ));
    }

    /**
     * Returns the static model of the specified AR class.
     * Please note that you should have this exact method in all your CActiveRecord descendants!
     * @param string $className active record class name.
     * @return User the static model class
     */
    public static function model($className=__CLASS__)
    {
        return parent::model($className);
    }

}

?>