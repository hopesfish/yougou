/**
 * 需要外部传入的app, 则`module.exports`为function
 */
define(function (require, exports, module) {
    'use strict';

    module.exports = function(app){
        require('./standbyCtrl.js')(app);
        require('./headerCtrl.js')(app);

        //配置期
        app.config(['$routeProvider', function($routeProvider) {    
            //Step4: add `controllerUrl` to your route item config
            $routeProvider
                .when('/help/:type', {
                    controller: 'helpCtrl',
                    controllerUrl: 'modules/main/helpCtrl.js',
                    templateUrl: 'modules/main/help.tpl.html'
                });
            }
        ]);

        app.directive("wxStandby", [ '$location', function($location) {
            return {
                restrict : 'A',
                replace : true,
                controller: 'standbyCtrl',
                templateUrl: 'modules/main/standby.tpl.html',
                link : function($scope, $element, $attrs) {
                }
            };
        }]);
        
        app.directive("wxHeader", [ '$location', function($location) {
            return {
                restrict : 'A',
                replace : true,
                controller: 'headerCtrl',
                templateUrl: 'modules/main/header.tpl.html',
                link : function($scope, $element, $attrs) {
                }
            };
        }]);
    }
});