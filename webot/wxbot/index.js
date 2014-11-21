var Q = require("q");
var conf = require('../conf');
var ActivityServices = require("../services/ActivityServices");

module.exports = function(webot) {
    // 订阅欢迎词
    webot.set('subscribe', {
        pattern: function(info) {
            return info.is('event') && info.param.event === 'subscribe';
        },
        handler: function(info, next) {
            ActivityServices.queryAllByCode('WELCOME').then(function(greetings) {
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
                ActivityServices.queryCouponByOpenId(info.uid), // 当前openId获得的优惠券数目
                ActivityServices.queryCouponByCode(aCode) // 获得发券活动信息
            ]).then(function(results) {
                var activity = null, achieves = results[0], activities = results[1];

                // 没有优惠券, 找关键词
                if (activities.length !== 1) {
                    ActivityServices.queryReplyByCode(aCode).then(function(keywords) {
                        if (keywords.length > 0) {
                            return next(null, keywords[0].reply);
                        } else {
                            info.noReply = true;
                            next(null, '');
                            return;
                        }
                    }, function(err) {
                        info.noReply = true;
                        next(null, '');
                        return;
                    });
                } else {
                    activity = activities[0];

                    // 判断最近是否已经领取，如果允许多次领取，每天只能领取一次
                    for (var i = 0, len = achieves.length; i < len; i++) {
                        if (achieves[i].activityId === activity.id) {
                            var time = Date.parse(achieves[i].achievedTime, 'yyyy-MM-dd HH:mm:ss');

                            if (time.getDate() == (new Date()).getDate()) {
                                var prompt = activity.reply || '您已经领取优惠券：{YHQ}';

                                prompt = prompt.replace('{YHQ}', achieves[i].code);
                                return next(null, prompt);
                            }
                        }
                    }

                    // 判断活动是否暂停发放
                    if (activity.enabled === 0) {
                        return next(activity.endReply || defaultEndReply);
                    }

                    // 判断当前用户是否受限
                    var restrictDays = parseInt(activity.restrictDays) || 0;
                    if (restrictDays > 0 && achieves.length > 0) {
                        var current = (new Date()).getTime();
                        var last = Date.parse(achieves[0].achievedTime, 'yyyy-MM-dd HH:mm:ss');

                        if (Math.round((current - last) / 1000) < (60 * 60 * 24 * restrictDays)) {
                            return next(activity.restrictDaysReply || '抱歉，您不符合领取本次活动的粉丝条件。');
                        }
                    }

                    // 如果可以领取,将尝试获得优惠券
                    ActivityServices.achieve(activity.id, info.uid).then(function (code) {
                        var prompt = activity.reply || '恭喜您，您已经获得优惠券: {YHQ}';
                        prompt = prompt.replace('{YHQ}', code);
                        return next(prompt);
                    }, function (err) {
                        if (err.indexOf('no') >= 0) {
                            return next(activity.endReply || defaultEndReply);
                        } else {
                            return next(defaultEndReply);
                        }
                    });
                }
            }, function(err) {
                return next("欢迎您使用本公司微信服务。");
            });
        }
    });
}