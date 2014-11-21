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
                .when('/autoreply', {
                    controller: 'autoreplyCtrl',
                    controllerUrl: 'modules/autoreply/autoreplyCtrl.js',
                    templateUrl: 'modules/autoreply/autoreply.tpl.html'
                })
                .when('/autoreply/new', {
                    controller: 'autoreplySaveCtrl',
                    controllerUrl: 'modules/autoreply/autoreplySaveCtrl.js',
                    templateUrl: 'modules/autoreply/autoreply.save.tpl.html'
                })
                .when('/autoreply/:id', {
                    controller: 'autoreplySaveCtrl',
                    controllerUrl: 'modules/autoreply/autoreplySaveCtrl.js',
                    templateUrl: 'modules/autoreply/autoreply.save.tpl.html'
                });
            }
        ]);

        app.factory('AutoreplyService', function($rootScope, $http){
            return {
                get: function(id) {
                    return $http({
                        method: 'GET',
                        cache: false,
                        url: window.API_ROOT + '/autoreply/' + id + '?_t' + (new Date()).getTime()
                    }).then(function(res) {
                        if (res.data && res.data.type == 1) {
                            res.data.reply = res.data.replies = angular.fromJson(res.data.reply);
                        }
                        return res.data || {};
                    }, function(err) {
                        throw err;
                    });
                },
                save: function(_record) {
                    var successCode = 201, method = 'POST', uri, record = angular.copy(_record);
                    if (record.id) {
                        method = 'POST'; //it should be PUT
                        successCode = 200;
                        uri = window.API_ROOT + '/autoreply/' + record.id; 
                    } else {
                        uri = window.API_ROOT + '/autoreply'; 
                    }

                    if (angular.isArray(record.reply)) {
                        record.reply = angular.toJson(record.reply);
                    }

                    return $http({
                        method: method,
                        headers:{'Content-Type':'application/x-www-form-urlencoded'},
                        data: $.param(record),
                        url: uri
                    }).then(function(res) {
                        if (res.status === successCode) {
                            if (successCode == 201) {
                                return res.data.message;
                            }
                            return true;
                        } else {
                            throw new Error("not match the success code");
                        }
                    }, function(err) {
                        throw err;
                    });
                },
                queryPaging: function(params) {
                    params.t = (new Date()).getTime();
                    return $http({
                        method: 'GET',
                        cache: false,
                        url: window.API_ROOT + '/autoreply?' + $.param(params)
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
                        url: window.API_ROOT + '/autoreply/' + record.id
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