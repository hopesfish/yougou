var Q = require("q");
var conf = require("../conf");
var request = require('request');
var BaseServices = require("./BaseServices");

/*
 * 发起梦想
 */
exports.start = function(openId) {
    var url = '/api/activity/dream/start?openId=' + openId;
    return BaseServices.get(url, {});
};
