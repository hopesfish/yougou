/**
 * 需要外部传入的app, 则`module.exports`为function
 */
define(function (require, exports, module) {
    'use strict';

    module.exports = function(app){
    //Step6: use `app.register` to register controller/service/directive/filter
    app.register.controller('activityViewCtrl', ['$scope', '$routeParams', '$location', '$http', '$timeout', 'UserService', 'ActivityService',
        function($scope, $routeParams, $location, $http, $timeout, UserService, ActivityService) {
            $scope.activity = {};
            $scope.activity.record = null;
            $scope.activity.coupons = null;
            $scope.activity.achieved = 0;
            $scope.activity.unachieved = 0;
            $scope.activity.total = 0;
            $scope.activity.paging = {total: 0, curPage: 1, loading: false};
            $scope.activity.tab = 'chart';
            $scope.activity.disableLabel = '暂停发放';

            function refresh() {
                $scope.common.standby.show();
                ActivityService.get($routeParams.id).then(function(record) {
                    $scope.activity.record = record;



                    ActivityService.queryCoupon($routeParams.id, {curPage: $scope.activity.paging.curPage}).then(function(paging) {
                        $scope.common.standby.hide();
                        $scope.activity.total = paging.total;
                        $scope.activity.paging.curPage += 1;
                        if (!$scope.activity.coupons) {
                            $scope.activity.coupons = paging.result;
                        } else {
                            $scope.activity.coupons = $scope.activity.coupons.concat(paging.result);
                        }
                    }, function() {
                        $scope.common.standby.hide();
                        alert('抱歉，加载优惠券失败。');
                    });
                    
                    // 未领取
                    ActivityService.queryCoupon($routeParams.id, {achieved: 'achieved', limit: 1}).then(function(paging) {
                        $scope.common.standby.hide();
                        $scope.activity.achieved = paging.total;
                    }, function() {
                        $scope.common.standby.hide();
                        alert('抱歉，加载优惠券失败。');
                    });

                    // 已领取
                    ActivityService.queryCoupon($routeParams.id, {unachieved: 'unachieved', limit: 1}).then(function(paging) {
                        $scope.activity.unachieved = paging.total;

                        if ($scope.activity.record.enabled == 0 && $scope.activity.unachieved > 0) {
                            $scope.activity.disableLabel = '取消暂停发放';
                        }
                    }, function() {
                        alert('抱歉，加载优惠券失败。');
                    });
                }, function(err) {
                    $scope.common.standby.hide();
                    alert('抱歉，该活动不存在。');
                });

                //$timeout(refresh, 60 * 1000 * 15); // refresh 5
            }
            refresh();
            $scope.activity.refresh = refresh;

            $scope.$watch("session.user", function() {
                if (!$scope.session.user) {
                    return;
                }
            });
            
            $scope.activity.saveRecord = function() {
                if ($scope.activity.record.type == 1 && $scope.activity.record.reply.indexOf('{YHQ}') < 0) {
                    alert("必须含有{YHQ}！");
                    return;
                }
                $scope.common.standby.show();
                $scope.activity.record.code = $scope.activity.record.code.toUpperCase();
                ActivityService.save($scope.activity.record).then(function(id) {
                    $scope.common.standby.hide();
                    alert('保存成功。');
                }, function() {
                    $scope.common.standby.hide();
                    alert('保存失败。');
                });
            };

            $scope.activity.disable = function() {
                $scope.common.standby.show();
                $scope.activity.record.enabled = $scope.activity.record.enabled == 1 ? 0 : 1;
                ActivityService.save($scope.activity.record).then(function(id) {
                    $scope.common.standby.hide();
                    alert('操作成功。');
                    window.location.reload();
                }, function() {
                    $scope.common.standby.hide();
                    alert('操作失败。');
                });
            }
        }]
    );
    }
});