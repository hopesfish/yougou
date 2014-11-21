/**
 * 需要外部传入的app, 则`module.exports`为function
 */
define(function (require, exports, module) {
    'use strict';

    module.exports = function(app){
    //Step6: use `app.register` to register controller/service/directive/filter
    app.register.controller('mainCtrl', ['$scope', '$routeParams', '$location', '$http', '$timeout',
        function($scope, $routeParams, $location, $http, $timeout) {
            $scope.main = {};

            $scope.$watch("session.user", function() {
                if (!$scope.session.user) {
                    return;
                }
            });
        }]
    );
    }
});