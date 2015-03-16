var BaseServices = require("./BaseServices");

/*
 * 查询
 */
exports.query = function(unionId) {
    var url = '/api/activity/finddiff?unionId=' + unionId;
    return BaseServices.queryAll(url);
};