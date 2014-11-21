/**
 * 需要外部传入的app, 则`module.exports`为function
 */
define(function (require, exports, module) {
    'use strict';

    module.exports = function(app){

        app.register.controller('profileCtrl', ['$scope', '$routeParams', '$location', '$http', 'OperService',
            function($scope, $routeParams, $location, $http, OperService) {
                $scope.user = {};

                var userId = $routeParams.id;

                $scope.$watch("session.user", function() {
                    if (!$scope.session.user) {
                        return;
                    }
                    OperService.get(userId).then(function(record) {
                        $scope.user.record = record;
                        $scope.user.record.updatedBy = $scope.session.user.id;
                    }, function(err) {
                        alert('抱歉，无法获取该名用户信息。');
                    });
                });

                $scope.user.saveRecord = function() {
                    $scope.common.standby.show();
                    OperService.save(userId, $scope.user.record).then(function() {
                        $scope.common.standby.hide();
                        alert("保存成功。");
                    }, function() {
                        $scope.common.standby.hide();
                        alert('抱歉，无法保存用户信息！');
                    });
                };

                $scope.user.savePassword = function() {
                    $scope.common.standby.show();
                    OperService.save(userId, {
                        oldPassword: $scope.user.record.oldpassword,
                        password: $scope.user.record.newpassword,
                        updatedBy: $scope.user.record.updatedBy
                    }).then(function() {
                        $scope.common.standby.hide();
                        alert("修改密码成功。");
                    }, function() {
                        $scope.common.standby.hide();
                        alert('抱歉，无法修改密码！');
                    });
                };
            }]
        );
    }
});