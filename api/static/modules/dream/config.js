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
                .when('/dream', {
                    controller: 'dreamCtrl',
                    controllerUrl: 'modules/dream/dreamCtrl.js',
                    templateUrl: 'modules/dream/dream.tpl.html'
                })
                .when('/dream/:id', {
                    controller: 'dreamDetailCtrl',
                    controllerUrl: 'modules/dream/dreamDetailCtrl.js',
                    templateUrl: 'modules/dream/dream.detail.tpl.html'
                });
            }
        ]);

        app.factory('DreamService', function($rootScope, $http){
            return {
                get: function(id) {
                    return $http({
                        method: 'GET',
                        cache: false,
                        url: window.API_ROOT + '/activity/dream/' + id + '?_t' + (new Date()).getTime()
                    }).then(function(res) {
                        if (res.data && res.data.type == 1) {
                            res.data.reply = res.data.replies = angular.fromJson(res.data.reply);
                        }
                        return res.data || {};
                    }, function(err) {
                        throw err;
                    });
                },
                queryPaging: function(params) {
                    params.t = (new Date()).getTime();
                    return $http({
                        method: 'GET',
                        cache: false,
                        url: window.API_ROOT + '/activity/dream?' + $.param(params)
                    }).then(function(res) {
                        return res.data || [];
                    }, function(err) {
                        throw err;
                    });
                },
                remove: function(record) {
                    return $http({
                        method: 'DELETE',
                        cache: false,
                        url: window.API_ROOT + '/activity/dream/' + record.id
                    }).then(function(res) {
                        return true;
                    }, function(err) {
                        throw err;
                    });
                }
            }
        });
    }
});