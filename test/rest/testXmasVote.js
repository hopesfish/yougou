var assert = require("assert")
var async = require("async");
var base = require("./base");
var SERVER = base.config().SERVER;

module.exports = function() {
    describe('test vote api : ', function() {
        var openId = 'openid' + (new Date()).getTime(),
            subOpenId = 'sub' + openId;

        var xmasId;
        it('success to create xmas data with basic token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.get("/api/activity/xmas/start?openId=starter" + openId, {token: 'basic-valid'})
                    .then(function(xmas) {
                        xmasId = xmas.id;
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

        it('failed to vote xmas within token', function(done){
            async.series({
                action: function(callback){
                    base.create("/api/activity/xmas/" + xmasId + "/vote", {
                        subOpenId: 'starter' + subOpenId,
                    },{token: 'basic-valid'})
                    .then(function(id) {
                        callback(new Error("should not voted"));
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
                        callback(new Error("should updated"));
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        it('failed to vote xmas for self', function(done){
            async.series({
                action: function(callback){
                    base.create("/api/activity/xmas/" + xmasId + "/vote", {
                        subOpenId: 'subOpenId' + xmasId,
                    },{token: 'basic-valid'})
                    .then(function(id) {
                        callback(new Error("should not voted"));
                    }, function(err) {
                        done();
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        var voteId = null;
        it('success to vote xmas within token', function(done){
            async.series({
                action: function(callback){
                    base.create("/api/activity/xmas/" + xmasId + "/vote", {
                        subOpenId: subOpenId,
                        headimgurl: 'voheadimgurl' + xmasId,
                        nickname: 'vonickname' + xmasId
                    },{token: 'basic-valid'})
                    .then(function(id) {
                        voteId = id;
                        done();
                    }, function(err) {
                        console.info(err);
                        callback(new Error("should voted"));
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        it('failed to vote xmas within token again', function(done){
            async.series({
                action: function(callback){
                    base.create("/api/activity/xmas/" + xmasId + "/vote", {
                        subOpenId: subOpenId,
                        headimgurl: 'voheadimgurl' + xmasId,
                        nickname: 'vonickname' + xmasId
                    },{token: 'basic-valid'})
                    .then(function(id) {
                        console.info(err);
                        callback(new Error("should not voted"));
                    }, function(err) {
                        done();
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        it('success to get vote list', function(done){
            async.series({
                action: function(callback){
                    base.queryPaging("/api/activity/xmas/" + xmasId + "/vote", {token: 'basic-valid'})
                    .then(function(paging) {
                        done();
                    }, function(err) {
                        console.info(err);
                        callback(new Error("should get the list"));
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });
    });
}