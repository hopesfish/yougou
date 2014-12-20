var assert = require("assert")
var async = require("async");
var base = require("./base");
var SERVER = base.config().SERVER;

module.exports = function() {
    describe('test xmas api : ', function() {
        var openId = 'openid' + (new Date()).getTime();

        it('failed to get xmas data without basic token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.queryPaging("/api/activity/xmas", {token: 'basic-none'})
                    .then(function(err) {
                        callback(err);
                    }, function(err) {
                        done();
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });
        
        var total = 0;
        it('success to get xmas data with basic token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.queryPaging("/api/activity/xmas", {token: 'basic-valid'})
                    .then(function(result) {
                        total = result.total;
                        done();
                    }, function(err) {
                        console.info(err);
                        callback(err);
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });
        
        it('failed to start xmas data without token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.get("/api/activity/xmas/start?openId=" + openId, {token: 'basic-none'})
                    .then(function(id) {
                        callback(new Error("token is required"));
                    }, function(err) {
                        done();
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        var xmasId;
        it('success to create xmas data with basic token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.get("/api/activity/xmas/start?openId=" + openId, {token: 'basic-valid'})
                    .then(function(xmas) {
                        xmasId = xmas.id;
                        assert.equal(xmas.openId, openId);
                        done();
                    }, function(err) {
                        console.info(err);
                        callback(new Error("should create a xmas"));
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        it('success to start xmas data with a same id', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.get("/api/activity/xmas/start?openId=" + openId, {token: 'basic-valid'})
                    .then(function(xmas) {
                        assert.equal(xmas.id, xmasId);
                        assert.equal(xmas.openId, openId);
                        done();
                    }, function(err) {
                        console.info(err);
                        callback(new Error("should get a xmas again"));
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        it('success to get xmas list with basic token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.queryPaging("/api/activity/xmas", {token: 'basic-valid'})
                    .then(function(result) {
                        assert.equal(result.total, total + 1);
                        done();
                    }, function(err) {
                        console.info(err);
                        callback(err);
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        it('success to get xmas list with open id', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.queryPaging("/api/activity/xmas?openId=" + openId, {token: 'basic-valid'})
                    .then(function(result) {
                        assert.equal(result.total, 1);
                        assert.equal(result.result[0].id, xmasId);
                        done();
                    }, function(err) {
                        console.info(err);
                        callback(err);
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        it('failed to update xmas without token', function(done){
            async.series({
                action: function(callback){
                    base.update("/api/activity/xmas/" + xmasId, {
                        subOpenId: 'subOpenId' + xmasId,
                        headimgurl: 'headimgurl' + xmasId,
                        nickname: 'nickname' + xmasId
                    },{token: 'basic-invalid'})
                    .then(function(result) {
                        callback(new Error("should not updated"));
                    }, function(err) {
                        done();
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        it('success to update xmas without token', function(done){
            async.series({
                action: function(callback){
                    base.update("/api/activity/xmas/" + xmasId, {
                        subOpenId: 'subOpenId' + xmasId,
                        headimgurl: 'headimgurl' + xmasId,
                        nickname: 'nickname' + xmasId
                    },{token: 'basic-valid'})
                    .then(function(result) {
                        assert.equal(result.subOpenId, 'subOpenId' + xmasId);
                        done();
                    }, function(err) {
                        console.info(err);
                        callback(new Error("should not updated"));
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });
    });
}