var assert = require("assert")
var async = require("async");
var base = require("./base");
var SERVER = base.config().SERVER;

module.exports = function() {
    describe('test restrict api : ', function(){

        var activityId, uid = 'uid' + (new Date()).getTime();
        it('success to create activity data with basic token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.create("/api/activity", {name: '活动', type: 1, code: 'HD' + (new Date()).getTime(), reply: '普通回复', restrictDays: 1, restrictDaysReply: '限制回复'}, {token: 'basic-valid'})
                    .then(function(id) {
                        activityId = id;
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
        
        it('success to get the activity data within token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.get("/api/activity/" + activityId, {token: 'basic-valid'})
                    .then(function(activity) {
                        assert.equal(activity.reply, "普通回复");
                        assert.equal(activity.restrictDays, 1);
                        assert.equal(activity.restrictDaysReply, "限制回复");
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

        var couponCode = 'CP1' + (new Date()).getTime();
        it('success to create coupon data with basic token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.create("/api/activity/" + activityId + "/coupon", {batch: 'batch1', code: couponCode}, {token: 'basic-valid'})
                    .then(function(id) {
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

        it('success to achieve a coupon data with basic token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.queryAll("/api/activity/" + activityId + "/achieve?openId=" + uid, {token: 'basic-valid'})
                    .then(function(coupons) {
                        assert.equal(coupons[0], couponCode);
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

        // 第二个活动没有任何限制，依然可以继续领取
        var secActivityId;
        it('success to create a sec activity data with basic token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.create("/api/activity", {name: '活动2', type: 1, code: 'HD2' + (new Date()).getTime(), reply: '普通回复', restrictDays: 0, restrictDaysReply: '限制回复'}, {token: 'basic-valid'})
                    .then(function(id) {
                        secActivityId = id;
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
        
        it('success to create coupon data with basic token', function(done){
            // an example using an object instead of an array
            couponCode = 'CP2' + (new Date()).getTime();
            async.series({
                action: function(callback){
                    base.create("/api/activity/" + secActivityId + "/coupon", {batch: 'batch1', code: couponCode}, {token: 'basic-valid'})
                    .then(function(id) {
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

        it('success to achieve a coupon data with basic token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.queryAll("/api/activity/" + secActivityId + "/achieve?openId=" + uid, {token: 'basic-valid'})
                    .then(function(coupons) {
                        assert.equal(coupons[0], couponCode);
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

        // 第三个活动有任何限制，无法领取
        var thirdActivityId;
        it('success to create a sec activity data with basic token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.create("/api/activity", {name: '活动3', type: 1, code: 'HD3' + (new Date()).getTime(), reply: '普通回复', restrictDays: 1, restrictDaysReply: '限制回复'}, {token: 'basic-valid'})
                    .then(function(id) {
                        thirdActivityId = id;
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
        
        it('success to create coupon data with basic token', function(done){
            // an example using an object instead of an array
            couponCode = 'CP3' + (new Date()).getTime();
            async.series({
                action: function(callback){
                    base.create("/api/activity/" + thirdActivityId + "/coupon", {batch: 'batch1', code: couponCode}, {token: 'basic-valid'})
                    .then(function(id) {
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

        it('failed to achieve a coupon data with basic token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.queryAll("/api/activity/" + thirdActivityId + "/achieve?openId=" + uid, {token: 'basic-valid'})
                    .then(function() {
                        callback(new Error("should not get the code for the 3th activity"));
                    }, function(err) {
                        done();
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });
        
        it('success to get a coupon list with basic token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.queryAll("/api/coupon?openId=" + uid, {token: 'basic-valid'})
                    .then(function(paging) {
                        assert.equal(paging.total, 2);
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
    });
}