var assert = require("assert")
var async = require("async");
var base = require("./base");
var SERVER = base.config().SERVER;

module.exports = function() {
    describe('test activity enable/disable api : ', function(){

        var activityId,
            code = 'HD' + (new Date()).getTime(),
            coupon1 = 'CP1' + (new Date()).getTime(),
            coupon2 = 'CP2' + (new Date()).getTime(),
            openId = 'openId' + (new Date()).getTime();

        it('success to create activity data with basic token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.create("/api/activity", {name: '活动', type: 1, code: code, reply: '回复${YHQ}'}, {token: 'basic-valid'})
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

        it('success to disable activity data within token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.update("/api/activity/" + activityId, {enabled: 0}, {token: 'basic-valid'})
                    .then(function(id) {
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

        it('failed to achieve a coupon data when it is disabled', function(done){
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

        it('success to enable activity data within token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.update("/api/activity/" + activityId, {enabled: 1}, {token: 'basic-valid'})
                    .then(function(id) {
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

        it('success to achieve the coupon again', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.queryAll("/api/coupon/achieve?code=" + code + "&openId=" + openId, {token: 'basic-valid'})
                    .then(function(result) {
                        assert.equal(result.activities.length, 1);
                        assert.equal(result.coupons.length, 1);
                        assert.equal(result.coupons[0].id, firstCouponId);
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