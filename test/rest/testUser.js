var assert = require("assert")
var async = require("async");
var base = require("./base");
var SERVER = base.config().SERVER;

module.exports = function() {
    describe('test user api : ', function(){
        it('failed to get user data without basic token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.queryAll("/api/user", {token: 'basic-none'})
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
        
        it('success to get user data with basic token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.queryAll("/api/user", {token: 'basic-valid'})
                    .then(function(users) {
                        assert.equal(0, users.length > 0);
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
        
        it('failed to login with error info', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.auth("/api/auth", {username: 'admin', password: 1888888}, {token: 'basic-none'})
                    .then(function(token) {
                        callback(err);
                    }, function(err) {
                        done();
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        it('success to login with error info', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.auth("/api/auth", {username: 'admin', password: 888888}, {token: 'basic-none'})
                    .then(function(token) {
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