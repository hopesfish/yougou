var assert = require("assert")
var async = require("async");
var base = require("./base");
var SERVER = base.config().SERVER;

module.exports = function() {
    describe('test reply api : ', function(){

        var suffix = (new Date()).getTime();
        // 没有token不能创建回复
        it('failed to create reply  without token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.create(
                        "/api/autoreply",
                        {name: '回复规则名称' + suffix, type: 0, reply: '回复文本', keywords: '关键词1' + suffix + ',关键词2' + suffix}, 
                        {token: 'basic-none'}
                    )
                    .then(function() {
                        callback(new Error("should not create a test reply "));
                    }, function(err) {
                        done();
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        // 错误token不能创建回复
        it('failed to create reply  with invalid token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.create(
                        "/api/autoreply",
                        {name: '回复规则名称' + suffix, type: 0, reply: '回复文本', keywords: '关键词1' + suffix + ',关键词2' + suffix}, 
                        {token: 'basic-invalid'}
                    )
                    .then(function() {
                        callback(new Error("should not create a test reply  with invalid token"));
                    }, function(err) {
                        done();
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        // 有token,没有属性不能创建回复
        it('failed to create reply  without properties', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.create(
                        "/api/autoreply",
                        {name: '回复规则名称' + suffix, reply: '回复文本', keywords: '关键词1' + suffix + ',关键词2' + suffix}, 
                        {token: 'basic-valid'}
                    )
                    .then(function() {
                        callback(new Error("should not create a test reply  without properties"));
                    }, function(err) {
                        done();
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });
        

        // 有token能建立回复
        var firstReplyId;
        it('success to create reply  with token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.create(
                        "/api/autoreply",
                        {name: '回复规则名称' + suffix, type: 0, reply: '回复文本', keywords: '关键词1' + suffix + ',关键词2' + suffix}, 
                        {token: 'basic-valid'}
                    )
                    .then(function(replyId) {
                        firstReplyId =  replyId;
                        done();
                    }, function(err) {
                        console.info(err);
                        callback(new Error("should able to create a reply "));
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        var secReplyId;
        // 关键词只对应一个回复规则
        it('failed to create keyword with token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.create(
                        "/api/autoreply",
                        {name: '回复规则名称2' + suffix, type: 0, reply: '回复文本', keywords: '关键词1' + suffix + ',关键词2' + suffix}, 
                        {token: 'basic-valid'}
                    )
                    .then(function(replyId) {
                        secReplyId = replyId;
                        assert.equal(true, firstReplyId != secReplyId);
                        done();
                    }, function(err) {
                        console.info(err);
                        callback(new Error("should able to create a reply "));
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });


        // 没有token不能根据关键词获得回复
        it('failed to query reply without token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.queryAll(
                        "/api/autoreply?keyword=关键词1" + suffix,
                        {token: 'basic-none'}
                    )
                    .then(function() {
                        callback(new Error("should not query a reply "));
                    }, function(err) {
                        done();
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        // 有token能根据关键词获得回复
        it('success to query reply without token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.queryPaging(
                        "/api/autoreply?keyword=关键词1" + suffix,
                        {token: 'basic-valid'}
                    )
                    .then(function(paging) {
                        assert.equal(paging.result.length, 1);
                        assert.equal(paging.result[0].id, firstReplyId);
                        done();
                    }, function(err) {
                        console.info(err);
                        callback(new Error("should query a reply "));
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        // 没有token不能读取数据
        it('failed to get reply data without token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.get("/api/autoreply/" + firstReplyId, {token: 'basic-none'})
                    .then(function() {
                        callback(new Error("should not get a autoreply"));
                    }, function(err) {
                        done();
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        // 没有token不能读取数据
        it('success to get reply data with token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.get("/api/autoreply/" + firstReplyId, {token: 'basic-valid'})
                    .then(function(reply) {
                        assert.equal(reply.id, firstReplyId);
                        assert.equal(reply.reply, '回复文本');
                        done();
                    }, function(err) {
                        console.info(err);
                        callback(new Error("should not get a test notice"));
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        // 没有token不能删除数据
        it('failed to remove reply data without token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.remove("/api/autoreply/" + firstReplyId, {token: 'basic-none'})
                    .then(function() {
                        callback(new Error("should not remove a autoreply"));
                    }, function(err) {
                        done();
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        // 删除数据
        it('success to remove reply data with token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.remove("/api/autoreply/" + firstReplyId, {token: 'basic-valid'})
                    .then(function() {
                        done();
                    }, function(err) {
                        callback(new Error("should not get a test notice"));
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        // 用同样的规则再增加一个关键词
        var thirdRepyId;
        it('success to create reply  with token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.create(
                        "/api/autoreply",
                        {name: '回复规则名称3' + suffix, type: 0, reply: '回复文本2' + suffix, keywords: '关键词1' + suffix + ',关键词2' + suffix}, 
                        {token: 'basic-valid'}
                    )
                    .then(function(replyId) {
                        thirdRepyId =  replyId;
                        done();
                    }, function(err) {
                        console.info(err);
                        callback(new Error("should able to create a reply "));
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        // 查询出来的reply应该是回复文本2
        it('success to query reply without token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.queryPaging(
                        "/api/autoreply?keyword=关键词1" + suffix,
                        {token: 'basic-valid'}
                    )
                    .then(function(paging) {
                        assert.equal(paging.result.length, 1);
                        assert.equal(paging.result[0].id, thirdRepyId);
                        assert.equal(paging.result[0].reply, '回复文本2' + suffix);
                        done();
                    }, function(err) {
                        console.info(err);
                        callback(new Error("should query a reply "));
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });
    });
}