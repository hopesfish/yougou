var Q = require("q");
var _ = require("underscore");
var conf = require('../conf');
var ActivityServices = require("../services/ActivityServices");
var AutoreplyServices = require("../services/AutoreplyServices");
var DreamServices = require("../services/DreamServices");
var XmasServices = require("../services/XmasServices");
var LuckybagServices = require("../services/LuckybagServices");

module.exports = function(webot) {
    webot.loads("user");

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

    // 在线客服讨论
    webot.set('subscribe', {
        pattern: function(info) {
            return info.is('event') && info.param.eventKey === 'CUSTOMSERVICE';
        },
        handler: function(info, next) {
            return next(null, "请点击左下角键盘，直接提交您的问题，我们的客服会尽快回复您的问题。如需其他帮助，请致电客服电话：400-163-8888");
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

    // 发起PRP
    webot.set('xinnianfuli', {
        pattern: function(info) {
            return info.text === '元旦' || info.text === '新年' || info.text === '福利';
        },
        handler: function(info, next) {
            if (info.text === '元旦') {
                info.text = 'YUANDAN';
            } else if (info.text === '新年') {
                info.text = 'XINNIAN';
            } else if (info.text === '福利') {
                info.text = 'FULI';
            }
            
            next();
        }
    });

    // 发起XMAS
    webot.set('shendanjie', {
        pattern: function(info) {
            return info.text === 'xmas' || info.text === '圣诞礼物';
        },
        handler: function(info, next) {
            XmasServices.start(info.uid).then(function(xmas) {
                if (xmas.bonus >= 42) {
                    info.text = '2014ACODEFORXMASFROMWEIXIN';
                    next();
                } else {
                    var over = true, url;

                    if (over) {
                        url = 'http://mp.weixin.qq.com/s?__biz=MjM5NDA3MTk2MA==&mid=202995312&idx=1&sn=6527ac46c11b0869af262666dbab16de#rd';
                        return next(null, [
                            '亲~很遗憾您来晚了一步，圣诞节的活动已经结束啦！元旦我们还会为您奉上更加精彩好玩的游戏哦！想要第一时间参与的话，请持续关注优购时尚商城微信公众号。我们将会不间断地奉上各种好玩的游戏+折扣给力的优惠信息给您哟，速度关注我们吧！了解更多请',
                            '<a href="' + url + '">点击这里</a>。'
                        ].join(""));
                    } else {
                        url = conf.xmas_root + "/xmas/" + xmas.id + "/grant";

                        return next(null, [
                            '亲~祝你圣诞快乐！速度抱走圣诞树，召集小伙伴一起将树上的装饰灯点亮，就有机会赢取优购（←国内最大的时尚鞋服电商）200元礼品卡和LEE/大嘴猴/Moussy的惊喜礼品哦！',
                            '\n<a href="' + url + '">点击这里</a>参与游戏，快来赢取圣诞豪礼啦！'
                        ].join("\n"));
                    }
                }
            }, function(err) {
                console.error(err);
                return next("发起活动失败");
            });
        }
    });

    // 发起祝福
    webot.set('weixinzhufu', {
        pattern: function(info) {
            return info.text === 'zhufu' || info.text === '我要求祝福';
        },
        handler: function(info, next) {
            LuckybagServices.start(info.uid).then(function(luckybag) {
                if (luckybag.bonus >= 15) {
                    info.text = '2015ACODEFORGREETINGFROMWEIXIN';
                    next();
                } else {
                    var over = false,
                        url = conf.luckybag_root + "/luckybag/" + luckybag.id + "/grant";
                    
                    if (over) {
                        url = 'http://mp.weixin.qq.com/s?__biz=MjM5NDA3MTk2MA==&mid=202995312&idx=1&sn=6527ac46c11b0869af262666dbab16de#rd';
                        return next(null, [
                            '亲~很遗憾您来晚了一步，求祝福的活动已经结束啦！我们还会为您奉上更加精彩好玩的游戏哦！想要第一时间参与的话，请持续关注优购时尚商城微信公众号。我们将会不间断地奉上各种好玩的游戏+折扣给力的优惠信息给您哟，速度关注我们吧！了解更多请',
                            '<a href="' + url + '">点击这里</a>。'
                        ].join(""));
                    } else {
                        return next(null, [
                            '亲~速度召集小伙伴来送祝福，你就有机会赢取优购（←国内最大的时尚鞋服电商）500元礼品卡和大嘴猴/Mossy的惊喜豪礼哦！',
                            '\n<a href="' + url + '">点击这里</a>参与游戏，速度玩起来吧！'
                        ].join("\n"));
                    }
                }
            }, function(err) {
                console.info(err);
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