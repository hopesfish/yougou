var BaseServices = require("./BaseServices");

/*
 * 发起finddiff
 */
exports.start = function(openId) {
    var url = '/api/activity/finddiff/start?openId=' + openId;
    return BaseServices.get(url, {});
};
