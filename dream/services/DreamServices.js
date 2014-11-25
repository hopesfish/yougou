var Q = require("q");
var conf = require("../conf");
var request = require('request');
var BaseServices = require("./BaseServices");

/*
 * 获得梦想
 */
exports.get = function(dreamId) {
    var url = '/api/activity/dream/' + dreamId;
    return BaseServices.get(url, {});
};
