var Q = require("q");
var conf = require("../conf");
var request = require('request');
var BaseServices = require("./BaseServices");

var redis = require('node-redis');
var rdsClient = redis.createClient(6379, 'localhost');

/*
 * 排行榜
 */
exports.queryRank = function(opts) {
    var url = '/api/activity/luckybag/rank';
    return BaseServices.queryAll(url, {});
};

/*
 * 获得梦想
 */
exports.get = function(luckybagId) {
    var deferred = Q.defer();

    rdsClient.hget('redbag', luckybagId, function(err, txt) {
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
                console.info(record);
                rdsClient.hset('redbag', luckybagId, JSON.stringify(record), function(err) {
                    if (err) {
                        console.error('failed to write luckybag record');
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
 * 完善发起者信息
 */
exports.fulfill = function(luckybagId, data) {
    var url = '/api/activity/luckybag/' + luckybagId;
    return BaseServices.update(url, data);
};

/**
 * 投票
 */
exports.vote = function(luckybagId, data) {
    var url = '/api/activity/luckybag/' + luckybagId + '/vote';
    return BaseServices.create(url, data);
};

/**
 * 投票历史
 */
exports.getVotes = function(luckybagId, data) {
    var url = '/api/activity/luckybag/' + luckybagId + '/vote';
    return BaseServices.queryPaging(url, data);
};
