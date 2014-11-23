var assert = require("assert")
var async = require("async");
var base = require("./base");
var SERVER = base.config().SERVER;

module.exports = function() {
    describe('test coupon api : ', function(){

        var activityId, secActivityId,
            code = 'HD' + (new Date()).getTime(),
            coupon1 = 'CP1' + (new Date()).getTime(),
            coupon2 = 'CP2' + (new Date()).getTime(),
            openId = 'openId' + (new Date()).getTime();

        it('success to create the first activity data with basic token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.create("/api/activity", {name: '活动', type: 1, code: code, reply: '回复${YHQ}', restrictDays: 1, restrictDaysReply: '限制'}, {token: 'basic-valid'})
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
        
        var couponCode = coupon1;
        var firstCouponId;
        it('success to create coupon data with basic token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.create("/api/activity/" + activityId + "/coupon", {batch: 'batch1', code: couponCode}, {token: 'basic-valid'})
                    .then(function(id) {
                        firstCouponId = id;
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

        it('success to create the sec activity data with basic token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.create("/api/activity", {name: '活动', type: 1, code: code + 1, reply: '回复${YHQ}', restrictDays: 0, restrictDaysReply: '限制'}, {token: 'basic-valid'})
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

        it('success to create sec coupon data with basic token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.create("/api/activity/" + secActivityId + "/coupon", {batch: 'batch1', code: coupon2}, {token: 'basic-valid'})
                    .then(function(id) {
                        firstCouponId = id;
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

        var getCouponId = '';
        it('success to achieve a coupon data of 2nd activity with right code', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.queryAll("/api/coupon/achieve?code=" + (code + 1) + "&openId=" + openId, {token: 'basic-valid'})
                    .then(function(result) {
                        assert.equal(result.activities.length, 1);
                        assert.equal(result.coupons.length, 1);
                        getCouponId = result.coupons[0].id;
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

        it('failed to achieve a coupon data for the first activity', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.queryAll("/api/coupon/achieve?code=" + code + "&openId=" + openId, {token: 'basic-valid'})
                    .then(function(result) {
                        assert.equal(result.activities.length, 1);
                        assert.equal(result.coupons.length, 0);
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

        it('success to achieve a coupon data of 2nd activity with right code again', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.queryAll("/api/coupon/achieve?code=" + (code + 1) + "&openId=" + openId, {token: 'basic-valid'})
                    .then(function(result) {
                        assert.equal(result.activities.length, 1);
                        assert.equal(result.coupons.length, 1);
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