/**
 * 需要外部传入的app, 则`module.exports`为function
 */
define(function (require, exports, module) {
    'use strict';

    module.exports = function(app){
        require('./couponChartCtrl.js')(app);
        app.directive("wxCouponChart", [ '$location', function($location) {
            return {
                restrict : 'A',
                replace : true,
                controller: 'couponChartCtrl',
                templateUrl: 'modules/activity/chart.tpl.html',
                link : function($scope, $element, $attrs) {
                }
            };
        }]);

        //配置期
        app.config(['$routeProvider', function($routeProvider) {    
            //Step4: add `controllerUrl` to your route item config
            $routeProvider
                .when('/activity', {
                    controller: 'activityCtrl',
                    controllerUrl: 'modules/activity/activityCtrl.js',
                    templateUrl: 'modules/activity/activity.tpl.html'
                })
                .when('/activity/new', {
                    controller: 'activityNewCtrl',
                    controllerUrl: 'modules/activity/activityNewCtrl.js',
                    templateUrl: 'modules/activity/activity.new.tpl.html'
                })
                .when('/activity/:id', {
                    controller: 'activityViewCtrl',
                    controllerUrl: 'modules/activity/activityViewCtrl.js',
                    templateUrl: 'modules/activity/activity.view.tpl.html'
                })
                .when('/activity/:id/upload', {
                    controller: 'activityUploadCtrl',
                    controllerUrl: 'modules/activity/activityUploadCtrl.js',
                    templateUrl: 'modules/activity/activity.upload.tpl.html'
                });
            }
        ]);

        app.factory('ActivityService', function($rootScope, $http){
            return {
                get: function(id) {
                    return $http({
                        method: 'GET',
                        cache: false,
                        url: window.API_ROOT + '/activity/' + id + '?_t' + (new Date()).getTime()
                    }).then(function(res) {
                        return res.data || [];
                    }, function(err) {
                        throw err;
                    });
                },
                save: function(record) {
                    var successCode = 201, method = 'POST', uri;
                    if (record.id) {
                        method = 'POST'; //it should be PUT
                        successCode = 200;
                        uri = window.API_ROOT + '/activity/' + record.id; 
                    } else {
                        uri = window.API_ROOT + '/activity'; 
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
                        url: window.API_ROOT + '/activity?' + $.param(params)
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
                        url: window.API_ROOT + '/activity/' + record.id
                    }).then(function(res) {
                        return true;
                    }, function(err) {
                        throw err;
                    });
                },
                queryCoupon: function(id, paging) {
                    paging = paging || {};
                    return $http({
                        method: 'GET',
                        cache: false,
                        url: window.API_ROOT + '/activity/' + id + '/coupon?' + $.param(paging)
                    }).then(function(res) {
                        return res.data || [];
                    }, function(err) {
                        throw err;
                    });
                },
            }
        });
    }
});