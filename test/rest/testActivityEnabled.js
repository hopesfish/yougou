var assert = require("assert")
var async = require("async");
var base = require("./base");
var SERVER = base.config().SERVER;

module.exports = function() {
    describe('test activity enabled api : ', function(){

        var activityId;
        it('success to create disabled activity data with basic token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.create("/api/activity", {name: '活动', enabled: '0', type: 1, code: 'HD' + (new Date()).getTime(), reply: '回复'}, {token: 'basic-valid'})
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

        it('success to get activity data with basic token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.get("/api/activity/" + activityId, {token: 'basic-valid'})
                    .then(function(activity) {
                        assert.equal(activity.enabled, 0);
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
        
        var couponCode = 'CP' + (new Date()).getTime();
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
        
        it('failed to achieve a coupon data with basic token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.queryAll("/api/activity/" + activityId + "/achieve?openId=uid", {token: 'basic-valid'})
                    .then(function(coupons) {
                        callback(new Error("should not achieved."));
                    }, function(err) {
                        done();
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });
    });
}