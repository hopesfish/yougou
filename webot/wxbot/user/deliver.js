/**
 * 查看物流信息
 */
var UserServices = require("../../services/UserServices");

module.exports = function(webot) {

    function send_deliver_info(info, next) {
        UserServices.getDeliver(info.uid).then(function(result) {
            return next(null, result);
        }, function(err) {
            return next(err || '查询物流信息时发生异常，请联系客服！');
        });
    };

    webot.set('user deliver info trigger by event', {
        domain: "user",
        pattern: function(info) {
            return info.is('event') && info.param.eventKey === 'DELIVER';
        },
        handler: send_deliver_info
    });

    webot.set('user deliver info trigger by text', {
        domain: "user",
        pattern: /^(物流信息|deliver)$/i,
        handler: send_deliver_info
    });
}