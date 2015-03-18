var assert = require("assert")
var async = require("async");
var base = require("./base");
var SERVER = base.config().SERVER;

module.exports = function() {
    describe('test result api : ', function() {
        var unionId = 'unionId' + (new Date()).getTime(),
            subOpenId = 'sub' + unionId;

        var finddiffId;
        it('success to create finddiff data with basic token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.get("/api/activity/finddiff/start?unionId=starter" + unionId, {token: 'basic-valid'})
                    .then(function(finddiff) {
                        finddiffId = finddiff.id;
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

        it('success to update finddiff without token', function(done){
            async.series({
                action: function(callback){
                    base.update("/api/activity/finddiff/" + finddiffId, {
                        subOpenId: subOpenId,
                        headimgurl: 'headimgurl' + finddiffId,
                        nickname: 'nickname' + finddiffId
                    },{token: 'basic-valid'})
                    .then(function(result) {
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

        it('fail to result finddiff within token', function(done){
            async.series({
                action: function(callback){
                    base.create("/api/activity/finddiff/" + finddiffId + "/result", {
                        subOpenId: subOpenId,
                        headimgurl: 'voheadimgurl' + finddiffId,
                        nickname: 'vonickname' + finddiffId,
                        bonus: 10
                    },{token: 'basic-invalid'})
                    .then(function(id) {
                        callback(new Error("should not updated"));
                    }, function(err) {
                        done();
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        it('success to result finddiff within token', function(done){
            async.series({
                action: function(callback){
                    base.create("/api/activity/finddiff/" + finddiffId + "/result", {
                        subOpenId: subOpenId,
                        headimgurl: 'voheadimgurl' + finddiffId,
                        nickname: 'vonickname' + finddiffId,
                        bonus: 10
                    }, {token: 'basic-valid'})
                    .then(function(id) {
                        resultId = id;
                        done();
                    }, function(err) {
                        console.info(err);
                        callback(new Error("should resultd"));
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        it('success to result finddiff within token 2nd', function(done){
            async.series({
                action: function(callback){
                    base.create("/api/activity/finddiff/" + finddiffId + "/result", {
                        subOpenId: subOpenId,
                        headimgurl: 'voheadimgurl' + finddiffId,
                        nickname: 'vonickname' + finddiffId,
                        bonus: 9
                    }, {token: 'basic-valid'})
                    .then(function(id) {
                        resultId = id;
                        done();
                    }, function(err) {
                        console.info(err);
                        callback(new Error("should resultd"));
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        it('success to result finddiff within token 2nd without img', function(done){
            async.series({
                action: function(callback){
                    base.create("/api/activity/finddiff/" + finddiffId + "/result", {
                        subOpenId: subOpenId,
                        bonus: 9
                    }, {token: 'basic-valid'})
                    .then(function(id) {
                        resultId = id;
                        done();
                    }, function(err) {
                        console.info(err);
                        callback(new Error("should resultd"));
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        it('success to get result list', function(done){
            async.series({
                action: function(callback){
                    base.queryPaging("/api/activity/finddiff/" + finddiffId + "/result", {token: 'basic-valid'})
                    .then(function(paging) {
                        assert(paging.result[0].bonus, 10);
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

        it('success to result finddiff within token 3rd', function(done){
            async.series({
                action: function(callback){
                    base.create("/api/activity/finddiff/" + finddiffId + "/result", {
                        subOpenId: subOpenId,
                        headimgurl: 'voheadimgurl' + finddiffId,
                        nickname: 'vonickname' + finddiffId,
                        bonus: 11
                    }, {token: 'basic-valid'})
                    .then(function(id) {
                        resultId = id;
                        done();
                    }, function(err) {
                        console.info(err);
                        callback(new Error("should resultd"));
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        it('success to get result list', function(done){
            async.series({
                action: function(callback){
                    base.queryPaging("/api/activity/finddiff/" + finddiffId + "/result", {token: 'basic-valid'})
                    .then(function(paging) {
                        assert(paging.result[0].bonus, 11);
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