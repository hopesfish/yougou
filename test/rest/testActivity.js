var assert = require("assert")
var async = require("async");
var base = require("./base");
var SERVER = base.config().SERVER;

module.exports = function() {
    describe('test activity api : ', function(){
        it('failed to get activity data without basic token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.queryPaging("/api/activity", {token: 'basic-none'})
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
        it('success to get activity data with basic token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.queryPaging("/api/activity", {token: 'basic-valid'})
                    .then(function(result) {
                        total = result.total;
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
        
        it('failed to create activity data without token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.create("/api/activity", {name: '活动', code: 'HD' + (new Date()).getTime()}, {token: 'basic-none'})
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
        
        it('failed to create activity data again', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.create("/api/activity", {name: '活动', type: 1, code: 'HD' + (new Date()).getTime()}, {token: 'basic-valid'})
                    .then(function(id) {
                        callback(new Error("code should be unique"));
                    }, function(err) {
                        done();
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });
        
        it('failed to update activity data without token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.update("/api/activity/" + activityId, {name: '活动', code: 'HD' + (new Date()).getTime()}, {token: 'basic-none'})
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
        
        var hd1code = 'HD' + (new Date()).getTime();
        it('success to update activity data within token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.update("/api/activity/" + activityId, {name: '活动', code: hd1code}, {token: 'basic-valid'})
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
        
        var secActivityId;
        it('success to create sec activity data with basic token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.create("/api/activity", {name: '活动2', type: 1, code: 'HD2', reply: '回复2'}, {token: 'basic-valid'})
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
        
        it('failed to update activity data with same code', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.update("/api/activity/" + secActivityId, {name: '活动', code: hd1code}, {token: 'basic-valid'})
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
        
        it('success to update the sec activity data within token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.update("/api/activity/" + secActivityId, {name: '活动', code: 'HD3'}, {token: 'basic-valid'})
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

        it('success to remove sec activity data with basic token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.remove("/api/activity/" + secActivityId, {token: 'basic-valid'})
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