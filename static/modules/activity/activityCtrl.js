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
                $scope.activity.typeLabel = '全部';

                function refresh(type) {
                    var params = {};

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
                refresh();
                
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