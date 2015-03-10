var Q = require("q");
var OAuth = require("wechat-oauth");
var API = require('wechat-api');
var express = require('express');
var router = express.Router();
var conf = require("../conf");
var FinddiffServices = require("../services/FinddiffServices");

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

// 初始化微信api
var wechatApi = new API('wx0f186d92b18bc5b0', 'a1e509c1ee4b0fcd9ab4d29cb6ea35e6', function(callback) {
    rdsClient.hget('weixin-api-token', 'token', function(err, txt) {
        if (err) {return callback(err);}
        callback(null, JSON.parse(txt));
    });
}, function(token, callback) {
    rdsClient.hset('weixin-api-token', 'token', JSON.stringify(token), callback);
});

// 超时时间
wechatApi.setOpts({timeout: 15000});

// 初始化ticket
wechatApi.registerTicketHandle(function(callback) {
    rdsClient.hget('weixin-ticket-token', 'token', function(err, txt) {
        if (err) {return callback(err);}
        callback(null, JSON.parse(txt));
    });
}, function(token, callback) {
    rdsClient.hset('weixin-ticket-token', 'token', JSON.stringify(token), callback);
});

/* GET home page. */
router.get('/', function(req, res) {
    res.render('index', {});
});

router.get('/notice', function(req, res) {
    res.render('notice', {});
});

router.get('/timeout', function(req, res) {
    res.render('timeout', {});
});

router.get('/finddiff/:id', function(req, res) {
    Q.all([FinddiffServices.get(req.params.id),
           FinddiffServices.getVotes(req.params.id)
           ]).then(function(result) {
        var finddiff = result[0],
            votes = result[1] || [],
            rank = [];

        if (finddiff.nickname) {
            res.render('finddiff', {
                finddiff: finddiff, 
                votes: votes, 
                jsApi: {
                    appId: 'wx0f186d92b18bc5b0',
                    timestamp: req.cookies.timestamp || '',
                    nonceStr: req.cookies.nonceStr || '',
                    signature: req.cookies.signature || ''
                }
            });
        } else {
            console.error("not started");
            res.status(400).send('尚未认证!');
        }

    }, function(err) {
        console.error(err)
        res.status(404).send('读取相关数据异常!');
    });
});

router.get('/finddiff/:id/rank', function(req, res) {
    FinddiffServices.get(req.params.id)
    .then(function(finddiff) {
        res.render('rank', {finddiff: finddiff});
    }, function() {
        res.status(400).send('查询排行榜异常!');
    });
});

router.get('/finddiff/:id/grant', function(req, res) {
    FinddiffServices.get(req.params.id).then(function(finddiff) {
        res.cookie('finddiffId', req.params.id, { expires: new Date(Date.now() + 1000 * 60 * 30), httpOnly: true });
        var param = {
            debug:false,
            jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage'],
            url: conf.server_root + '/finddiff/' + finddiff.id
        };
        wechatApi.getJsConfig(param, function(err, result) {
            if (err) {
                console.error('JS SDK授权异常!');
                //return res.status(400).send('JS SDK授权异常!');
                return res.render('timeout', {});
            }

            res.cookie('timestamp', result.timestamp, { expires: new Date(Date.now() + 1000 * 60 * 30), httpOnly: true });
            res.cookie('nonceStr', result.nonceStr, { expires: new Date(Date.now() + 1000 * 60 * 30), httpOnly: true });
            res.cookie('signature', result.signature, { expires: new Date(Date.now() + 1000 * 60 * 30), httpOnly: true });

            // 强制授权
            var url = oauthClient.getAuthorizeURL(
                conf.server_root + '/finddiff/' + finddiff.id + '/fulfill',
                '',
                //'snsapi_base'
                'snsapi_userinfo'
            );
            res.redirect(url);
        });
    }, function() {
        res.status(404).send('尚未发起!');
    });
});

router.get('/finddiff/:id/fulfill', function(req, res) {
    FinddiffServices.get(req.params.id).then(function(finddiff) {
        if (req.query.code) {
            oauthClient.getAccessToken(req.query.code, function (err, result) {
                if (err) {
                    console.error(err);
                    //res.status(400).send('无法获得授权码');
                    res.render('timeout', {});
                    return;
                }
                var openid = result.data.openid;
                oauthClient.getUser(openid, function (err, result) {
                    if (err) {
                        console.error(err);
                        //res.status(400).send('无法获得用户信息');
                        res.render('timeout', {});
                        return;
                    }
                    var userInfo = result;
                    FinddiffServices.fulfill(finddiff.id, {
                        subOpenId: userInfo.openid,
                        headimgurl: userInfo.headimgurl,
                        nickname: userInfo.nickname
                    }).then(function() {
                        req.session.subOpenId = userInfo.openid;
                        res.redirect(conf.server_root + '/finddiff/' + finddiff.id);
                    }, function(err) {
                        console.error(err);
                        res.status(400).send('保存用户信息失败');
                    });
                });
            });
        } else {
            res.render('timeout', {});
            //res.status(400).send('未完成授权');
        }
    }, function() {
        res.status(404).send('尚未发起!');
    });
});

