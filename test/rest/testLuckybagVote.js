var assert = require("assert")
var async = require("async");
var base = require("./base");
var SERVER = base.config().SERVER;

module.exports = function() {
    describe('test luckybag vote api : ', function() {
        var openId = 'openid' + (new Date()).getTime(),
            subOpenId = 'sub' + openId;

        var luckybagId;
        it('success to create luckybag data with basic token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.get("/api/activity/luckybag/start?openId=starter" + openId, {token: 'basic-valid'})
                    .then(function(luckybag) {
                        luckybagId = luckybag.id;
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

        it('failed to vote luckybag within token', function(done){
            async.series({
                action: function(callback){
                    base.create("/api/activity/luckybag/" + luckybagId + "/vote", {
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

        it('success to update luckybag without token', function(done){
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

        it('failed to vote luckybag for self', function(done){
            async.series({
                action: function(callback){
                    base.create("/api/activity/luckybag/" + luckybagId + "/vote", {
                        subOpenId: 'subOpenId' + luckybagId,
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
        it('success to vote luckybag within token', function(done){
            async.series({
                action: function(callback){
                    base.create("/api/activity/luckybag/" + luckybagId + "/vote", {
                        subOpenId: subOpenId,
                        headimgurl: 'voheadimgurl' + luckybagId,
                        nickname: 'vonickname' + luckybagId
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

        it('failed to vote luckybag within token again', function(done){
            async.series({
                action: function(callback){
                    base.create("/api/activity/luckybag/" + luckybagId + "/vote", {
                        subOpenId: subOpenId,
                        headimgurl: 'voheadimgurl' + luckybagId,
                        nickname: 'vonickname' + luckybagId
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
                    base.queryPaging("/api/activity/luckybag/" + luckybagId + "/vote", {token: 'basic-valid'})
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