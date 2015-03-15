var Q = require("q");
var _ = require("underscore");
var conf = require('../../conf');
var FinddiffServices = require("../../services/FinddiffServices");

/**
 * 购物卡
 */
module.exports = function(webot) {
    // 发起祝福
    webot.set('weixinzhufu', {
        pattern: function(info) {
            return info.text === 'findnm' || info.text === '找品牌';
        },
        handler: function(info, next) {
            var now = (new Date()).getTime(), award = false;

            if (info.text == '找品牌' && now < 1423108740000) {
                return next("活动未开始!");
            }
            
            FinddiffServices.start(info.uid).then(function(finddiff) {
                if (finddiff.rank > 0 && finddiff.rank < 50 && award) {
                    info.text = '2015FINDDIFFCODE4TOP50';
                    next();
                } else if (finddiff.rank > 50 && finddiff.rank < 200 && award) {
                    info.text = '2015FINDDIFFCODE4TOP200';
                    next();
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
                            '亲~速度召集小伙伴来玩【品牌大作战】游戏吧！玩得好，优购（国内最大的时尚鞋服电商）送出的300元/200元/100元现金卡+大嘴猴/Moussy大牌实物豪礼就有机会被你妥妥赢走哦！',
                            '\n进入游戏之前，请将手机调至横屏模式，以便游戏顺利开始。\n设置好以后，<a href="' + url + '">点击这里</a>速度参与游戏！'
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