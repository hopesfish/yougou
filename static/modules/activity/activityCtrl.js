/**
 * 需要外部传入的app, 则`module.exports`为function
 */
define(function (require, exports, module) {
    'use strict';

    module.exports = function(app){
        //Step6: use `app.register` to register controller/service/directive/filter
        app.register.controller('activityCtrl', ['$scope', '$routeParams', '$location', '$http', '$timeout', 'UserService', 'ActivityService',
            function($scope, $routeParams, $location, $http, $timeout, UserService, ActivityService) {
                $scope.activity = {};
                $scope.activity.selected = null;
                $scope.activity.type = 'all';
                $scope.activity.typeLabel = '全部';

                function refresh(type) {
                    var params = {};

                    if (type) {
                        $scope.activity.type = type;
                    } else {
                        type = $scope.activity.type;
                    }
                    if (type !== 'all') {
                        params.type = type;
                    }

                    $scope.common.standby.show();
                    ActivityService.queryPaging(params).then(function(paging) {
                        $scope.common.standby.hide();
                        $scope.activity.record = paging.result;
                    }, function() {
                        $scope.common.standby.hide();
                        alert('加载活动信息失败。');
                    });
                }
                $scope.activity.refresh = refresh;
                
                $scope.$watch("activity.type", function() {
                    var type = $scope.activity.type;
                    if (type == 0) {
                        $scope.activity.typeLabel = '关键词回复';
                    } else if (type == 1){
                        $scope.activity.typeLabel = '优惠券发放';
                    } else {
                        $scope.activity.typeLabel = '全部';
                    }
                    $.cookie("activity.type", $scope.activity.type);

                    refresh($scope.activity.type);
                });

                var cookieVal = $.cookie("activity.type");
                if (cookieVal) {
                    $scope.activity.type = cookieVal;
                    refresh($scope.activity.type);
                } else {
                    refresh();
                }

                $scope.activity.remove = function() {
                    if (!$scope.activity.selected) {
                        return null;
                    }
                    var prompt = "确认删除关键词回复？";
                    if ($scope.activity.selected.type == 1) {
                        prompt = '删除【' + $scope.activity.selected.name + '】后，未领取的优惠券也将被删除，确认继续？';
                    }
                    if (confirm(prompt)) {
                        ActivityService.remove($scope.activity.selected).then(function() {
                            alert('删除成功！');
                            $scope.activity.selected = null;
                            refresh();
                        }, function() {
                            alert('删除失败。');
                        });
                    }
                }
            }]
        );
    }
});