define(function (require, exports, module) {
    "use strict";

    window.API_ROOT = '/api';
    
    if (!$.cookie("wexuser")) { // 从login.html页面过来的
        alert("您尚未登录。");
        window.location.href = "login.html";
        return;
    }

    var app = angular.module('app', ['angular-lazyload', 'ngRoute', 'ngSanitize', 'textAngular']);
    
    require('./modules/main/config.js')(app);
    require('./modules/user/config.js')(app);
    require('./modules/activity/config.js')(app);

    //配置期
    app.config(['$httpProvider', '$routeProvider', function($httpProvider, $routeProvider) {
        $httpProvider.defaults.headers.common['wexuser'] = $.cookie("wexuser");  
        $httpProvider.defaults.headers.common['wexkey'] = $.cookie("wexkey");
        $httpProvider.defaults.headers.common['wextoken'] = $.cookie("wextoken");
        // nav settings
        $routeProvider
            .when('/main', {
                controller: 'mainCtrl',
                controllerUrl: 'modules/main/mainCtrl.js',
                templateUrl: 'modules/main/main.tpl.html'
            })
            .otherwise({
                redirectTo: '/activity'
            });
        }
    ]);

    //运行期
    app.run(['$lazyload', '$rootScope', 'UserService', function($lazyload, $rootScope, UserService){

        // init lazyload & hold refs
        $lazyload.init(app);
        app.register = $lazyload.register;
        // get user info and put it into the session
        $rootScope.session = {user: null};
        $rootScope.common = {};

        $rootScope.logout = function() {
            $.cookie("wexuser", '');
            $.cookie("wexkey", '');
            $.cookie("wextoken", '');
            window.location.href = "login.html";
        };

        $rootScope.$on("$routeChangeStart", function(event, next, current) {
            if ($rootScope.common.standby) {
                $rootScope.common.standby.show({text: '页面加载中，请稍候...'});
            }
        });
        
        $rootScope.$on("$routeChangeSuccess", function(event, next, current) {
            if ($rootScope.common.standby) {
                $rootScope.common.standby.hide();
            }
        });

        // 加载user
        $rootScope.$watch("session.user", function() {
            if ($rootScope.session.user == null) { return; }

        });

        // 隐藏loading图像
        function hideLoading() {
            setTimeout(function() {
                $("#loading").hide();
            }, 500);
        }

        // 加载用户信息
        UserService.get($.cookie("wexuser")).then(function(user) {
            return user;
        }, function(err) {
            return null;
        }).then(function(user) {
            if (!user) { 
                alert("读取用户资料异常，无法初始化应用。");
                return; 
            }

            $rootScope.session.user = user;
            hideLoading();
        });
    }]);

    module.exports = app;
});
