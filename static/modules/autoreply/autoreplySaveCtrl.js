/**
 * 需要外部传入的app, 则`module.exports`为function
 */
define(function (require, exports, module) {
    'use strict';

    module.exports = function(app){
    //Step6: use `app.register` to register controller/service/directive/filter
    app.register.controller('autoreplySaveCtrl', ['$scope', '$routeParams', '$location', '$http', '$timeout', 'AutoreplyService',
        function($scope, $routeParams, $location, $http, $timeout, AutoreplyService) {
            $scope.autoreply = {};
            $scope.autoreply.record = {name: '自动回复' + (new Date()).getTime(), code: '', type: 0, keywords: '', reply: '', replies: [{}]};

            $scope.$watch("session.user", function() {
                if (!$scope.session.user) {
                    return;
                }
            });

            // 类型转变时,reply也会变化
            $scope.$watch("autoreply.record.type", function() {
                switch($scope.autoreply.record.type) {
                    case 0:
                        $scope.autoreply.record.reply = '';
                        break;
                    case 1:
                        if (angular.isArray($scope.autoreply.record.reply)) {
                            return;
                        }
                        $scope.autoreply.record.reply = 'json data';
                        $scope.autoreply.record.replies = [{
                            title: '',
                            url: '',
                            picUrl: ''
                        }];
                        break;
                    default:
                        $scope.autoreply.record.reply = '';
                }
            });

            $scope.autoreply.createReply = function() {
                $scope.autoreply.record.replies.push({
                    title: '',
                    url: '',
                    picUrl: ''
                });
            }

            $scope.autoreply.removeReply = function(item, i) {
                $scope.autoreply.record.replies.splice(i, 1);
            }

            $scope.autoreply.move = function(item, idx, i) {
                var target = angular.copy($scope.autoreply.record.replies[idx + i]);
                var orginal = angular.copy($scope.autoreply.record.replies[idx]);
                $scope.autoreply.record.replies[idx] = target;
                $scope.autoreply.record.replies[idx + i] = orginal;
            }
            
            // 新增/修改回复规则
            $scope.autoreply.saveRecord = function() {
                $scope.common.standby.show();
                $scope.autoreply.record.keywords = $scope.autoreply.record.keywords.toUpperCase();
                if ($scope.autoreply.record.type == 1) {
                    $scope.autoreply.record.reply = $scope.autoreply.record.replies;
                }

                var prompt = $scope.autoreply.record.id ? '编辑成功' : '新增成功';
                $scope.common.standby.show();
                AutoreplyService.save($scope.autoreply.record).then(function(id) {
                    $scope.common.standby.hide();
                    alert(prompt);
                    if (!$scope.autoreply.record.id) {
                        $location.path('/autoreply');
                    } else {
                        refresh();
                    }
                }, function() {
                    $scope.common.standby.hide();
                    alert('新增失败。');
                });
            };

            // 编辑界面使用的代码
            if (!$routeParams.id) { return; }

            // 刷新数据
            function refresh() {
                $scope.common.standby.show();
                AutoreplyService.get($routeParams.id).then(function(record) {
                    $scope.common.standby.hide();
                    $scope.autoreply.record = record;
                    $scope.autoreply.disableLabel = record.enabled ? '停用' : '启用';
                }, function(err) {
                    $scope.common.standby.hide();
                    alert('抱歉，该回复规则不存在。');
                });

                //$timeout(refresh, 60 * 1000 * 15); // refresh 5
            }
            refresh();
            $scope.autoreply.refresh = refresh;

            // 禁用/启用
            $scope.autoreply.disable = function() {
                $scope.common.standby.show();
                $scope.autoreply.record.enabled = $scope.autoreply.record.enabled == 1 ? 0 : 1;
                AutoreplyService.save($scope.autoreply.record).then(function(id) {
                    $scope.common.standby.hide();
                    alert('操作成功。');
                    refresh();
                }, function() {
                    $scope.common.standby.hide();
                    alert('操作失败。');
                });
            }
        }]
    );
    }
});