var Q = require("q");
var conf = require("../conf");
var request = require('request');
var BaseServices = require("./BaseServices");

/*
 * 创建优惠码
 */
exports.createCoupon = function(url, data) {
    return BaseServices.create(url, data);
};
/*
 * 获取优惠码
 */
exports.achieve = function(code, openId) {
    var url = '/api/coupon/achieve?code=' + code + '&openId=' + openId;
    return BaseServices.get(url);
};