router.get('/finddiff/:id/fulfill.test', function(req, res) {
    FinddiffServices.get(req.params.id).then(function(finddiff) {
        var suffix = (new Date()).getTime();
        FinddiffServices.fulfill(req.params.id, {
            subOpenId: 'testopenid' + suffix,
            headimgurl: 'headimgurl' + suffix,
            nickname: 'nickname' + suffix
        }).then(function() {
            req.session.subOpenId = 'testopenid' + suffix;
            console.info(conf.server_root + '/finddiff/' + req.params.id);
            res.redirect(conf.server_root + '/finddiff/' + req.params.id);
        }, function(err) {
            console.error(err);
            res.status(400).send('保存用户信息失败');
        });
    }, function() {
        res.status(404).send('尚未发起!');
    });
});

router.get('/finddiff/:id/vote', function(req, res) {
    FinddiffServices.get(req.params.id).then(function(finddiff) {
        var url = oauthClient.getAuthorizeURL(
            conf.server_root + '/finddiff/' + finddiff.id + '/vote/confirm',
            '',
            'snsapi_userinfo'
        );
        res.redirect(url);
    }, function(err) {
        console.error(err);
        res.status(400).send('尚未发起!');
    });
});

router.get('/finddiff/:id/vote/confirm', function(req, res) {
    FinddiffServices.get(req.params.id).then(function(finddiff) {
        if (!finddiff.nickname) {
            res.status(400).send('资料不全');
        } else if (req.query.code) {
            oauthClient.getAccessToken(req.query.code, function (err, result) {
                if (err) {
                    console.error(err);
                    res.render('timeout', {});
                    //res.status(400).send('无法获得授权');
                    return;
                }
                var openid = result.data.openid;
                oauthClient.getUser(openid, function (err, result) {
                    if (err) {
                        console.error(err);
                        res.render('timeout', {});
                        //res.status(400).send('无法获得用户信息');
                        return;
                    }
                    var userInfo = result;
                    FinddiffServices.vote(finddiff.id, {
                        subOpenId: userInfo.openid,
                        headimgurl: userInfo.headimgurl,
                        nickname: userInfo.nickname
                    }).then(function() {
                        info.session.subOpenId = userInfo.openid;
                        res.redirect(conf.server_root + '/finddiff/' + req.params.id);
                    }, function(err) {
                        console.error(err);
                        res.redirect(conf.server_root + '/finddiff/' + req.params.id);
                    });
                });
            });
        } else {
            res.render('timeout', {});
            //res.status(400).send('未完成授权');
        }
    }, function() {
        res.status(404).send('尚未发起!');
    });
});

router.get('/finddiff/:id/vote/confirm.test', function(req, res) {
    FinddiffServices.get(req.params.id).then(function(finddiff) {
        var suffix = (new Date()).getTime();
        FinddiffServices.vote(req.params.id, {
            subOpenId: 'testopenid' + suffix,
            headimgurl: 'headimgurl' + suffix,
            nickname: 'nickname' + suffix
        }).then(function() {
            req.session.subOpenId = 'testopenid' + suffix;
            res.redirect(conf.server_root + '/finddiff/' + req.params.id);
        }, function(err) {
            console.error(err);
            res.status(400).send('保存用户信息失败');
        });
    }, function() {
        res.status(404).send('尚未发起!');
    });
});

router.get('/finddiff/:id/helpers', function(req, res) {
    // 从redis里面读出数据
    FinddiffServices.getVotes(req.params.id).then(function(paging) {
        console.info(paging);
        //res.status(200).send('votes');
        res.render('helpers', {helpers: paging});
    }, function(err) {
        console.info(err);
        res.status(400).send('获取投票历史失败!');
    });
});

// GET AJAX调用,更新某人分数
router.get('/finddiff/:id/bonus', function(req, res) {
    if (!req.session.subOpenId) {
        res.status(400).send('oauth is required!');
    }

    FinddiffServices.vote(req.params.id, {
        subOpenId: req.session.subOpenId,
        bonus: req.query.bonus,
    }).then(function() {
        res.status(200).send('bonus is updated!');
    }, function(err) {
        console.error(err);
        res.status(400).send('failed to update bonus');
    });
});

module.exports = router;