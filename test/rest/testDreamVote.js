var assert = require("assert")
var async = require("async");
var base = require("./base");
var SERVER = base.config().SERVER;

module.exports = function() {
    describe('test vote api : ', function() {
        var openId = 'openid' + (new Date()).getTime(),
            subOpenId = 'sub' + openId;

        var dreamId;
        it('success to create dream data with basic token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.get("/api/activity/dream/start?openId=starter" + openId, {token: 'basic-valid'})
                    .then(function(dream) {
                        dreamId = dream.id;
                        done();
                    }, function(err) {
                        console.info(err);
                        callback(new Error("should create a dream"));
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        it('failed to vote dream within token', function(done){
            async.series({
                action: function(callback){
                    base.create("/api/activity/dream/" + dreamId + "/vote", {
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

        it('success to update dream without token', function(done){
            async.series({
                action: function(callback){
                    base.update("/api/activity/dream/" + dreamId, {
                        subOpenId: 'subOpenId' + dreamId,
                        headimgurl: 'headimgurl' + dreamId,
                        nickname: 'nickname' + dreamId
                    },{token: 'basic-valid'})
                    .then(function(result) {
                        assert.equal(result.subOpenId, 'subOpenId' + dreamId);
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

        it('failed to vote dream for self', function(done){
            async.series({
                action: function(callback){
                    base.create("/api/activity/dream/" + dreamId + "/vote", {
                        subOpenId: 'subOpenId' + dreamId,
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
        it('success to vote dream within token', function(done){
            async.series({
                action: function(callback){
                    base.create("/api/activity/dream/" + dreamId + "/vote", {
                        subOpenId: subOpenId,
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

        it('failed to vote dream within token again', function(done){
            async.series({
                action: function(callback){
                    base.create("/api/activity/dream/" + dreamId + "/vote", {
                        subOpenId: subOpenId,
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
                    base.queryPaging("/api/activity/dream/" + dreamId + "/vote", {token: 'basic-valid'})
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