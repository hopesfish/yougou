/**
 * 用户签到
 */
var utils = require("../utils");

module.exports = function(webot) {
    webot.loads("account", "deliver");

    webot.domain("user", utils.ensure_user_is_register);
}