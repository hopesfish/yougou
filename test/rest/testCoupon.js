var assert = require("assert")
var async = require("async");
var base = require("./base");
var SERVER = base.config().SERVER;

module.exports = function() {
    describe('test coupon api : ', function(){

        var activityId;
        it('success to create activity data with basic token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.create("/api/activity", {name: '活动', type: 1, code: 'HD' + (new Date()).getTime(), reply: '回复'}, {token: 'basic-valid'})
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
        
        it('failed to get coupon data without basic token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.queryPaging("/api/activity/" + activityId + "/coupon", {token: 'basic-none'})
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
        it('success to get coupon data within basic token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.queryPaging("/api/activity/" + activityId + "/coupon", {token: 'basic-valid'})
                    .then(function(paging) {
                        total = paging.total;
                        done();
                    }, function(err) {
                        callback(err);
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });
        
        it('failed to create coupon data without token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.create("/api/activity/" + activityId + "/coupon", {batch: 'batch1', code: 'coupon'}, {token: 'basic-none'})
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

        it('success to get newer coupon data within basic token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.queryPaging("/api/activity/" + activityId + "/coupon", {token: 'basic-valid'})
                    .then(function(paging) {
                        assert.equal(paging.total, total + 1);
                        done();
                    }, function(err) {
                        callback(err);
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });
        
        var couponId;
        it('success to create a sec coupon data with basic token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.create("/api/activity/" + activityId + "/coupon", {batch: 'batch1', code: couponCode + '1'}, {token: 'basic-valid'})
                    .then(function(id) {
                        couponId = id;
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
                    base.queryAll("/api/activity/" + activityId + "/achieve?openId=uid", {token: 'basic-valid'})
                    .then(function(coupons) {
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
                        callback(new Error('failed to get a coupon again'));
                    }, function(err) {
                        done();
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });
        
        /*
        it('success to remove coupon data with basic token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.remove("/api/activity/" + activityId + "/coupon/" + couponId, {token: 'basic-valid'})
                    .then(function() {
                        done();
                    }, function(err) {
                        console.info(err);
                        callback(err);
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });*/
        
        it('success to remove activity data with basic token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.remove("/api/activity/" + activityId, {token: 'basic-valid'})
                    .then(function() {
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