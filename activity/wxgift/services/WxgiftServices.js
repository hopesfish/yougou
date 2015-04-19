var Q = require("q");
var conf = require("../conf");
var request = require('request');
var BaseServices = require("./BaseServices");

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
        deferred.resolve(record);
        /*
        rdsClient.hset('wxgift', wxgiftId, JSON.stringify(record), function(err) {
            if (err) {
                console.error('failed to refresh wxgift record');
                console.error(err);
                return deferred.reject(err);
            }
            deferred.resolve(record);
        });*/
    }, function(err) {
        console.error(err);
        deferred.reject(err);
    });

    /*
    rdsClient.hget('wxgift', wxgiftId, function(err, txt) {
        if (err) {
            console.error('failed to read wxgift record');
            console.error(err);
            return deferred.reject(err);
        }

        var now = (new Date()).getTime();
        if (txt && (now - lastrank) < 1000 * conf.timeout) {
            var record = JSON.parse(txt.toString());
            return deferred.resolve(record);
        } else {
            lastrank = now;
            
        }
    });*/

    return deferred.promise;
};

/*
 * 获得记录数据
 */
exports.get = function(wxgiftId) {
    var deferred = Q.defer();

    var url = '/api/activity/wxgift/' + wxgiftId;
    BaseServices.get(url, {}).then(function(record) {
        deferred.resolve(record);
        /*
        rdsClient.hset('wxgift', wxgiftId, JSON.stringify(record), function(err) {
            if (err) {
                console.error('failed to refresh wxgift record');
                console.error(err);
                return deferred.reject(err);
            }
            deferred.resolve(record);
        });*/
    }, function(err) {
        console.error(err);
        deferred.reject(err);
    });

    var now = (new Date()).getTime();
    if ((now - lastrank) > 1000 * 5 * 60) {
        BaseServices.get('/api/activity/wxgift/sort');
        lastrank = now;
    }

    /*
    rdsClient.hget('wxgift', wxgiftId, function(err, txt) {
        if (err) {
            console.error('failed to read wxgift record');
            console.error(err);
            return deferred.reject(err);
        }

        var now = (new Date()).getTime();
        if (txt && (now - lastrank) < 1000 * conf.timeout) {
            var record = JSON.parse(txt.toString());
            return deferred.resolve(record);
        } else {
            lastrank = now;
            
        }
    });*/

    return deferred.promise;
};
