/**
 * 需要外部传入的app, 则`module.exports`为function
 */
define(function (require, exports, module) {
    'use strict';

    module.exports = function(app){
        //Step6: use `app.register` to register controller/service/directive/filter
        app.register.controller('userCtrl', ['$scope', '$routeParams', '$location', '$http', '$timeout', 'UserService',
            function($scope, $routeParams, $location, $http, $timeout, UserService) {
                $scope.user = {};

                function refresh(type) {
                    $scope.common.standby.show();
                    UserService.getStatistics().then(function(statistics) {
                        $scope.common.standby.hide();
                        $scope.user.statistics = statistics;
                    }, function() {
                        $scope.common.standby.hide();
                        alert('加载数据失败。');
                    });
                }
                $scope.user.refresh = refresh;

                refresh();
            }]
        );
    }
});