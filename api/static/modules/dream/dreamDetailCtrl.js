/**
 * 需要外部传入的app, 则`module.exports`为function
 */
define(function (require, exports, module) {
    'use strict';

    module.exports = function(app){
    //Step6: use `app.register` to register controller/service/directive/filter
    app.register.controller('dreamDetailCtrl', ['$scope', '$routeParams', '$location', '$http', '$timeout', 'DreamService',
        function($scope, $routeParams, $location, $http, $timeout, DreamService) {
            $scope.dream = {};
            $scope.dream.record = null;

            $scope.$watch("session.user", function() {
                if (!$scope.session.user) {
                    return;
                }
            });

            // 刷新数据
            function refresh() {
                $scope.common.standby.show();
                DreamService.get($routeParams.id).then(function(record) {
                    $scope.common.standby.hide();
                    $scope.dream.record = record;
                }, function(err) {
                    $scope.common.standby.hide();
                    alert('抱歉，该记录不存在。');
                });
            }
            refresh();
            $scope.dream.refresh = refresh;
        }]
    );
    }
});