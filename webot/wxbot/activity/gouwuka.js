var Q = require("q");
var _ = require("underscore");
var conf = require('../../conf');
var DreamServices = require("../../services/DreamServices");

/**
 * 购物卡
 */
module.exports = function(webot) {
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
}