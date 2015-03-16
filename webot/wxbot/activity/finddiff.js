var Q = require("q");
var _ = require("underscore");
var API = require('wechat-api');
var conf = require('../../conf');
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
            return info.text === 'znm';
        },
        handler: function(info, next) {
            console.info(info.uid);
            wechatApi.getUser(info.uid, function(err, user) {
                console.info(user);
                FinddiffServices.query(user.unionid).then(function(paging) {
                    var url, award = false, finddiffs = paging.result, finddiff;

                    if (finddiffs.length == 0) {
                        url = conf.finddiff_root + "/finddiff/start";
                        return next(null, [
                            '亲~速度召集小伙伴来玩【品牌大作战】游戏吧！玩得好，优购（国内最大的时尚鞋服电商）送出的300元/200元/100元现金卡+大嘴猴/Moussy大牌实物豪礼就有机会被你妥妥赢走哦！',
                            '\n进入游戏之前，请将手机调至横屏模式，以便游戏顺利开始。',
                            '\n设置好以后，<a href="' + url + '">点击这里</a>速度参与游戏！'
                        ].join("\n"));
                    } else {
                        finddiff = finddiffs[0];
                        if (finddiff.rank > 0 && finddiff.rank < 50 && award) {
                            info.text = '2015FINDDIFFCODE4TOP50';
                            return next();
                        } else if (finddiff.rank > 50 && finddiff.rank < 200 && award) {
                            info.text = '2015FINDDIFFCODE4TOP200';
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
                                    '亲~您现在总共有' + finddiff.bonus + '个金币，排在第' + finddiff.rank + '名！',
                                    '\n想提高排名，速度召集小伙伴来玩【品牌大作战】游戏吧！玩得好，优购（国内最大的时尚鞋服电商）送出的300元/200元/100元现金卡+大嘴猴/Moussy大牌实物豪礼就有机会被你妥妥赢走哦！',
                                    '\n进入游戏之前，请将手机调至横屏模式，以便游戏顺利开始。',
                                    '\n设置好以后，<a href="' + url + '">点击这里</a>速度参与游戏！'
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
}