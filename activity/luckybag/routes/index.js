var Q = require("q");
var OAuth = require("wechat-oauth");
var API = require('wechat-api');
var express = require('express');
var router = express.Router();
var conf = require("../conf");
var LuckyServices = require("../services/LuckyServices");

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
var wechatApi = new API('wxdc7c7ccc033ba612', '591bea60d3724af80f103e545b03a5d6', function(callback) {
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

router.get('/start', function(req, res) {
	res.redirect("http://mp.weixin.qq.com/s?__biz=MjM5NDA3MTk2MA==&mid=204032066&idx=1&sn=c2fae68468acec7811c80fd596c3ae05#rd");
});

router.get('/howto', function(req, res) {
 	res.render('howto', {});
});

router.get('/luckybag/rank', function(req, res) {
	// TODO 从redis里面读出来
	LuckyServices.queryRank({
	}).then(function(paging) {
		res.render('rank', {luckybags: paging.result});
	}, function() {
		res.status(400).send('查询排行榜异常!');
	});
});

router.get('/luckybag/:id', function(req, res) {

	Q.all([LuckyServices.get(req.params.id),
		   LuckyServices.getVotes(req.params.id),
		   LuckyServices.queryRank()]).then(function(result) {
		var luckybag = result[0],
			votes = result[1] || [],
			rank = result[2];

		if (luckybag.nickname) {
			var voteable = req.cookies.luckybagId != req.params.id;
			var voted = 'unvoted';
			if (req.query.voted === 'true') {
				voted = 'success';
			}
			if (req.query.voted === 'false') {
				voted = 'failed';
			}
			res.render('luckybag', {
				luckybag: luckybag, 
				rank: rank, 
				votes: votes, 
				voteable: voteable, 
				voted: voted,
				jsApi: {
					appId: 'wxdc7c7ccc033ba612',
					timestamp: req.cookies.timestamp,
					nonceStr: req.cookies.nonceStr,
					signature: req.cookies.signature
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

router.get('/luckybag/:id/grant', function(req, res) {
	LuckyServices.get(req.params.id).then(function(luckybag) {
		res.cookie('luckybagId', req.params.id, { expires: new Date(Date.now() + 1000 * 60 * 30), httpOnly: true });
		var param = {
			debug:false,
		 	jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage'],
		 	url: conf.server_root + '/luckybag/' + luckybag.id
		};
		wechatApi.getJsConfig(param, function(err, result) {
			if (err) {
				return res.status(400).send('JS SDK授权异常!');
			}
			res.cookie('timestamp', result.timestamp, { expires: new Date(Date.now() + 1000 * 60 * 30), httpOnly: true });
			res.cookie('nonceStr', result.nonceStr, { expires: new Date(Date.now() + 1000 * 60 * 30), httpOnly: true });
			res.cookie('signature', result.signature, { expires: new Date(Date.now() + 1000 * 60 * 30), httpOnly: true });

			if (luckybag.nickname) {
				res.redirect('/luckybag/' + luckybag.id);
			} else {
				var url = oauthClient.getAuthorizeURL(
					conf.server_root + '/luckybag/' + luckybag.id + '/fulfill',
					'',
					'snsapi_userinfo'
				);
				res.redirect(url);
			}
		});
	}, function() {
		res.status(404).send('尚未发起!');
	});
});

router.get('/luckybag/:id/grant.test', function(req, res) {
	res.cookie('luckybagId', req.params.id, { expires: new Date(Date.now() + 1000 * 60 * 30), httpOnly: true });
	res.redirect('/luckybag/' + req.params.id);
});

router.get('/luckybag/:id/fulfill', function(req, res) {
	LuckyServices.get(req.params.id).then(function(luckybag) {
		if (luckybag.nickname) {
			res.redirect('/luckybag/' + luckybag.id);
		} else if (req.query.code) {
			oauthClient.getAccessToken(req.query.code, function (err, result) {
				if (err) {
					console.error(err);
					res.status(400).send('无法获得授权码');
					return;
				}
			  	var openid = result.data.openid;
			  	oauthClient.getUser(openid, function (err, result) {
			  		if (err) {
			  			console.error(err);
						res.status(400).send('无法获得用户信息');
						return;
					}
				 	var userInfo = result;
				 	LuckyServices.fulfill(luckybag.id, {
				 		subOpenId: userInfo.openid,
                        headimgurl: userInfo.headimgurl,
                        nickname: userInfo.nickname
				 	}).then(function() {
				 		res.cookie('luckybagId', req.params.id, { expires: new Date(Date.now() + 1000 * 60 * 30), httpOnly: true });
				 		res.redirect('/luckybag/' + luckybag.id);
				 	}, function(err) {
				 		console.error(err);
				 		res.status(400).send('保存用户信息失败');
				 	});
				});
			});
		} else {
			res.status(400).send('未完成授权');
		}
	}, function() {
		res.status(404).send('尚未发起!');
	});
});

router.get('/luckybag/:id/fulfill.test', function(req, res) {
	var suffix = (new Date()).getTime();
 	LuckyServices.fulfill(req.params.id, {
 		subOpenId: 'testopenid' + suffix,
        headimgurl: 'headimgurl' + suffix,
        nickname: 'nickname' + suffix
 	}).then(function() {
 		res.cookie('luckybagId', req.params.id, { expires: new Date(Date.now() + 1000 * 60 * 30), httpOnly: true });
 		res.redirect('/luckybag/' + req.params.id);
 	}, function(err) {
 		console.error(err);
 		res.status(400).send('保存用户信息失败');
 	});
});

router.get('/luckybag/:id/vote', function(req, res) {
	LuckyServices.get(req.params.id).then(function(luckybag) {
		var url = oauthClient.getAuthorizeURL(
			conf.server_root + '/luckybag/' + luckybag.id + '/vote/confirm',
			'',
			'snsapi_userinfo'
		);
		res.redirect(url);
	}, function(err) {
		console.error(err);
		res.status(400).send('尚未发起!');
	});
});

router.get('/luckybag/:id/vote/confirm', function(req, res) {
	LuckyServices.get(req.params.id).then(function(luckybag) {
		if (!luckybag.nickname) {
			res.status(400).send('资料不全');
		} else if (req.query.code) {
			oauthClient.getAccessToken(req.query.code, function (err, result) {
				if (err) {
					console.error(err);
					res.status(400).send('无法获得授权');
					return;
				}
			 	var openid = result.data.openid;
			  	oauthClient.getUser(openid, function (err, result) {
			  		if (err) {
			  			console.error(err);
						res.status(400).send('无法获得用户信息');
						return;
					}
					var userInfo = result;
					LuckyServices.vote(luckybag.id, {
				 		subOpenId: userInfo.openid,
				 		headimgurl: userInfo.headimgurl,
                        nickname: userInfo.nickname
				 	}).then(function() {
				 		res.redirect('/luckybag/' + req.params.id + '?voted=true');
				 	}, function(err) {
				 		console.error(err);
				 		res.redirect('/luckybag/' + req.params.id + '?voted=false');
				 	});
				});
			});
		} else {
			res.status(400).send('未完成授权');
		}
	}, function() {
		res.status(404).send('尚未发起!');
	});
});

router.get('/luckybag/:id/vote/confirm.test', function(req, res) {
	var suffix = (new Date()).getTime();
 	LuckyServices.vote(req.params.id, {
 		subOpenId: 'voteopenid' + suffix,
        headimgurl: 'voteimgurl' + suffix,
        nickname: 'votename' + suffix
 	}).then(function() {
 		res.redirect('/luckybag/' + req.params.id + '?voted=true');
 	}, function(err) {
 		console.error(err);
 		res.redirect('/luckybag/' + req.params.id + '?voted=false');
 	});
});

router.get('/luckybag/:id/votes', function(req, res) {
	// 从redis里面读出数据
	LuckyServices.getVotes(req.params.id).then(function(paging) {
		console.info(paging.length);
		res.status(200).send('votes');
		//res.render('votes', {votes: paging.result});
	}, function(err) {
		console.info(err);
		res.status(400).send('获取投票历史失败!');
	});
});

module.exports = router;
