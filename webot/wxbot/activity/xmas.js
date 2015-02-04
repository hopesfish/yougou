var Q = require("q");
var _ = require("underscore");
var conf = require('../../conf');
var XmasServices = require("../../services/XmasServices");

/**
 * 购物卡
 */
module.exports = function(webot) {
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
}