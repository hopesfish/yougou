var assert = require("assert")
var async = require("async");
var base = require("./base");
var SERVER = base.config().SERVER;

module.exports = function() {
    describe('test coupon api : ', function(){

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
                    base.create("/api/activity/" + activityId + "/coupon", {batch: 'batch1', code: coupon1}, {token: 'basic-none'})
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

        it('success to create sec coupon data with basic token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.create("/api/activity/" + activityId + "/coupon", {batch: 'batch1', code: coupon2}, {token: 'basic-valid'})
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
                        assert.equal(paging.total, total + 2);
                        done();
                    }, function(err) {
                        callback(err);
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });
        
        it('failed to achieve a coupon data without parameters', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.queryAll("/api/coupon/achieve", {token: 'basic-valid'})
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

        it('failed to achieve a coupon data with wrong code', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.queryAll("/api/coupon/achieve?code=wrongcode&openId=" + openId, {token: 'basic-valid'})
                    .then(function(result) {
                        assert.equal(result.activities.length, 0);
                        assert.equal(result.coupons.length, 0);
                        done();
                    }, function(err) {
                        callback(new Error('should not failed with wrong code'));
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        var getCouponId = '';
        it('success to achieve a coupon data with right code', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.queryAll("/api/coupon/achieve?code=" + code + "&openId=" + openId, {token: 'basic-valid'})
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

        it('success to achieve the coupon again', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.queryAll("/api/coupon/achieve?code=" + code + "&openId=" + openId, {token: 'basic-valid'})
                    .then(function(result) {
                        assert.equal(result.activities.length, 1);
                        assert.equal(result.coupons.length, 1);
                        assert.equal(result.coupons[0].id, getCouponId);
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

        it('success to achieve a coupon data for another openId', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.queryAll("/api/coupon/achieve?code=" + code + "&openId=" + (openId + 1), {token: 'basic-valid'})
                    .then(function(result) {
                        assert.equal(result.activities.length, 1);
                        assert.equal(result.coupons.length, 1);
                        assert.notEqual(result.coupons[0].id, getCouponId);
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

        it('failed to achieve a coupon data for the third openId', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.queryAll("/api/coupon/achieve?code=" + code + "&openId=" + (openId + 2), {token: 'basic-valid'})
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
    });
}