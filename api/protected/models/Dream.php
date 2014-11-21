<?php

class Dream extends WexActiveRecord {

    /**
     * @return string the associated database table name
     */
    public function tableName()
    {
        return 'wex_dream';
    }

    /**
     * @return array validation rules for model attributes.
     */
    public function rules()
    {
        // NOTE: you should only define rules for those attributes that
        // will receive user inputs.
        return array(
            array('name, gender, school, detail, mobile, dream, open_id', 'required'),
            // The following rule is used by search().
            // @todo Please remove those attributes that should not be searched.
            array('id, name, school, detail, mobile, dream, nickname, open_id', 'safe', 'on'=>'search'),
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
        //    'keywords' => array(self::HAS_MANY, 'Keyword', 'dream_id'),
        );
    }

    /**
     * @return array customized attribute labels (name=>label)
     */
    public function attributeLabels()
    {
        return array(
            'id' => 'ID',
            'name' => '姓名',
            'gender' => '性别',
            'school' => '学校',
            'detail' => '梦想详情',
            'mobile' => '联系方式',
            'dream' => '梦想',
            'headimgurl' => '用户头像',
            'nickname' => '用户昵称',
            'isdel' => 'Is Delete',
            'open_id' => '微信 openid',
            'created_at' => 'Created Time',
            'created_by' => 'Created By',
            'updated_at' => 'Updated Time',
            'updated_by' => 'Updated By'
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
        $criteria->compare('name', $this->name);
        $criteria->compare('school', $this->school);
        $criteria->compare('detail', $this->detail);
        $criteria->compare('mobile', $this->mobile);
        $criteria->compare('dream', $this->dream);
        $criteria->compare('nickname', $this->nickname);
        $criteria->compare('open_id', $this->open_id);

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