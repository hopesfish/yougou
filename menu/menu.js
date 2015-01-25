var wechat = require('wechat');

function initMenu() {
    return {
        "button": [{
            "name": "给力活动",
            "sub_button": [{
                "type": "view",
                "name": "每日特惠",
                "url": "http://mp.weixin.qq.com/s?__biz=MjM5NDA3MTk2MA==&mid=203907370&idx=2&sn=a6afb393796bcc870aa0c36e24e4b0b6#rd"
            }, {
                "type": "view",
                "name": "昨日推送",
                "url": "http://mp.weixin.qq.com/s?__biz=MjM5NDA3MTk2MA==&mid=203907370&idx=2&sn=a6afb393796bcc870aa0c36e24e4b0b6#rd"
            }, {
                "type": "view",
                "name": "本周活动",
                "url": "http://mp.weixin.qq.com/s?__biz=MjM5NDA3MTk2MA==&mid=203526871&idx=1&sn=04c1e11eba8fbcb8f657c60342fec8f9#rd"
            }]
        }]
    }
}

function run() {
    var API = wechat.API;
    var api = new API('wx0f186d92b18bc5b0', 'a1e509c1ee4b0fcd9ab4d29cb6ea35e6');

    api.getAccessToken(function(err, result) {
        if (err) {
            return false;
        }
        /*
        api.getMenu(function(err, menus) {
            console.info(JSON.stringify(menus));
        });*/
        
        api.createMenu(initMenu(), function(err, result) {
            if (err) {
            }
            console.info('ok');
        });
    });
}
run();