var Q = require("q");
var request = require('request');

/*
 * 检查用户是否绑定
 */
exports.checkBind = function (openId){
    var deferred = Q.defer();

    var options = {
        url: 'http://117.121.50.84/wechat/selBoundWx.sc?openId=' + openId,
        method: 'GET'
    };

    function callback(error, response, body) {
        if (!error && response.statusCode == 200) {
            deferred.resolve(body);
        } else {
            deferred.reject(error || body || new Error("unknown"));
        }
    }

    request(options, callback);

    return deferred.promise;
};

/*
 * 获得物流信息
 */
exports.getDeliver = function (openId){
    var deferred = Q.defer();

    var options = {
        url: 'http://117.121.50.84/wechat/myAccound.sc?openId=' + openId + '&msg=A&key=',
        method: 'GET'
    };

    function callback(error, response, body) {
        if (!error && response.statusCode == 200) {
            deferred.resolve(body);
        } else {
            deferred.reject(error || body || new Error("unknown"));
        }
    }

    request(options, callback);

    return deferred.promise;
};