var assert = require("assert")
var async = require("async");
var base = require("./base");
var SERVER = base.config().SERVER;

module.exports = function() {
    describe('test finddiff api : ', function() {
        var openId = 'openid' + (new Date()).getTime();

        it('failed to get finddiff data without basic token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.queryPaging("/api/activity/finddiff", {token: 'basic-none'})
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
        it('success to get finddiff data with basic token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.queryPaging("/api/activity/finddiff", {token: 'basic-valid'})
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

        it('failed to start finddiff data without token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.get("/api/activity/finddiff/start?openId=" + openId, {token: 'basic-none'})
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

        var finddiffId;
        it('success to create finddiff data with basic token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.get("/api/activity/finddiff/start?openId=" + openId, {token: 'basic-valid'})
                    .then(function(finddiff) {
                        finddiffId = finddiff.id;
                        assert.equal(finddiff.openId, openId);
                        done();
                    }, function(err) {
                        console.info(err);
                        callback(new Error("should create a finddiff"));
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        it('success to start finddiff data with a same id', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.get("/api/activity/finddiff/start?openId=" + openId, {token: 'basic-valid'})
                    .then(function(finddiff) {
                        assert.equal(finddiff.id, finddiffId);
                        assert.equal(finddiff.openId, openId);
                        done();
                    }, function(err) {
                        console.info(err);
                        callback(new Error("should get a finddiff again"));
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        it('success to get finddiff list with basic token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.queryPaging("/api/activity/finddiff", {token: 'basic-valid'})
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

        it('success to get finddiff list with open id', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.queryPaging("/api/activity/finddiff?openId=" + openId, {token: 'basic-valid'})
                    .then(function(result) {
                        assert.equal(result.total, 1);
                        assert.equal(result.result[0].id, finddiffId);
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

        it('failed to update finddiff without token', function(done){
            async.series({
                action: function(callback){
                    base.update("/api/activity/finddiff/" + finddiffId, {
                        subOpenId: 'subOpenId' + finddiffId,
                        headimgurl: 'headimgurl' + finddiffId,
                        nickname: 'nickname' + finddiffId
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

        it('success to update finddiff without token', function(done){
            async.series({
                action: function(callback){
                    base.update("/api/activity/finddiff/" + finddiffId, {
                        subOpenId: 'subOpenId' + finddiffId,
                        headimgurl: 'headimgurl' + finddiffId,
                        nickname: 'nickname' + finddiffId
                    },{token: 'basic-valid'})
                    .then(function(result) {
                        assert.equal(result.subOpenId, 'subOpenId' + finddiffId);
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

        it('success to get finddiff rank', function(done){
            async.series({
                action: function(callback){
                    base.queryAll("/api/activity/finddiff/rank", {token: 'basic-valid'})
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