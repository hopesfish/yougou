var assert = require("assert")
var async = require("async");
var base = require("./base");
var SERVER = base.config().SERVER;

module.exports = function() {
    describe('test luckybag api : ', function() {
        var openId = 'openid' + (new Date()).getTime();

        it('failed to get luckybag data without basic token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.queryPaging("/api/activity/luckybag", {token: 'basic-none'})
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
        it('success to get luckybag data with basic token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.queryPaging("/api/activity/luckybag", {token: 'basic-valid'})
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

        it('failed to start luckybag data without token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.get("/api/activity/luckybag/start?openId=" + openId, {token: 'basic-none'})
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

        var luckybagId;
        it('success to create luckybag data with basic token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.get("/api/activity/luckybag/start?openId=" + openId, {token: 'basic-valid'})
                    .then(function(luckybag) {
                        luckybagId = luckybag.id;
                        assert.equal(luckybag.openId, openId);
                        done();
                    }, function(err) {
                        console.info(err);
                        callback(new Error("should create a luckybag"));
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        it('success to start luckybag data with a same id', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.get("/api/activity/luckybag/start?openId=" + openId, {token: 'basic-valid'})
                    .then(function(luckybag) {
                        assert.equal(luckybag.id, luckybagId);
                        assert.equal(luckybag.openId, openId);
                        done();
                    }, function(err) {
                        console.info(err);
                        callback(new Error("should get a luckybag again"));
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        it('success to get luckybag list with basic token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.queryPaging("/api/activity/luckybag", {token: 'basic-valid'})
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

        it('success to get luckybag list with open id', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.queryPaging("/api/activity/luckybag?openId=" + openId, {token: 'basic-valid'})
                    .then(function(result) {
                        assert.equal(result.total, 1);
                        assert.equal(result.result[0].id, luckybagId);
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

        it('failed to update luckybag without token', function(done){
            async.series({
                action: function(callback){
                    base.update("/api/activity/luckybag/" + luckybagId, {
                        subOpenId: 'subOpenId' + luckybagId,
                        headimgurl: 'headimgurl' + luckybagId,
                        nickname: 'nickname' + luckybagId
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

        it('success to update luckybag with token', function(done){
            async.series({
                action: function(callback){
                    base.update("/api/activity/luckybag/" + luckybagId, {
                        subOpenId: 'subOpenId' + luckybagId,
                        headimgurl: 'headimgurl' + luckybagId,
                        nickname: 'nickname' + luckybagId
                    },{token: 'basic-valid'})
                    .then(function(result) {
                        assert.equal(result.subOpenId, 'subOpenId' + luckybagId);
                        done();
                    }, function(err) {
                        console.info(err);
                        callback(new Error("should updated"));
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        it('failed to exchange luckybag without token', function(done){
            async.series({
                action: function(callback){
                    base.update("/api/activity/luckybag/" + luckybagId + '/actions/exchange', {
                        bag: '38'
                    },{token: 'basic-invalid'})
                    .then(function(result) {
                        callback(new Error("should not exchange"));
                    }, function(err) {
                        done();
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        it('success to exchange luckybag with token', function(done){
            async.series({
                action: function(callback){
                    base.update("/api/activity/luckybag/" + luckybagId + '/actions/exchange', {
                        bag: '38'
                    },{token: 'basic-valid'})
                    .then(function(result) {
                        done();
                    }, function(err) {
                        callback(new Error("should exchange"));
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        it('fail to exchange luckybag with token again', function(done){
            async.series({
                action: function(callback){
                    base.update("/api/activity/luckybag/" + luckybagId + '/actions/exchange', {
                        bag: '38'
                    },{token: 'basic-valid'})
                    .then(function(result) {
                        callback(new Error("should not exchange again"));
                    }, function(err) {
                        done();
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        it('success to get luckybag winner', function(done){
            async.series({
                action: function(callback){
                    base.queryAll("/api/activity/luckybag/rank", {token: 'basic-valid'})
                    .then(function(result) {
                        done();
                    }, function(err) {
                        console.info(err);
                        callback(new Error("should get winner"));
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });
    });
}