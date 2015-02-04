var Q = require("q");
var _ = require("underscore");
var conf = require('../../conf');
var LuckybagServices = require("../../services/LuckybagServices");

/**
 * 购物卡
 */
module.exports = function(webot) {
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
}