define(function (require, exports, module) {
    "use strict";

    module.exports = function(app){
        app.config(['$routeProvider', function($routeProvider) {    
            //Step4: add `controllerUrl` to your route item config
            $routeProvider
                .when('/oper/:id', {
                    controller: 'profileCtrl',
                    controllerUrl: 'modules/oper/profileCtrl.js',
                    templateUrl: 'modules/oper/profile.tpl.html'
                });
            }
        ]);

        app.factory('OperService', function($rootScope, $http){
            var uri = window.API_ROOT + '/user';
            return {
                get: function(id) {
                    return $http({
                        method: 'GET',
                        cache: false,
                        url: uri + '/' + id
                    }).then(function(res) {
                        return res.data;
                    }, function(err) {
                        throw err;
                    });
                },
                save: function(userId, record) {
                    var successCode = 200, method = 'POST', uri;
                    
                    uri = window.API_ROOT + '/oper/' + userId; 

                    return $http({
                        method: method,
                        headers:{'Content-Type':'application/x-www-form-urlencoded'},
                        data: $.param(record),
                        url: uri
                    }).then(function(res) {
                        if (res.status === successCode) {
                            return true;
                        } else {
                            throw new Error("not match the success code");
                        }
                    }, function(err) {
                        throw err;
                    });
                }
            }
        });

    }
});