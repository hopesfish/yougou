var Q = require("q");
var conf = require("../conf");
var request = require('request');
var BaseServices = require("./BaseServices");

/*
 * 排行榜
 */
exports.queryRank = function(opts) {
    var url = '/api/activity/dream/rank';
    return BaseServices.queryAll(url, {});
};

/*
 * 获得梦想
 */
exports.get = function(dreamId) {
    var url = '/api/activity/dream/' + dreamId;
    return BaseServices.get(url, {});
};

/**
 * 完善发起者信息
 */
exports.fulfill = function(dreamId, data) {
    var url = '/api/activity/dream/' + dreamId;
    return BaseServices.update(url, data);
};

/**
 * 投票
 */
exports.vote = function(dreamId, data) {
    var url = '/api/activity/dream/' + dreamId + '/vote';
    return BaseServices.update(url, data);
};
