<?php

/**
 * This is the model class for table "wex_user".
 *
 * The followings are the available columns in table 'wex_user':
 * @property string $id
 * @property string $username
 * @property string $password
 * @property string $mobile
 * @property integer $type
 * @property string $photo
 * @property string $created_time
 * @property string $created_by
 * @property string $updated_time
 * @property string $updated_by
 * @property integer $archived
 */
class User extends WexActiveRecord
{
	const USERSALT = 'kinderg1qw23er4';

	/**
	 * @return string the associated database table name
	 */
	public function tableName()
	{
		return 'wex_user';
	}

	/**
	 * @return array validation rules for model attributes.
	 */
	public function rules()
	{
		// NOTE: you should only define rules for those attributes that
		// will receive user inputs.
		return array(
			array('mobile', 'match','allowEmpty'=>false, 'pattern'=>'/^1[0-9]{10}$/' ,'message'=>'手机号码格式不正确'),
			array('id, created_by, updated_by', 'length', 'max'=>36),
			array('username', 'length', 'max'=>50),
			array('email', 'length', 'max'=>50),
			array('password', 'length', 'max'=>32),
			array('mobile', 'length', 'max'=>20),
			array('updated_time', 'safe'),
			// The following rule is used by search().
			// @todo Please remove those attributes that should not be searched.
			array('id, username, password, mobile, photo, open_id, created_time, created_by, updated_time, updated_by, archived', 'safe', 'on'=>'search'),
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
		);
	}

	/**
	 * @return array customized attribute labels (name=>label)
	 */
	public function attributeLabels()
	{
		return array(
			'id' => 'ID',
			'username' => '用户登录名',
			'name' => '用户姓名', // 未在表中设置改字段,用于rest api接口
			'open_id' => '微信ID',
			'password' => '密码',
			'mobile' => '手机号',
			'email' => 'email',
			'created_time' => 'Created Time',
			'created_by' => 'Created By',
			'updated_time' => 'Updated Time',
			'updated_by' => 'Updated By',
			'archived' => 'Archived',
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
		$criteria->compare('username',$this->username,true);
		$criteria->compare('password',$this->password,true);
		$criteria->compare('mobile',$this->mobile,true);
		$criteria->compare('email',$this->email,true);
		$criteria->compare('open_id',$this->open_id,true);
		$criteria->compare('created_time',$this->created_time,true);
		$criteria->compare('created_by',$this->created_by,true);
		$criteria->compare('updated_time',$this->updated_time,true);
		$criteria->compare('updated_by',$this->updated_by,true);
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
	/**
	 * 密码的处理
	 */
	protected function beforeSave() {
		parent::beforeSave();
		if($this->isNewRecord){
			$this->password = $this->encrypt($this->password);
		} else if($this->getScenario()=='update'){
			$olduser = User::model()->findByPk($this->id);
			if($olduser->password!=$this->password){
				$this->password = $this->encrypt($this->password);
			}
		}
		return true;
	}
	public function encrypt($value) {
		return md5($value . self::USERSALT);
	}
}
