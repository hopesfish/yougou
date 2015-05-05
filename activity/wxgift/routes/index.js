var _ = require("underscore");
var Q = require("q");
var OAuth = require("wechat-oauth");
var API = require('wechat-api');
var express = require('express');
var router = express.Router();
var conf = require("../conf");
var WxgiftServices = require("../services/WxgiftServices");

var redis = require('node-redis');
var rdsClient = redis.createClient(6379, 'localhost');

// oauth oauthClient
var oauthClient = new OAuth('wxdc7c7ccc033ba612', '591bea60d3724af80f103e545b03a5d6', function (openid, callback) {
    rdsClient.hget('weixin:' + openid, 'token', function(err, txt) {
        if (err) {return callback(err);}
        callback(null, JSON.parse(txt));
    });
}, function (openid, token, callback) {
    rdsClient.hset('weixin:' + openid, 'token', JSON.stringify(token), callback);
});

// 初始化订阅微信api
var wechatApi = new API('wx0f186d92b18bc5b0', 'a1e509c1ee4b0fcd9ab4d29cb6ea35e6', function(callback) {
    rdsClient.hget('weixin-api-token', 'token', function(err, txt) {
        if (err) {return callback(err);}
        callback(null, JSON.parse(txt));
    });
}, function(token, callback) {
    rdsClient.hset('weixin-api-token', 'token', JSON.stringify(token), callback);
});
// 初始化服务号微信api
var fwWechatApi = new API('wxdc7c7ccc033ba612', '591bea60d3724af80f103e545b03a5d6', function(callback) {
    rdsClient.hget('fw-weixin-api-token', 'token', function(err, txt) {
        if (err) {return callback(err);}
        callback(null, JSON.parse(txt));
    });
}, function(token, callback) {
    rdsClient.hset('fw-weixin-api-token', 'token', JSON.stringify(token), callback);
});


// 超时时间
wechatApi.setOpts({timeout: 15000});

// 初始化ticket
wechatApi.registerTicketHandle(function(type, callback) {
    rdsClient.hget('weixin-ticket-token', 'token', function(err, txt) {
        if (err) {return callback(err);}
        callback(null, JSON.parse(txt));
    });
}, function(type, token, callback) {
    rdsClient.hset('weixin-ticket-token', 'token', JSON.stringify(token), callback);
});

/* GET home page. */
router.get('/', function(req, res) {
    res.render('index', {});
});

router.get('/wxgift/timeout', function(req, res) {
    res.render('timeout', {});
});

router.get('/notice', function(req, res) {
    res.render('notice', {});
});

router.get('/wxgift/notice', function(req, res) {
    res.render('notice', {});
});


router.get('/wxgift/subscribe', function(req, res) {
    res.redirect('http://mp.weixin.qq.com/s?__biz=MjM5NDA3MTk2MA==&mid=205304203&idx=1&sn=6b52c06b6649ae72bcbc51ecf1a719e4#rd');
});

// 发起人第一次入口
router.get('/wxgift/start', function(req, res) {
    // 强制授权
    var url = oauthClient.getAuthorizeURL(
        conf.server_root + '/wxgift/started',
        '',
        //'snsapi_base'
        'snsapi_userinfo'
    );
    res.redirect(url);
});

// 发起人完成发起
router.get('/wxgift/started', function(req, res) {
    if (req.query.code) {
        oauthClient.getAccessToken(req.query.code, function (err, result) {
            if (err) {
                console.error(err);
                //res.status(400).send('无法获得授权码');
                res.render('timeout', {});
                return;
            }
            var unionid = result.data.unionid;
            oauthClient.getUser(openid, function (err, result) {
                if (err) {
                    console.error(err);
                    //res.status(400).send('无法获得用户信息');
                    res.render('timeout', {});
                    return;
                }
                var userInfo = result;

                WxgiftServices.start({
                    unionId: unionid,
                    subOpenId: userInfo.openid,
                    headimgurl: userInfo.headimgurl,
                    nickname: userInfo.nickname,
                }).then(function(wxgift) {
                    console.info(wxgift);
                    if (!wxgift.code) {
                        res.redirect(conf.server_root + '/wxgift/' + wxgift.id);
                    } else if (wxgift.awarded == 1) {
                        res.redirect(conf.server_root + '/wxgift/' + wxgift.id + '/award');
                    }
                }, function(err) {
                    console.error('failed to start');
                    console.error(err);
                });
            });
        });
    } else {
        res.render('timeout', {});
        //res.status(400).send('未完成授权');
    }
});

// 发起人完成发起
router.get('/wxgift/started.test', function(req, res) {
    var unionid = (new Date()).getTime(),
        userInfo = {
            openid: 'openid' + unionid,
            headimgurl: 'headimgurl' + unionid,
            nickname: 'nickname' + unionid,
        };

    WxgiftServices.start({
        unionId: unionid,
        subOpenId: userInfo.openid,
        headimgurl: userInfo.headimgurl,
        nickname: userInfo.nickname,
    }).then(function(wxgift) {
        req.session.wid = wxgift.id;
        if (wxgift.code == null) {
            res.redirect(conf.server_root + '/wxgift/' + wxgift.id);
        } else if (wxgift.awarded == 1) { // 已活动
            res.redirect(conf.server_root + '/wxgift/' + wxgift.id + '/awarded');
        } else if (wxgift.awarded == 2) { // 抽完了
            res.redirect(conf.server_root + '/wxgift/' + wxgift.id + '/out');
        }
    }, function(err) {
        console.error('failed to start');
        console.error(err);
    });
});

router.get('/wxgift/:id', function(req, res) {
    WxgiftServices.get(req.params.id).then(function(wxgift) {
        var param = {
            debug:false,
            jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage'],
            url: conf.server_root + '/wxgift/' + wxgift.id
        };
        wechatApi.getJsConfig(param, function(err, result) {
            if (err) {
                console.error(err);
                console.error('JS SDK授权异常!');
                //return res.status(400).send('JS SDK授权异常!');
                return res.render('timeout', {});
            }

            res.render('wxgift', {
                wxgift: wxgift,
                jsApi: {
                    appId: 'wx0f186d92b18bc5b0',
                    timestamp: result.timestamp || '',
                    nonceStr: result.nonceStr || '',
                    signature: result.signature || '',
                }
            });
        });
    }, function(err) {
        res.status(400).send('服务异常!');
    });
});

// 查看领取进度
router.get('/wxgift/:id/progress', function(req, res) {
    WxgiftServices.get(req.params.id).then(function(wxgift) {
        res.send(wxgift);
    }, function(err) {
        res.status(500).send('服务异常!');
    });
    WxgiftServices.award(req.params.id).then(function() {
        //res.status(200).send('awarded');
    }, function(err) {
        //res.status(500).send(err);
    });
});

module.exports = router;
