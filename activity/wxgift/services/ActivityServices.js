var BaseServices = require("./BaseServices");

/*
 * 获取优惠码
 */
exports.achieve = function(code, openId) {
    var url = '/api/coupon/achieve?code=' + code + '&openId=' + openId;
    console.info(url);
    return BaseServices.get(url);
};