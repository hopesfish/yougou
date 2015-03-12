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

    rdsClient.hget('finddiff', 'rank', function(err, txt) {
        if (err) {
            console.error('failed to read finddiff rank');
            console.error(err);
            return deferred.reject(err);
        }

        var now = (new Date()).getTime();
        if (txt && (now - lastrank) < 1000 * conf.timeout) {
            var record = JSON.parse(txt.toString());
            return deferred.resolve(record);
        } else {
            lastrank = now;
            var url = '/api/activity/finddiff/rank';
            BaseServices.queryAll(url, {}).then(function(winners) {
                rdsClient.hset('finddiff', 'rank', JSON.stringify(winners), function(err) {
                    if (err) {
                        console.error('failed to refresh finddiff rank');
                        console.error(err);
                        return deferred.reject(err);
                    }
                    deferred.resolve(winners);
                });
            }, function(err) {
                console.error(err);
                deferred.reject(err);
            });

            BaseServices.get('/api/activity/finddiff/sort');
        }
    });

    return deferred.promise;
};

/*
 * 获得梦想,并更新到redis中
 */
exports.get = function(finddiffId) {
    var deferred = Q.defer();

    rdsClient.hget('finddiff', finddiffId, function(err, txt) {
        if (err) {
            console.error('failed to read finddiff record');
            console.error(err);
            return deferred.reject(err);
        }

        var now = (new Date()).getTime();
        if (txt && (now - lastrank) < 1000 * conf.timeout) {
            var record = JSON.parse(txt.toString());
            return deferred.resolve(record);
        } else {
            lastrank = now;
            var url = '/api/activity/finddiff/' + finddiffId;
            BaseServices.get(url, {}).then(function(record) {
                rdsClient.hset('finddiff', finddiffId, JSON.stringify(record), function(err) {
                    if (err) {
                        console.error('failed to refresh finddiff record');
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
exports.fulfill = function(finddiffId, data) {
    var deferred = Q.defer(),
        url = '/api/activity/finddiff/' + finddiffId;

    BaseServices.update(url, data).then(function(record) {
        rdsClient.hset('finddiff', finddiffId, JSON.stringify(record), function(err) {
            if (err) {
                console.error('failed to update finddiff record');
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
 * 更新微信信息或者取得金币数
 */
exports.vote = function(finddiffId, data) {
    var deferred = Q.defer(),
        url = '/api/activity/finddiff/' + finddiffId + '/result';

    BaseServices.create(url, data).then(function() {
        // 强制刷新缓存
        rdsClient.del('finddiff:votes:' + finddiffId, function(err) {
            if (err) {
                console.error(err);
                console.error('failed to clear votes');
            }
            var url = '/api/activity/finddiff/' + finddiffId + '/result';
            BaseServices.queryPaging(url, data).then(function(paging) {
                var records = paging.result;
                for (var i=0; i<records.length; i++) {
                    rdsClient.rpush('finddiff:votes:' + finddiffId, JSON.stringify(records[i]), function(err) {
                        if (err) {
                            console.error('failed to update finddiff vote record');
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
        });
    }, function(err) {
        deferred.reject(err);
    })

    return deferred.promise;
};

var lastvotes = {};
/**
 * 查看助力数据,每分钟更新一次数据
 */
exports.getVotes = function(finddiffId, data) {
    var deferred = Q.defer();

    rdsClient.lrange('finddiff:votes:' + finddiffId, 0, -1, function(err, votes) {
        if (err) {
            console.error('failed to read finddiff votes record');
            console.error(err);
            return deferred.reject(err);
        }

        if (!lastvotes[finddiffId]) {
            lastvotes[finddiffId] = 0;
        }
        var now = (new Date()).getTime();

        if (votes && (now - lastvotes[finddiffId]) < 1000 * conf.timeout) {
            var items = [];
            for (var i=0; i<votes.length; i++) {
                items.push(JSON.parse(votes[i]));
            }
            deferred.resolve(items);
        } else {
            lastvotes[finddiffId] = now;
            rdsClient.del('finddiff:votes:' + finddiffId, function(err) {
                if (err) {
                    console.error(err);
                    console.error('failed to clear votes');
                }
                var url = '/api/activity/finddiff/' + finddiffId + '/result';
                BaseServices.queryPaging(url, data).then(function(paging) {
                    var records = paging.result;
                    for (var i=0; i<records.length; i++) {
                        rdsClient.rpush('finddiff:votes:' + finddiffId, JSON.stringify(records[i]), function(err) {
                            if (err) {
                                console.error('failed to update finddiff vote record');
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

                BaseServices.get('/api/activity/finddiff/sort');
            });
        }
    });

    return deferred.promise;
};
