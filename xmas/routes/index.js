var Q = require("q");
var OAuth = require("wechat-oauth");
var express = require('express');
var router = express.Router();
var conf = require("../conf");
var XmasServices = require("../services/XmasServices");

var client = new OAuth('wxdc7c7ccc033ba612', '591bea60d3724af80f103e545b03a5d6');

/* GET home page. */
router.get('/', function(req, res) {
 	res.render('index', { title: 'Express' });
});

router.get('/xmas/winner', function(req, res) {
	XmasServices.getWinners().then(function(winners) {
		var len = winners.length;
		for (var i=0; i<len; i++) {
			var winner = winners[i];
			if (/[A-Z0-9]*/.test(winner.prize)) {
				winner.prize = '一张购物卡';
			}
		}
		res.render('winner', {winners: winners});
	}, function(err) {
		console.info(err);
		res.status(400).send('获取投票历史失败!');
	});
});

router.get('/xmas/:id', function(req, res) {
	XmasServices.get(req.params.id).then(function(xmas) {
		if (xmas.nickname) {
			var voteable = req.cookies.xmasId != req.params.id;
			res.render('detail', {xmas: xmas, voteable: voteable});
		} else {
			res.status(400).send('尚未认证!');
		}
	}, function(err) {
		res.status(404).send('尚未发起!');
	});
});

router.get('/xmas/:id/tree', function(req, res) {
	Q.all([XmasServices.get(req.params.id), XmasServices.getVotes(req.params.id)]).then(function(result) {
		var xmas = result[0], votes = result[1].result;

		if (xmas.nickname) {
			var voteable = req.cookies.xmasId != req.params.id;
			res.render('tree', {xmas: xmas, voteable: voteable, votes: votes});
		} else {
			res.status(400).send('尚未认证!');
		}

	}, function(err) {
		console.error(err);
		res.status(404).send('尚未发起!');
	});
});

router.get('/xmas/:id/grant', function(req, res) {
	XmasServices.get(req.params.id).then(function(xmas) {
		res.cookie('xmasId', req.params.id, { expires: new Date(Date.now() + 1000 * 60 * 30), httpOnly: true });
		if (xmas.nickname) {
			res.redirect('/xmas/' + xmas.id);
		} else {
			var url = client.getAuthorizeURL(
				conf.server_root + '/xmas/' + xmas.id + '/fulfill',
				'',
				'snsapi_userinfo'
			);
			res.redirect(url);
		}
	}, function() {
		res.status(404).send('尚未发起!');
	});
});

router.get('/xmas/:id/fulfill', function(req, res) {
	XmasServices.get(req.params.id).then(function(xmas) {
		if (xmas.nickname) {
			res.redirect('/xmas/' + xmas.id);
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
				 	XmasServices.fulfill(xmas.id, {
				 		subOpenId: userInfo.openid,
                        headimgurl: userInfo.headimgurl,
                        nickname: userInfo.nickname
				 	}).then(function() {
				 		res.redirect('/xmas/' + xmas.id);
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

router.get('/xmas/:id/vote', function(req, res) {
	XmasServices.get(req.params.id).then(function(xmas) {
		var url = client.getAuthorizeURL(
			conf.server_root + '/xmas/' + xmas.id + '/vote/confirm',
			'',
			'snsapi_userinfo'
		);
		res.redirect(url);
	}, function() {
		res.status(400).send('尚未发起!');
	});
});

router.get('/xmas/:id/vote/confirm', function(req, res) {
	XmasServices.get(req.params.id).then(function(xmas) {
		if (!xmas.nickname) {
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
					XmasServices.vote(xmas.id, {
				 		subOpenId: userInfo.openid,
				 		headimgurl: userInfo.headimgurl,
                        nickname: userInfo.nickname
				 	}).then(function() {
				 		res.redirect("http://mp.weixin.qq.com/s?__biz=MjM5NDA3MTk2MA==&mid=203104383&idx=2&sn=aedf568def1f8efa0408379303eb3286#rd");
				 	}, function() {
				 		res.redirect("http://mp.weixin.qq.com/s?__biz=MjM5NDA3MTk2MA==&mid=203104383&idx=3&sn=3cda170414cffbc7ac9a18838a8c1c58#rd");
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

module.exports = router;
