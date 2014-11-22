/**
 * 需要外部传入的app, 则`module.exports`为function
 */
define(function (require, exports, module) {
    'use strict';

    module.exports = function(app){
        //Step6: use `app.register` to register controller/service/directive/filter
        app.register.controller('autoreplyCtrl', ['$scope', '$routeParams', '$location', '$http', '$timeout', 'AutoreplyService',
            function($scope, $routeParams, $location, $http, $timeout, AutoreplyService) {
                $scope.autoreply = {};
                $scope.autoreply.selected = null;
                $scope.autoreply.type = 'all';
                $scope.autoreply.typeLabel = '全部';

                function refresh(type) {
                    var params = {};

                    params['keyword:like'] = $scope.autoreply.query || '';

                    $scope.common.standby.show();
                    AutoreplyService.queryPaging(params).then(function(paging) {
                        $scope.common.standby.hide();
                        $scope.autoreply.record = paging.result;
                    }, function() {
                        $scope.common.standby.hide();
                        alert('加载数据失败。');
                    });
                }
                $scope.autoreply.refresh = refresh;

                refresh();

                $scope.autoreply.remove = function() {
                    if (!$scope.autoreply.selected) {
                        return null;
                    }
                    var prompt = "确认删除关键词回复？";
                    if (confirm(prompt)) {
                        AutoreplyService.remove($scope.autoreply.selected).then(function() {
                            alert('删除成功！');
                            $scope.autoreply.selected = null;
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