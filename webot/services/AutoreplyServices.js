var Q = require("q");
var conf = require("../conf");
var request = require('request');
var BaseServices = require("./BaseServices");


/*
 * 模糊查询回复
 */
exports.queryAllByKeyword = function(keyword) {
    var url = '/api/autoreply?keyword:like=' + keyword;
    return BaseServices.queryAll(url, {});
};
