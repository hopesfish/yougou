var Q = require("q");
var conf = require("../conf");
var request = require('request');
var BaseServices = require("./BaseServices");

/*
 * 排行榜
 */
exports.queryRank = function(opts) {
    var url = '/api/activity/xmas/rank';
    return BaseServices.queryAll(url, {});
};

/*
 * 获得梦想
 */
exports.get = function(xmasId) {
    var url = '/api/activity/xmas/' + xmasId;
    return BaseServices.get(url, {});
};

/**
 * 完善发起者信息
 */
exports.fulfill = function(xmasId, data) {
    var url = '/api/activity/xmas/' + xmasId;
    return BaseServices.update(url, data);
};

/**
 * 投票
 */
exports.vote = function(xmasId, data) {
    var url = '/api/activity/xmas/' + xmasId + '/vote';
    return BaseServices.create(url, data);
};

/**
 * 投票历史
 */
exports.getVotes = function(xmasId, data) {
    var url = '/api/activity/xmas/' + xmasId + '/vote';
    return BaseServices.queryPaging(url, data);
};
