<?php

// uncomment the following to define a path alias
// Yii::setPathOfAlias('local','path/to/local-folder');

// This is the main Web application configuration. Any writable
// CWebApplication properties can be configured here.
return array(
    'basePath'=>dirname(__FILE__).DIRECTORY_SEPARATOR.'..',
    'name'=>'Yougou Webot',

    // preloading 'log' component
    'preload'=>array('log'),

    // autoloading model and component classes
    'import'=>array(
        'application.models.*',
        'application.components.*',
        'application.extensions.DbConnectionMan',
    ),

    'modules'=>array(
        // uncomment the following to enable the Gii tool
        /*
        'gii'=>array(
            'class'=>'system.gii.GiiModule',
            'password'=>'Enter Your Password Here',
            // If removed, Gii defaults to localhost only. Edit carefully to taste.
            'ipFilters'=>array('127.0.0.1','::1'),
        ),
        */
    ),

    // application components
    'components'=>array(
        'user'=>array(
            // enable cookie-based authentication
            'allowAutoLogin'=>true,
        ),
        // uncomment the following to enable URLs in path-format
        'urlManager'=>array(
            'class'=>'VerbUrlManager',
            'urlFormat'=>'path',
            'rules'=>require(
                dirname(__FILE__).'/routes.php'
            )
        ),
        'db' => array(
            'class'=>'DbConnectionMan',//Specify it,instead of CDbConnection,other options is same as CDbConnection
            'connectionString' => 'mysql:host=master.6034.mysql.local;port=6034;dbname=wechat',
            'emulatePrepare' => true,
            'username' => 'wechat',
            'password' => 'Y38sn9Vs3bAXm',
            'charset' => 'utf8',
            'enableSlave'=>true,//Read write splitting function is swithable.You can specify this value to false to disable it.
            'slaves'=>array(//slave connection config is same as CDbConnection
                array(
                    'connectionString'=>'mysql:host=slave.6034.mysql.local;port=6034;dbname=wechat',
                    'emulatePrepare' => true,
                    'username'=>'wechat_r',
                    'password'=>'Vm9T2IWFg7Ks',
                    'charset' => 'utf8',
                )
            ),
        ),
        // uncomment the following to use a MySQL database
        /*
        'db'=>array(
            'connectionString' => 'mysql:host=localhost;dbname=testdrive',
            'emulatePrepare' => true,
            'username' => 'root',
            'password' => '',
            'charset' => 'utf8',
        ),
        */
        'errorHandler'=>array(
            // use 'site/error' action to display errors
            'errorAction'=>'site/error',
        ),
        'log'=>array(
            'class'=>'CLogRouter',
            'routes'=>array(
                array(
                    'class'=>'CFileLogRoute',
                    'levels'=>'error, warning',
                ),
                // uncomment the following to show log messages on web pages
                /*
                array(
                    'class'=>'CWebLogRoute',
                ),
                */
            ),
        ),
    ),

    // application-level parameters that can be accessed
    // using Yii::app()->params['paramName']
    'params'=>array(
        // this is used in contact page
        'adminEmail'=>'hopesfish@163.com',
    ),
);