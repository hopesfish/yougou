var OAuth = require("wechat-oauth");
var express = require('express');
var router = express.Router();
var DreamServices = require("../services/DreamServices");
var conf = require("../conf");

var client = new OAuth('wxdc7c7ccc033ba612', '591bea60d3724af80f103e545b03a5d6');

/* GET home page. */
router.get('/', function(req, res) {
 	res.render('index', { title: 'Express' });
});

router.get('/dream/:id', function(req, res) {
	DreamServices.get(req.params.id).then(function(dream) {
		if (dream.nickname) {
			res.render('dream', dream);
		} else {
			res.status(400).send('尚未认证!');
		}
	}, function() {
		res.status(404).send('尚未发起!');
	});
});

router.get('/dream/:id/grant', function(req, res) {
	DreamServices.get(req.params.id).then(function(dream) {
		if (dream.nickname) {
			res.redirect('/dream/' + dream.id);
		} else {
			var url = client.getAuthorizeURL(
				conf.server_root + '/dream/' + dream.id + '/fulfill',
				'',
				'snsapi_userinfo'
			);
			res.redirect(url);
		}
	}, function() {
		res.status(404).send('尚未发起!');
	});
});

router.get('/dream/:id/fulfill', function(req, res) {
	DreamServices.get(req.params.id).then(function(dream) {
		if (dream.nickname) {
			res.redirect('/dream/' + dream.id);
		} else if (req.query.code) {
			client.getAccessToken(req.query.code, function (err, result) {
				if (err) {
					res.status(400).send('无法获得授权码');
					return;
				}
			  	var accessToken = result.data.access_token;
			  	var openid = result.data.openid;
			  	client.getUser(openid, function (err, result) {
			  		if (err) {
						res.status(400).send('无法获得用户信息');
						return;
					}
				 	var userInfo = result;
				 	DreamServices.fullfill(dream.id, {
				 		subOpenId: userInfo.openid,
                        headimgurl: userInfo.headimgurl,
                        nickname: userInfo.nickname
				 	}).then(function() {
				 		res.redirect('/dream/' + dream.id);
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

router.get('/dream/:id/vote', function(req, res) {
	DreamServices.get(req.params.id).then(function(dream) {
		var url = client.getAuthorizeURL(
			conf.server_root + '/dream/' + dream.id + '/vote/confirm',
			'',
			'snsapi_base'
		);
		res.redirect(url);
	}, function() {
		res.status(400).send('尚未发起!');
	});
});

router.get('/dream/:id/vote/confirm', function(req, res) {
	DreamServices.get(req.params.id).then(function(dream) {
		if (!dream.nickname) {
			res.status(400).send('资料不全');
		} else if (req.query.code) {
			client.getAccessToken(req.query.code, function (err, result) {
				if (err) {
					res.status(400).send('无法获得授权');
					return;
				}
			  	var openid = result.data.openid;
			 	DreamServices.vote(dream.id, {
			 		subOpenId: openid
			 	}).then(function() {
			 		res.status(200).send('投票成功,跳到公众号H5页');
			 	}, function() {
			 		res.status(400).send('投票失败');
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
