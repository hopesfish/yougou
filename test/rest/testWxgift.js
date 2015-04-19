var assert = require("assert")
var async = require("async");
var base = require("./base");
var SERVER = base.config().SERVER;

module.exports = function() {
    describe('test wxgift api : ', function() {
        var unionId = 'openid' + (new Date()).getTime();

        it('failed to start wxgift data without token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.get("/api/activity/wxgift/start?unionId=" + unionId, {token: 'basic-none'})
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

        it('failed to start wxgift data without properties', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.get("/api/activity/wxgift/start?unionId=" + unionId, {token: 'basic-valid'})
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

        var wxgiftId;
        it('success to create wxgift data with basic token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    var url = "/api/activity/wxgift/start?unionId=" + unionId;
                        url += '&subOpenId=sub' + unionId;
                        url += '&headimgurl=headimgurl' + unionId;
                        url += '&nickname=nickname' + unionId;
                    base.get(url, {token: 'basic-valid'})
                    .then(function(wxgift) {
                        wxgiftId = wxgift.id;
                        assert.equal(wxgift.unionId, unionId);
                        done();
                    }, function(err) {
                        console.info(err);
                        callback(new Error("should create a wxgift"));
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });
        

        it('success to start wxgift data with a same id', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    var url = "/api/activity/wxgift/start?unionId=" + unionId;
                        url += '&subOpenId=sub' + unionId;
                        url += '&headimgurl=headimgurl' + unionId;
                        url += '&nickname=nickname' + unionId;
                    base.get(url, {token: 'basic-valid'})
                    .then(function(wxgift) {
                        assert.equal(wxgift.id, wxgiftId);
                        assert.equal(wxgift.unionId, unionId);
                        done();
                    }, function(err) {
                        console.info(err);
                        callback(new Error("should get a wxgift again"));
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        it('success to get wxgift date with id', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.queryPaging("/api/activity/wxgift/" + wxgiftId, {token: 'basic-valid'})
                    .then(function(wxgift) {
                        assert.equal(wxgift.id, wxgiftId);
                        assert.equal(wxgift.unionId, unionId);
                        assert.equal(wxgift.subOpenId, 'sub' + unionId);
                        assert.equal(wxgift.headimgurl, 'headimgurl' + unionId);
                        assert.equal(wxgift.nickname, 'nickname' + unionId);
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

        it('success to update wxgift with code', function(done){
            async.series({
                action: function(callback){
                    base.update("/api/activity/wxgift/" + wxgiftId, {
                        shared: '1',
                        code: 'code' + unionId
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

        it('success to get wxgift code', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.queryPaging("/api/activity/wxgift/" + wxgiftId, {token: 'basic-valid'})
                    .then(function(wxgift) {
                        assert.equal(wxgift.code, 'code' + unionId);
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

        it('failed to update wxgift with a different code', function(done){
            async.series({
                action: function(callback){
                    base.update("/api/activity/wxgift/" + wxgiftId, {
                        shared: '1',
                        code: 'fakecode' + unionId
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

        it('the wxgift code is not change', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.queryPaging("/api/activity/wxgift/" + wxgiftId, {token: 'basic-valid'})
                    .then(function(wxgift) {
                        assert.equal(wxgift.code, 'code' + unionId);
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