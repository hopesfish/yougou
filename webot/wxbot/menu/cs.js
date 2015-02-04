/**
 * 客服问题
 */
module.exports = function(webot) {
    // 在线客服讨论
    webot.set('cs', {
        pattern: function(info) {
            return info.is('event') && info.param.eventKey === 'CUSTOMSERVICE';
        },
        handler: function(info, next) {
            return next(null, "请点击左下角键盘，直接提交您的问题，我们的客服会尽快回复您的问题。如需其他帮助，请致电客服电话：400-163-8888");
        }
    });
}