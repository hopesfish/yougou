var OAuth = require("wechat-oauth");
var express = require('express');
var router = express.Router();
var DreamServices = require("../services/DreamServices");
var conf = require("../conf");

var api = new OAuth('wxdc7c7ccc033ba612', '591bea60d3724af80f103e545b03a5d6');

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
			var url = api.getAuthorizeURL(
				conf.server_root + '/dream/' + dream.id + '/fulfill',
				'',
				'snsapi_userinfo'
			);
			res.status(200).send(url);
		}
	}, function() {
		res.status(404).send('尚未发起!');
	});
});

router.get('/dream/:id/fulfill', function(req, res) {
	DreamServices.get(req.params.id).then(function(dream) {
		if (dream.nickname) {
			res.redirect('/dream/' + dream.id);
		} else {
			// TODO
		}
	}, function() {
		res.status(404).send('尚未发起!');
	});
});

module.exports = router;
