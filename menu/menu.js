var wechat = require('wechat');

function initMenu() {
    return {
        "button": [{
            "name": "我的优购",
            "sub_button": [{
                "type": "view",
                "name": "我的账户",
                "url": "http://m.yougou.com/touch/toLogin.sc"
            }, {
                "type": "view",
                "name": "我的订单",
                "url": "http://m.yougou.com/touch/my/myorderlist.sc"
            }, {
                "type": "view",
                "name": "物流查询",
                "url": "http://m.yougou.com/touch/my/listOrderLogistics.sc"
            }, {
                "type": "view",
                "name": "下载手机客户端",
                "url": "http://m.yougou.com/touch/agent"
            }]
        }, {
            "name": "活动查询",
            "sub_button": [{
                "type": "view",
                "name": "特卖专场",
                "url": "http://m.yougou.com/touch/tehui"
            }]
        }, {
            "name": "客服咨询",
            "sub_button": [{
                "type": "view",
                "name": "帮助中心",
                "url": "http://m.yougou.com/touch/help/index.sc"
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