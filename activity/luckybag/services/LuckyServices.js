var Q = require("q");
var conf = require("../conf");
var request = require('request');
var BaseServices = require("./BaseServices");

var redis = require('node-redis');
var rdsClient = redis.createClient(6379, 'localhost');

var lastrank = 0;
/*
 * 排行榜
 */
exports.queryRank = function(opts) {
    var deferred = Q.defer();

    rdsClient.hget('luckbag', 'rank', function(err, txt) {
        if (err) {
            console.error('failed to read luckybag rank');
            console.error(err);
            return deferred.reject(err);
        }

        var now = (new Date()).getTime();
        if (txt && (now - lastrank) < 1000 * 60 * 5) {
            var record = JSON.parse(txt.toString());
            return deferred.resolve(record);
        } else {
            lastrank = now;
            var url = '/api/activity/luckybag/rank';
            BaseServices.queryAll(url, {}).then(function(paging) {
                rdsClient.hset('luckbag', 'rank', JSON.stringify(paging.result), function(err) {
                    if (err) {
                        console.error('failed to refresh luckybag rank');
                        console.error(err);
                        return deferred.reject(err);
                    }
                    deferred.resolve(paging.result);
                });
            }, function(err) {
                console.error(err);
                deferred.reject(err);
            });
        }
    });

    return deferred.promise;
};

/*
 * 获得梦想,并更新到redis中
 */
exports.get = function(luckybagId) {
    var deferred = Q.defer();

    rdsClient.hget('luckbag', luckybagId, function(err, txt) {
        if (err) {
            console.error('failed to read luckybag record');
            console.error(err);
            return deferred.reject(err);
        }

        if (txt) {
            var record = JSON.parse(txt.toString());
            return deferred.resolve(record);
        } else {
            var url = '/api/activity/luckybag/' + luckybagId;
            BaseServices.get(url, {}).then(function(record) {
                rdsClient.hset('luckbag', luckybagId, JSON.stringify(record), function(err) {
                    if (err) {
                        console.error('failed to refresh luckybag record');
                        console.error(err);
                        return deferred.reject(err);
                    }
                    deferred.resolve(record);
                });
            }, function(err) {
                console.error(err);
                deferred.reject(err);
            });
        }
    });

    return deferred.promise;
};

/**
 * 完善发起者信息,并更新到redis中
 */
exports.fulfill = function(luckybagId, data) {
    var deferred = Q.defer(),
        url = '/api/activity/luckybag/' + luckybagId;

    BaseServices.update(url, data).then(function(record) {
        rdsClient.hset('luckbag', luckybagId, JSON.stringify(record), function(err) {
            if (err) {
                console.error('failed to update luckybag record');
                console.error(err);
                return deferred.reject(err);
            }
            deferred.resolve(record);
        });
    }, function(err) {
        deferred.reject(err);
    })

    return deferred.promise;
};

/**
 * 投票
 */
exports.vote = function(luckybagId, data) {
    var deferred = Q.defer(),
        url = '/api/activity/luckybag/' + luckybagId + '/vote';

    BaseServices.create(url, data).then(function() {
        // TODO 奇怪的祝福语?
        rdsClient.rpush('luckbag:votes:' + luckybagId, JSON.stringify(data), function(err) {
            if (err) {
                console.error('failed to update luckybag vote record');
                console.error(err);
                return deferred.reject(err);
            }
            // 删除SET值 导致下一个请求来自DB
            rdsClient.hdel('luckbag', luckybagId, function(err) {
                if (err) {
                    console.error('failed to remove luckybag record');
                    console.error(err);
                    return deferred.reject(err);
                }
                deferred.resolve();
            });
        });
    }, function(err) {
        deferred.reject(err);
    })

    return deferred.promise;
};

var lastvotes = {};
/**
 * 投票历史
 */
exports.getVotes = function(luckybagId, data) {
    var deferred = Q.defer();

    rdsClient.lrange('luckbag:votes:' + luckybagId, 0, -1, function(err, votes) {
        if (err) {
            console.error('failed to read luckybag votes record');
            console.error(err);
            return deferred.reject(err);
        }

        if (!lastvotes[luckybagId]) {
            lastvotes[luckybagId] = 0;
        }
        var now = (new Date()).getTime();

        if (votes && (now - lastvotes[luckybagId]) < 1000 * 60 * 60) {
            var items = [];
            for (var i=0; i<votes.length; i++) {
                items.push(JSON.parse(votes[i]));
            }
            deferred.resolve(items);
        } else {
            lastvotes[luckybagId] = now;
            rdsClient.del('luckbag:votes:' + luckybagId, function(err) {
                if (err) {
                    console.error(err);
                    console.error('failed to clear votes');
                }
                var url = '/api/activity/luckybag/' + luckybagId + '/vote';
                BaseServices.queryPaging(url, data).then(function(paging) {
                    var records = paging.result;
                    for (var i=0; i<records.length; i++) {
                        rdsClient.rpush('luckbag:votes:' + luckybagId, JSON.stringify(records[i]), function(err) {
                            if (err) {
                                console.error('failed to update luckybag vote record');
                                console.error(err);
                                return deferred.reject(err);
                            }
                            
                        });
                    }
                    deferred.resolve(records);
                }, function(err) {
                    console.error(err);
                    deferred.reject(err);
                });
            })
        }
    });

    return deferred.promise;
};
