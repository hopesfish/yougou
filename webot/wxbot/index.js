var Q = require("q");
var _ = require("underscore");
var conf = require('../conf');
var ActivityServices = require("../services/ActivityServices");
var AutoreplyServices = require("../services/AutoreplyServices");

module.exports = function(webot) {
    webot.loads("user", "menu", "activity");

    // 订阅欢迎词
    webot.set('subscribe', {
        pattern: function(info) {
            return info.is('event') && info.param.event === 'subscribe';
        },
        handler: function(info, next) {
            AutoreplyServices.queryAllByKeyword('WELCOME').then(function(paging) {
                var greetings = paging.result;
                if (greetings.length > 0) {
                    return next(greetings[0].reply);
                } else {
                    return next(null, "欢迎订阅本公司微信服务。");
                }
            }, function() {
                return next(null, "欢迎订阅本公司微信服务。");
            });
        }
    });

    // 默认欢迎词
    webot.set('greeting', {
        pattern: function() {
            return true;
        },
        handler: function(info, next) {
            if (!info.is('text')) {
                info.noReply = true;
                next(null, '');
                return;
            }

            var aCode = info.text.toUpperCase(),
                defaultEndReply = '抱歉，优惠券已经发放完毕，请关注微信账号了解最新优惠券发放情况。';

            Q.all([
                ActivityServices.achieve(aCode, info.uid), // 领取奖品
                AutoreplyServices.queryAllByKeyword(aCode), // 查询回复
            ]).then(function(results) {
                var achieveResult = results[0],
                    autoReplies = results[1].result;

                // 无回复
                if (achieveResult.activities.length == 0 && autoReplies.length == 0) {
                    info.noReply = true;
                    next(null, '');
                    return;
                }

                // 回复优惠券
                if (achieveResult.activities.length == 1) {
                    var activity = achieveResult.activities[0];
                    var coupons = achieveResult.coupons;
                    var prompt = activity.reply || '恭喜您，您已经获得优惠券: {YHQ}';
                    var code = '';

                    // 无优惠券可领取时
                    if (coupons.length == 0) {
                        return next(null, activity.end_reply);
                    }

                    // 有优惠券可领取时
                    code = _.map(coupons, function(coupon) {
                        return coupon.code;
                    }).join("\n");
                    prompt = prompt.replace('{YHQ}', code);
                    return next(null, prompt);
                } else if (autoReplies.length > 0) {
                    var autoreply = autoReplies[0],
                        replyText = autoreply.reply

                    replyText = replyText.replace(/<br\s*\/?>/g, "\n");
                    replyText = replyText.replace(/<div\s*\/?>/g, "\n");
                    replyText = replyText.replace(/<\/div\s*\/?>/g, "");

                    // 图文消息需要JSON反序列化
                    if (autoreply.type == 1) {
                        replyText = JSON.parse(replyText);
                    }
                    return next(null, replyText);
                } else {
                    info.noReply = true;
                    next(null, '');
                    return;
                }
            }, function(err) {
                return next("欢迎您使用本公司微信服务。");
            });
        }
    });
}