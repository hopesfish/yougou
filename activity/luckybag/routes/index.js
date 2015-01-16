var OAuth = require("wechat-oauth");
var express = require('express');
var router = express.Router();
var conf = require("../conf");
var LuckyServices = require("../services/LuckyServices");

var client = new OAuth('wxdc7c7ccc033ba612', '591bea60d3724af80f103e545b03a5d6');

/* GET home page. */
router.get('/', function(req, res) {
 	res.render('index', { title: 'Express' });
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
	LuckyServices.get(req.params.id).then(function(luckybag) {
		if (luckybag.nickname) {
			var voteable = req.cookies.luckybagId != req.params.id;
			res.render('luckybag', {luckybag: luckybag, voteable: voteable});
		} else {
			res.status(400).send('尚未认证!');
		}
	}, function() {
		res.status(404).send('尚未发起!');
	});
});

router.get('/luckybag/:id/grant', function(req, res) {
	LuckyServices.get(req.params.id).then(function(luckybag) {
		res.cookie('luckybagId', req.params.id, { expires: new Date(Date.now() + 1000 * 60 * 30), httpOnly: true });
		if (luckybag.nickname) {
			res.redirect('/luckybag/' + luckybag.id);
		} else {
			var url = client.getAuthorizeURL(
				conf.server_root + '/luckybag/' + luckybag.id + '/fulfill',
				'',
				'snsapi_userinfo'
			);
			res.redirect(url);
		}
	}, function() {
		res.status(404).send('尚未发起!');
	});
});

router.get('/luckybag/:id/fulfill', function(req, res) {
	LuckyServices.get(req.params.id).then(function(luckybag) {
		if (luckybag.nickname) {
			res.redirect('/luckybag/' + luckybag.id);
		} else if (req.query.code) {
			client.getAccessToken(req.query.code, function (err, result) {
				if (err) {
					res.status(400).send('无法获得授权码');
					return;
				}
			  	var openid = result.data.openid;
			  	client.getUser(openid, function (err, result) {
			  		if (err) {
						res.status(400).send('无法获得用户信息');
						return;
					}
				 	var userInfo = result;
				 	LuckyServices.fulfill(luckybag.id, {
				 		subOpenId: userInfo.openid,
                        headimgurl: userInfo.headimgurl,
                        nickname: userInfo.nickname
				 	}).then(function() {
				 		res.redirect('/luckybag/' + luckybag.id);
				 	}, function() {
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
	return false;
	var suffix = (new Date()).getTime();
 	LuckyServices.fulfill(req.params.id, {
 		subOpenId: 'testopenid' + suffix,
        headimgurl: 'headimgurl' + suffix,
        nickname: 'nickname' + suffix
 	}).then(function() {
 		res.redirect('/luckybag/' + req.params.id);
 	}, function() {
 		res.status(400).send('保存用户信息失败');
 	});
});

router.get('/luckybag/:id/vote', function(req, res) {
	LuckyServices.get(req.params.id).then(function(luckybag) {
		var url = client.getAuthorizeURL(
			conf.server_root + '/luckybag/' + luckybag.id + '/vote/confirm',
			'',
			'snsapi_userinfo'
		);
		res.redirect(url);
	}, function() {
		res.status(400).send('尚未发起!');
	});
});

router.get('/luckybag/:id/vote/confirm', function(req, res) {
	LuckyServices.get(req.params.id).then(function(luckybag) {
		if (!luckybag.nickname) {
			res.status(400).send('资料不全');
		} else if (req.query.code) {
			client.getAccessToken(req.query.code, function (err, result) {
				if (err) {
					res.status(400).send('无法获得授权');
					return;
				}
			 	var openid = result.data.openid;
			  	client.getUser(openid, function (err, result) {
			  		if (err) {
						res.status(400).send('无法获得用户信息');
						return;
					}
					var userInfo = result;
					LuckyServices.vote(luckybag.id, {
				 		subOpenId: userInfo.openid,
				 		headimgurl: userInfo.headimgurl,
                        nickname: userInfo.nickname
				 	}).then(function() {
				 		res.status(200).send('OK');
				 	}, function(err) {
				 		console.error(err);
				 		res.status(200).send('Failed');
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
 		res.status(200).send('voted');
 		//res.redirect('/luckybag/' + req.params.id);
 	}, function(err) {
 		console.info(err);
 		res.status(400).send('提交用户投票信息失败');
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
