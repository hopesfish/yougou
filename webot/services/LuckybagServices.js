var BaseServices = require("./BaseServices");

/*
 * 发起luckybag
 */
exports.start = function(openId) {
    var url = '/api/activity/luckybag/start?openId=' + openId;
    return BaseServices.get(url, {});
};
