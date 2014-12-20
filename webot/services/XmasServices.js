var BaseServices = require("./BaseServices");

/*
 * 发起梦想
 */
exports.start = function(openId) {
    var url = '/api/activity/xmas/start?openId=' + openId;
    return BaseServices.get(url, {});
};
