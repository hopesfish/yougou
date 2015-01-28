var Q = require("q");
var ejs = require("ejs");
var UserServices = require("../../services/UserServices");

/* 每次访问都强制读取映射表的记录 */
function ensure_user_is_register (info, next) {
    var current = (new Date()).getTime();

    // 5分钟内不用重新读取
    if (info.session.user) {
        if (Math.abs(current - info.session.user.lastChecked) < 1000 * 60 * 5) {
            return next();
        }
    }

    var params = {
        openId: info.uid
    }
    UserServices.checkBind(info.uid).then(function(result) {
        if (result === 'false') {
            return next(null, ejs.render(
                '抱歉，您尚未绑定微信账号！\n\n请<a href="<%- bindurl%>">点击这里</a>绑定。', 
                {
                    bindurl: 'http://117.121.50.84/wechat/toBoundWx.sc?wxNum=' + info.uid
                }
            ));
        } else {
            var user = {
                openId: info.uid,
                lastChecked: current
            }
            info.session.user = user;
            next();
        }
    }, function(err) {
        info.ended = true;
        return next(err || "查询用户绑定信息时发生后台异常，请致电客服寻求帮助。");
    });
}

function operation_is_failed(info, next) {
    if (info.session.failedCount) {
        info.session.failedCount += 1;
    } else {
        info.session.failedCount = 1;
    }
    if (info.session.failedCount >= 5) {
        info.session.failedCount = 0;
        return true;
    }
    return false;
}


module.exports.ensure_user_is_register = ensure_user_is_register;

module.exports.operation_is_failed = operation_is_failed;


