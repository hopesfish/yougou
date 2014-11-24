var assert = require("assert")
var async = require("async");
var base = require("./base");
var SERVER = base.config().SERVER;

module.exports = function() {
    describe('test dream api : ', function() {
        var openId = 'openid' + (new Date()).getTime();

        it('failed to get dream data without basic token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.queryPaging("/api/activity/dream", {token: 'basic-none'})
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
        it('success to get dream data with basic token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.queryPaging("/api/activity/dream", {token: 'basic-valid'})
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
        
        it('failed to start dream data without token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.get("/api/activity/dream/start?openId=" + openId, {token: 'basic-none'})
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

        var dreamId;
        it('success to create dream data with basic token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.get("/api/activity/dream/start?openId=" + openId, {token: 'basic-valid'})
                    .then(function(dream) {
                        dreamId = dream.id;
                        assert.equal(dream.openId, openId);
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

        it('success to start dream data with a same id', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.get("/api/activity/dream/start?openId=" + openId, {token: 'basic-valid'})
                    .then(function(dream) {
                        assert.equal(dream.id, dreamId);
                        assert.equal(dream.openId, openId);
                        done();
                    }, function(err) {
                        console.info(err);
                        callback(new Error("should get a dream again"));
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        it('success to get dream list with basic token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.queryPaging("/api/activity/dream", {token: 'basic-valid'})
                    .then(function(result) {
                        assert.equal(result.total, total + 1);
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

        it('success to get dream list with open id', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.queryPaging("/api/activity/dream?openId=" + openId, {token: 'basic-valid'})
                    .then(function(result) {
                        assert.equal(result.total, 1);
                        assert.equal(result.result[0].id, dreamId);
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