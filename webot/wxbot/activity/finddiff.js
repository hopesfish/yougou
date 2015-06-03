var Q = require("q");
var _ = require("underscore");
var API = require('wechat-api');
var conf = require('../../conf');
var ActivityServices = require("../../services/ActivityServices");
var FinddiffServices = require("../../services/FinddiffServices");

var redis = require('node-redis');
var rdsClient = redis.createClient(6379, 'localhost');

// 初始化订阅微信api
var wechatApi = new API('wx0f186d92b18bc5b0', 'a1e509c1ee4b0fcd9ab4d29cb6ea35e6', function(callback) {
    rdsClient.hget('weixin-api-token', 'token', function(err, txt) {
        if (err) {return callback(err);}
        callback(null, JSON.parse(txt));
    });
}, function(token, callback) {
    rdsClient.hset('weixin-api-token', 'token', JSON.stringify(token), callback);
});

// 超时时间
wechatApi.setOpts({timeout: 15000});

// 初始化ticket
wechatApi.registerTicketHandle(function(type, callback) {
    rdsClient.hget('weixin-ticket-token', 'token', function(err, txt) {
        if (err) {return callback(err);}
        callback(null, JSON.parse(txt));
    });
}, function(type, token, callback) {
    rdsClient.hset('weixin-ticket-token', 'token', JSON.stringify(token), callback);
});

/**
 * 品牌大作战
 */
module.exports = function(webot) {
    // 开始/领奖
    webot.set('znmaward', {
        pattern: function(info) {
            return info.text === 'znm' || info.text === '品牌大作战';
        },
        handler: function(info, next) {
            wechatApi.getUser(info.uid, function(err, user) {
                FinddiffServices.query(user.unionid).then(function(paging) {
                    var url, award = false, finddiffs = paging.result, finddiff;

                    if (finddiffs.length == 0) {
                        url = conf.finddiff_root + "/finddiff/start";
                        return next(null, [
                            '亲~速度召集小伙伴们来玩【优购品牌大作战】游戏吧！手快眼力好，优购（←国内最大的时尚鞋服电商）送出的30元的现金礼品卡就有机会被你妥妥赢走！',
                            '\n<a href="' + url + '">点击这里</a>速度参与游戏！'
                        ].join("\n"));
                    } else {
                        finddiff = finddiffs[0];
                        if (finddiff.bonus >= 100) {
                            info.text = '2015FINDDIFFCODEATJUNE';
                            return next();
                        } else {
                            var over = false,
                                url = conf.finddiff_root + "/finddiff/" + finddiff.id + "/grant";
                            
                            if (over) {
                                url = 'http://mp.weixin.qq.com/s?__biz=MjM5NDA3MTk2MA==&mid=202995312&idx=1&sn=6527ac46c11b0869af262666dbab16de#rd';
                                return next(null, [
                                    '亲~很遗憾您来晚了一步，【品牌大作战】的活动已经结束啦！我们还会为您奉上更加精彩好玩的游戏哦！想要第一时间参与的话，请持续关注优购时尚商城微信公众号。我们将会不间断地奉上各种好玩的游戏+折扣给力的优惠信息给您哟，速度关注我们吧！了解更多请',
                                    '<a href="' + url + '">点击这里</a>。'
                                ].join(""));
                            } else {
                                return next(null, [
                                    '亲~您现在总共有' + finddiff.bonus + '个金币',
                                    '\n想尽快集满100个金币领礼品卡，速度召集小伙伴们来玩【优购品牌大作战】游戏吧！手快眼力好，优购（←国内最大的时尚鞋服电商）送出的1000元/500元/300元的现金礼品卡就有机会被你妥妥赢走！',
                                    '\n<a href="' + url + '">点击这里</a>速度参与游戏！'
                                ].join("\n"));
                            }
                        }
                    }
                }, function(err) {
                    return next('发生异常！');
                });
            });
        }
    });
    // // 开始/领奖
    // webot.set('znmlj', {
    //     pattern: function(info) {
    //         return info.text === '领奖';
    //     },
    //     handler: function(info, next) {
    //         wechatApi.getUser(info.uid, function(err, user) {
    //             //console.info(user);
    //             //console.info(user.unionid);
    //             FinddiffServices.query(user.unionid).then(function(paging) {
    //                 var url, award = false, finddiffs = paging.result, finddiff;

    //                 if ((new Date()).getTime() > 1430711940000) {
    //                     award = true;
    //                 }

    //                 if (finddiffs.length == 0) {
    //                     return next('抱歉，您未参加本活动!');
    //                 }

    //                 finddiff = finddiffs[0];
    //                 if (finddiff.rank > 0 && finddiff.rank <= 5 && award) {
    //                     return next('已经领完');
    //                     //info.text = '2015FINDDIFFCODE41000';
    //                     //return next();
    //                 } else if (finddiff.rank > 5 && finddiff.rank <= 10 && award) {
    //                     info.text = '2015FINDDIFFCODE4500';
    //                     return next();
    //                 } else if (finddiff.rank > 10 && finddiff.rank <= 30 && award) {
    //                     info.text = '2015FINDDIFFCODE4300';
    //                     return next();
    //                 } else if (finddiff.rank > 30 && finddiff.rank <= 200 && award) {
    //                     info.text = '2015FINDDIFFCODE450';
    //                     return next();
    //                 } else if (finddiff.rank > 200 && finddiff.rank <= 350 && award) {
    //                     info.text = '2015FINDDIFFCODE430';
    //                     return next();
    //                 } else {
    //                     return next('抱歉,您的排名过低,不能领奖!');
    //                 }

    //             }, function(err) {
    //                 return next('发生异常！');
    //             });
    //         });
    //     }
    // });

    // // 转发有礼
    // webot.set('zfyouli', {
    //     pattern: function(info) {
    //         return info.text === '转发有礼';
    //     },
    //     handler: function(info, next) {
    //         wechatApi.getUser(info.uid, function(err, user) {
    //             console.info(user);
    //             if (!user.unionid) {
    //                 return next('');
    //             }
    //             ActivityServices.achieve('2015MAYCODEFORSHARETIMELINE', 'unionId' + user.unionid)
    //             .then(function(achieveResult) {
    //                 if (achieveResult.activities.length == 1) {
    //                     var activity = achieveResult.activities[0];
    //                     var coupons = achieveResult.coupons;
    //                     var prompt = activity.reply || '恭喜您，您已经获得优惠券: {YHQ}';
    //                     var code = '';

    //                     // 无优惠券可领取时
    //                     if (coupons.length == 0) {
    //                         return next(null, activity.end_reply);
    //                     }

    //                     // 有优惠券可领取时
    //                     code = _.map(coupons, function(coupon) {
    //                         return coupon.code;
    //                     }).join("\n");
    //                     prompt = prompt.replace('{YHQ}', code);
    //                     return next(null, prompt);
    //                 } else {
    //                     return next('您来晚了，券已经领光！');
    //                 }
    //             }, function(err) {
    //                 return next(err || '领券异常');
    //             });
    //         });
    //     }
    // });
}