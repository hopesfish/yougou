/**
 * 查看账户信息
 */
module.exports = function(webot) {

    function send_account_info(info, next) {
        next(null, "您已经成功绑定账户！");
    };

    webot.set('user account info trigger by event', {
        domain: "user",
        pattern: function(info) {
            return info.is('event') && info.param.eventKey === 'ACCOUNT';
        },
        handler: send_account_info
    });

    webot.set('user account info trigger by text', {
        domain: "user",
        pattern: /^(账户|account)$/i,
        handler: send_account_info
    });
}