/*
webot send --des http://test.yougouwx.us/webot/weixin/api --token yougouwx t SCHOOLBIND-a106d68b-cbfd-294a-5324-8d0a5e329e2d

webot send --des http://test.yougouwx.us/webot/weixin/api --token yougouwx t 13501376353

webot send --des http://test.yougouwx.us/webot/weixin/api --token yougouwx t 6353

webot send --des http://test.yougouwx.us/webot/weixin/api --token yougouwx i https://www.google.com.hk/images/srpr/logo11w.png


webot send --des http://test.yougouwx.us/webot/weixin/api --token yougouwx t '查看消息'
webot send --des http://localhost:3000/webot/weixin/api --token yougouwx t '查看消息'

webot send --des http://localhost:3000/webot/weixin/api --token yougouwx t 'YHQ1'


webot send --des http://test.yougouwx.us/webot/weixin/api --token yougouwx t '添加消息'

webot send --des http://test.yougouwx.us/webot/weixin/api --token yougouwx t 'add'

webot send --des http://test.yougouwx.us/webot/weixin/api --token yougouwx t 'message'


webot send --des http://test.yougouwx.us/webot/weixin/api --token yougouwx t '个人资料'

webot send --des http://test.yougouwx.us/webot/weixin/api --token yougouwx t 1


webot send --des http://test.yougouwx.us/webot/weixin/api --token yougouwx t '个人资料'

webot send --des http://test.yougouwx.us/webot/weixin/api --token yougouwx t 2

webot send --des http://test.yougouwx.us/webot/weixin/api --token yougouwx i http://www.baidu.com/img/bdlogo.gif


webot send --des http://test.yougouwx.us/webot/weixin/api --token yougouwx t '个人资料'

webot send --des http://test.yougouwx.us/webot/weixin/api --token yougouwx t 4



webot send --des http://test.yougouwx.us/webot/weixin/api --token yougouwx t '发布班级圈记录'

webot send --des http://test.yougouwx.us/webot/weixin/api --token yougouwx t '班级圈'

webot send --des http://test.yougouwx.us/webot/weixin/api --token yougouwx t '班级动态'

webot send --des http://test.yougouwx.us/webot/weixin/api --token yougouwx t 'unregister'


webot send --des http://test.yougouwx.us/webot/weixin/api --token yougouwx t '发布成长记录'


ssh -C -N root@42.96.191.235 -L 13306:127.0.0.1:3306


webot send --des http://kid.weexiao.com/webot/weixin/api --token yougouwx e

https://wrapbootstrap.com/theme/detail-admin-responsive-theme-WB07061TJ

http://share.axure.com/IRVZPB/

npm install -g webot-cli

d28eefe9-db3b-4db5-a469-424ac5d187d8 18618331710

/message/unreadcount

forever start -o out.log -e err.log app.js

open -a "Google Chrome" --args --disable-web-security  

weixiaohuodong
http://m.test.yougouwx.us/api/school/d28eefe9-db3b-4db5-a469-424ac5d187d8/syncmenu?appId=wx7e623947327e472e&appSecret=2964baf9c94a1417a54719294f241e0a
wuyi
http://m.test.yougouwx.us/api/school/d28eefe9-db3b-4db5-a469-424ac5d187d8/syncmenu?appId=wxcf0e6547118dcf85&appSecret=94e7ff8e33e2c8b773e59c451042c542
lantian
http://m.test.yougouwx.us/api/school/a106d68b-cbfd-294a-5324-8d0a5e329e2d/syncmenu?appId=wx104cf6959e8b0913&appSecret=91dd397bcabc742ced638ee11fe9405e
*/
//require("./wxbot")();

var request = require('request');
var crypto = require('crypto');
var shasum = crypto.createHash('md5');

var key = '1387432923256';
shasum.update(key + 'rest' + 'kinderg' + '1qw23er4' + '20131219');
var token = shasum.digest('hex');

var mobile = "138" + (new Date()).getTime().toString().substring(5);

var options = {
    url: 'http://test.yougouwx.us/api/parent',
    method: 'POST',
    headers: {
        'wexkey': key,
        'wextoken': token,
    },
    form: {
    	schoolId: "d28eefe9-db3b-4db5-a469-424ac5d187d8",
    	studentId: "2b275c44-50fa-11e3-83f9-00163e0426cb",
    	name: "test" + mobile,
    	mobile: mobile,
    	photo: "/upload/user/13811111111/profile/1387290854537_new",
        createdBy: "b43b7c56-5e45-11e3-83f9-00163e0426cb"
    }
};

console.info(options);

function callback(error, response, body) {
    if (!error && response.statusCode == 201) {
    	console.info("done");
        console.log(body);
    } else {
    	console.info("failed");
    	console.log(body);
    }
}

request(options, callback);
