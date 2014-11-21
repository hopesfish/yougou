/**
 * 需要外部传入的app, 则`module.exports`为function
 */
define(function (require, exports, module) {
    'use strict';

    module.exports = function(app){
        //Step6: use `app.register` to register controller/service/directive/filter
        app.controller('standbyCtrl', ['$scope', '$routeParams', '$location', '$http',
            function($scope, $routeParams, $location, $http) {
                var text = '操作进行中，请稍候...';
            
                $scope.common.standby = {};
                $scope.common.standby.isShow = false;
                $scope.common.standby.text = text;

                $scope.common.standby.hide = function(opts) {
                    $scope.common.standby.isShow = false;
                    
                    //$("#wx-standby .spinner").hide();
                    setTimeout(function() {
                        $("#wx-standby").hide();
                    }, 500);
                };

                $scope.common.standby.show = function(opts) {
                    var opts = opts || {};
                    $scope.common.standby.isShow = false;
                    $scope.common.standby.text = opts.text || text;
                    //$("#wx-standby .spinner").show();
                    $("#wx-standby").show();
                };
            }]
        );
    }
});