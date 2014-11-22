/**
 * 需要外部传入的app, 则`module.exports`为function
 */
define(function (require, exports, module) {
    'use strict';

    module.exports = function(app){
    //Step6: use `app.register` to register controller/service/directive/filter
    app.register.controller('activityNewCtrl', ['$scope', '$routeParams', '$location', '$http', '$timeout', 'UserService', 'ActivityService',
        function($scope, $routeParams, $location, $http, $timeout, UserService, ActivityService) {
            $scope.activity = {};
            $scope.activity.record = {
                name: '',
                code: '', 
                type: 1,
                reply: '感谢亲关注优购时尚商城官方微信，小编双手奉上礼品卡代码如下：{YHQ} ;本卡有效期截止至2099/12/30 23:59:59；亲可要抓紧时间使用哦！',
                endReply: '亲，本次活动已经结束，如果没有抢到的话没有关系！小编会在未来举办更多更好的微信活动，请亲多多参与，也多多推荐朋友关注“iyougou”哦！',
                restrictDays: 0,
                restrictDaysReply: '限制天数为0,该规则失效!'
            };

            $scope.$watch("session.user", function() {
                if (!$scope.session.user) {
                    return;
                }
            });
            
            $scope.activity.saveRecord = function() {
                if ($scope.activity.record.type == 1 && 
                    !/^([A-Z]|[0-9])*$/.test($scope.activity.record.code)) {
                    alert("领取编码格式不正确！");
                    return;
                }
                if ($scope.activity.record.type == 1 && $scope.activity.record.reply.indexOf('{YHQ}') < 0) {
                    alert("必须含有{YHQ}！");
                    return;
                }
                $scope.common.standby.show();
                $scope.activity.record.code = $scope.activity.record.code.toUpperCase();
                ActivityService.save($scope.activity.record).then(function(id) {
                    $scope.common.standby.hide();
                    alert('新增成功。');
                    if ($scope.activity.record.type == 1 && confirm('立刻上传优惠券？')) {
                        $location.path('/activity/' + id + '/upload');
                    } else {
                        $location.path('/activity');
                    }
                }, function() {
                    $scope.common.standby.hide();
                    alert('新增失败，可能已存在同名编码。');
                });
            };
        }]
    );
    }
});