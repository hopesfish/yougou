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
 * 所有活动
 */
exports.queryAll = function() {
    var url = '/api/activity';
    return BaseServices.queryPaging(url, {});
};
/*
 * 获取优惠码
 */
exports.queryAllByCode = function(code) {
    var url = '/api/activity?code=' + code;
    return BaseServices.queryPaging(url, {});
};
/*
 * 获取普通回复
 */
exports.queryReplyByCode = function(code) {
    var url = '/api/activity?type=0&code=' + code;
    return BaseServices.queryPaging(url, {});
};
/*
 * 获取当前用户获得的优惠券数目
 */
exports.queryCouponByOpenId= function(openId) {
    var url = '/api/coupon?openId=' + openId;
    return BaseServices.queryPaging(url, {});
};
/*
 * 获取优惠券发放
 */
exports.queryCouponByCode = function(code) {
    var url = '/api/activity?type=1&code=' + code;
    return BaseServices.queryPaging(url, {});
};
/*
 * 获取优惠码
 */
exports.queryCoupon = function(activityId, uid) {
    var url = '/api/activity/' + activityId + '/coupon?openId=' + uid;
    return BaseServices.queryPaging(url, {});
};


/*
 * 获取优惠码
 */
exports.achieve = function(activityId, openId) {
    var url = '/api/activity/' + activityId + '/achieve?openId=' + openId;
    return BaseServices.queryAll(url);
};
