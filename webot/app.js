/**
 * Module dependencies.
 */
// 服务器配置
var conf = require('./conf');
// 日志输出
var debug = require('debug');
var log = debug('weexiao');
var error = debug('weexiao:error');
// Express依赖
var express = require('express');
var http = require('http');
var path = require('path');
// 上传数据
var xlsx = require('node-xlsx');
var ActivityServices = require("./services/ActivityServices");

// 配置Express
var app = express();
app._conf = conf;
app.set('port', conf.port || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.bodyParser());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));

//app.use(express.session({secret: 'weexiao secret', cookie: {maxAge: conf.timeout.val}}));
app.use(express.query());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// REST API
require("./rest")(app);

// 上传文件
app.post('/file-upload', function(req, res, next) {
   var obj = xlsx.parse(req.files.thumbnail.path); // parses a file
   var batch = (new Date()).getTime();

   if (!req.body.activityId) {
       res.send(400, '未提供活动唯一标识，无法上传！');
       return;
   }

   for (var i=0; i<obj.worksheets[0].data.length; i++) {
       var record = obj.worksheets[0].data[i];
       if (!record) { continue; }
       if (!record[0]) { continue; }
       var url = "/api/activity/" + req.body.activityId + "/coupon";
       var data = {batch: batch, code: record[0].value};
       ActivityServices.createCoupon(url, data).then(function() {
           console.info('done');
       }, function(err) {
           console.info(err);
       });
   }

   res.send(200, '上传任务已在后台进行，请【返回详情页】并连续点击【刷新】按钮查看上传进度，');
});

// 回复机器人
var webot = require('weixin-robot');
require("./wxbot")(webot);
webot.watch(app, { token: conf.weixin, path: '/webot/weixin/api' });

// 这个方法必须在webot.watch后面
app.use(express.session({
	secret: 'weexiao',
	store: new express.session.MemoryStore(),
    expires: new Date(Date.now() + conf.timeout.val)
}));

// 启动express
var port = conf.port || 3000;
var hostname = conf.hostname || '127.0.0.1';
app.listen(port, function() {
  console.info('listening on ', hostname, port);
});
app.enable('trust proxy');