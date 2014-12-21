var Q = require("q");
var _ = require("underscore");
var conf = require('../conf');
var ActivityServices = require("../services/ActivityServices");
var AutoreplyServices = require("../services/AutoreplyServices");
var DreamServices = require("../services/DreamServices");
var XmasServices = require("../services/XmasServices");

module.exports = function(webot) {
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
                    return next("欢迎订阅本公司微信服务。");
                }
            }, function() {
                return next("欢迎订阅本公司微信服务。");
            });
        }
    });

    // 发起PRP
    webot.set('gouwuka', {
        pattern: function(info) {
            return info.text === 'testprp' || info.text === '我要购物卡';
        },
        handler: function(info, next) {
            DreamServices.start(info.uid).then(function(dream) {
                if (dream.bonus >= 20000 || info.uid === 'client') {
                    info.text = '2014ACODEFORPRPLQ200FROMWEIXIN';
                    next();
                } else {
                    var dreamUrl = 'http://mp.weixin.qq.com/s?__biz=MjM5NDA3MTk2MA==&mid=202995312&idx=1&sn=6527ac46c11b0869af262666dbab16de#rd';

                    next(null, [
                        '亲~本次游戏已结束，很遗憾地告知您迟到了一步。但优购就是有钱，任性！此类活动我们会再次发布哦，就在近期！想要第一时间参与的话，请持续关注优购微信公众号。我们将会不间断地奉上各种好玩的游戏+折扣给力的优惠信息给您哟，速度关注我们吧！了解更多请<a href="' + dreamUrl + '">点击这里</a>'
                    ].join(""));
                }
            }, function(err) {
                console.info(err);
                return next("发起活动失败");
            });
        }
    });

    // 发起XMAS
    webot.set('shendanjie', {
        pattern: function(info) {
            return info.text === 'xmas';
        },
        handler: function(info, next) {
            XmasServices.start(info.uid).then(function(xmas) {
                if (xmas.bonus >= 40) {
                    info.text = '2014ACODEFORXMASFROMWEIXIN';
                    next();
                } else {
                    var over = false, url;

                    if (over) {
                        url = 'http://mp.weixin.qq.com/s?__biz=MjM5NDA3MTk2MA==&mid=202995312&idx=1&sn=6527ac46c11b0869af262666dbab16de#rd';
                        return next(null, [
                            '亲~很遗憾您来晚了一步，圣诞节的活动已经结束啦！元旦我们还会为您奉上更加精彩好玩的游戏哦！',
                            '<a href="' + url + '">点击这里</a>了解优购，要关注我们哦！'
                        ].join(""));
                    } else {
                        url = conf.xmas_root + "/xmas/" + xmas.id + "/grant";

                        return next(null, [
                            '亲~祝你圣诞快乐！小编准备了丰富的圣诞礼物迫不及待地想要送给你啦！速度抱走一棵圣诞树，召集小伙伴一起将你的圣诞树点亮，就有机会抢到惊喜大礼哦！',
                            '\n<a href="' + url + '">点击这里</a>参与游戏，快快抱走你的圣诞树！'
                        ].join("\n"));
                    }
                }
            }, function(err) {
                console.error(err);
                return next("发起活动失败");
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