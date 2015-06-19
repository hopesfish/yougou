var Q = require("q");
var conf = require("../conf");
var request = require('request');
var BaseServices = require("./BaseServices");
var ActivityServices = require("./ActivityServices");

var redis = require('node-redis');
var rdsClient = redis.createClient(6379, 'localhost');

var lastrank = 0;

/*
 * 开始游戏
 */
exports.start = function(params) {
    var deferred = Q.defer();

    var url = '/api/activity/wxgift/start?unionId=' + params.unionId;
        url += '&subOpenId=' + params.subOpenId;
        url += '&headimgurl=' + params.headimgurl;
        url += '&nickname=' + params.nickname;

    BaseServices.get(url, {}).then(function(record) {
        if (record.shared == 0) {
            rdsClient.hset('wxgift', record.id, JSON.stringify(record), function(err, txt) {
                if (err) {
                    console.error('failed to set wxgift record');
                    console.error(err);
                    return deferred.reject(err);
                }
                deferred.resolve(record);
            });
        } else {
            deferred.resolve(record);
        }
    }, function(err) {
        console.error(err);
        deferred.reject(err);
    });

    return deferred.promise;
};

/*
 * 获得记录数据
 */
exports.get = function(wxgiftId) {
    var deferred = Q.defer();

    rdsClient.hget('wxgift', wxgiftId, function(err, txt) {
        if (err) {
            console.error('failed to refresh wxgift record');
            console.error(err);
            return deferred.reject(err);
        }
        if (txt) {
            deferred.resolve(JSON.parse(txt.toString()));
        } else {
            deferred.reject(null);
        }
    });

    return deferred.promise;
};

/*
 * 参加排队
 */
exports.join = function(wxgiftId) {
    var deferred = Q.defer();

    rdsClient.hget('wxgift', wxgiftId, function(err, txt) {
        if (err) {
            console.error('failed to refresh wxgift record');
            console.error(err);
            return deferred.reject(err);
        }
        if (txt) {
            rdsClient.rpush('unionIds', txt.toString(), function(err) {
            if (err) {
                console.error('failed to add unionId into list');
                console.error(err);
                return deferred.reject(err);
            }
            deferred.resolve(JSON.parse(txt.toString()));
        });
        } else {
            deferred.reject(null);
        }
    });

    return deferred.promise;
};

/*
 * 领奖
 */
exports.award = function(wxgiftId) {
    var deferred = Q.defer();

    var url = '/api/activity/wxgift/' + wxgiftId;
    
    rdsClient.lpop('unionIds', function(err, recordStr) {
        if (err) {
            console.error('failed to pop unionId from list');
            console.error(err);
            return deferred.reject(err);
        }
        if (recordStr) {
            var record = JSON.parse(recordStr);
            
            if (!record.unionId) {
                deferred.reject();
            }

            ActivityServices.achieve('20150618CODEFORSHARETIMELINE', 'unionId2' + record.unionId)
            .then(function(result) {
                if (result && result.coupons.length > 0) {
                    record.shared = "1";
                    record.code = result.coupons[0].code;
                } else {
                    record.shared = "2";
                    record.code = '';
                }

                BaseServices.update(url, record).then(function() {
                }, function(err) {
                    console.error(err);
                });

                rdsClient.hset('wxgift', record.id, JSON.stringify(record), function(err, txt) {
                    if (err) {
                        console.error('failed to set wxgift record');
                        console.error(err);
                        return deferred.reject(err);
                    }
                    deferred.resolve(record);
                });
                deferred.resolve(record);
            }, function(err) {
                console.error(err);
            });
            deferred.resolve(record);
        } else {
            deferred.resolve(null);
        }
    });

    return deferred.promise;
};