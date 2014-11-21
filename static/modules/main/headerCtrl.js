define(function (require, exports, module) {
    'use strict';

    module.exports = function(app){
        //Step6: use `app.register` to register controller/service/directive/filter
        app.controller('headerCtrl', ['$scope', '$routeParams', '$location', '$http',
            function($scope, $routeParams, $location, $http) {
                $scope.header = {};
                $scope.header.tab = 'activity';
            }]
        );
    }
});