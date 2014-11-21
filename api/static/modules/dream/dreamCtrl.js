define(function (require, exports, module) {
    'use strict';

    module.exports = function(app){
        //Step6: use `app.register` to register controller/service/directive/filter
        app.register.controller('dreamCtrl', ['$scope', '$routeParams', '$location', '$http', '$timeout', 'DreamService',
            function($scope, $routeParams, $location, $http, $timeout, DreamService) {
                $scope.dream = {};
                $scope.dream.selected = null;

                function refresh(type) {
                    var params = {};

                    $scope.common.standby.show();
                    DreamService.queryPaging(params).then(function(paging) {
                        $scope.common.standby.hide();
                        $scope.dream.record = paging.result;
                    }, function() {
                        $scope.common.standby.hide();
                        alert('加载数据失败。');
                    });
                }
                $scope.dream.refresh = refresh;

                refresh();

                $scope.dream.remove = function() {
                    if (!$scope.dream.selected) {
                        return null;
                    }
                    var prompt = "确认删除该梦想？";
                    if (confirm(prompt)) {
                        DreamService.remove($scope.dream.selected).then(function() {
                            alert('删除成功！');
                            $scope.dream.selected = null;
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