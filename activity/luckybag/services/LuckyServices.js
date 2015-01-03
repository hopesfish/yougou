var Q = require("q");
var conf = require("../conf");
var request = require('request');
var BaseServices = require("./BaseServices");

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
    var url = '/api/activity/luckybag/' + luckybagId;
    return BaseServices.get(url, {});
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
