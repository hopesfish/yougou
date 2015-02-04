/**
 * 促销消息
 */
var AutoreplyServices = require("../../services/AutoreplyServices");

module.exports = function(webot) {
    function sendPrompt(info, next) {
        AutoreplyServices.queryAllByKeyword('PROMOTE').then(function(paging) {
            if (!paging.result || paging.result.length == 0) {
                return next();
            }

            var autoreply = paging.result[0],
                replyText = autoreply.reply

            replyText = replyText.replace(/<br\s*\/?>/g, "\n");
            replyText = replyText.replace(/<div\s*\/?>/g, "\n");
            replyText = replyText.replace(/<\/div\s*\/?>/g, "");

            // 图文消息需要JSON反序列化
            if (autoreply.type == 1) {
                replyText = JSON.parse(replyText);
            }
            return next(null, replyText);
        }, function() {
            return next(null, "欢迎订阅本公司微信服务。");
        });
    }

    webot.set('promote by event', {
        pattern: function(info) {
            return info.is('event') && info.param.eventKey === 'PROMOTE';
        },
        handler: sendPrompt
    });

    webot.set('promote by text', {
        pattern: /^(促销|热卖|promote)$/i,
        handler: sendPrompt
    });
}