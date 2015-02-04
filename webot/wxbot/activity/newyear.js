/**
 * 购物卡
 */
module.exports = function(webot) {
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
}