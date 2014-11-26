var wechat = require('wechat');



function initMenu() {
    return {
        "button": [{
            "type": "view",
            "name": "微社区",
            "url": "http://m.wsq.qq.com/263468315"
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