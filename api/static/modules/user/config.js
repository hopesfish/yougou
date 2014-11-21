/**
 * 需要外部传入的app, 则`module.exports`为function
 */
define(function (require, exports, module) {
    'use strict';

    module.exports = function(app){
        //配置期
        app.config(['$routeProvider', function($routeProvider) {    
            //Step4: add `controllerUrl` to your route item config
            $routeProvider
                .when('/user', {
                    controller: 'userCtrl',
                    controllerUrl: 'modules/user/userCtrl.js',
                    templateUrl: 'modules/user/user.tpl.html'
                });            
        }]);

        app.factory('UserService', function($rootScope, $http){
            return {
                getStatistics: function(id) {
                    return $http({
                        method: 'GET',
                        cache: false,
                        url: window.API_ROOT + '/user/statistics?_t' + (new Date()).getTime()
                    }).then(function(res) {
                        if (res.data && res.data.type == 1) {
                            res.data.reply = res.data.replies = angular.fromJson(res.data.reply);
                        }
                        return res.data || {};
                    }, function(err) {
                        throw err;
                    });
                }
            }
        });
    }
});