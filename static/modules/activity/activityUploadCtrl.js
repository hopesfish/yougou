define(function (require, exports, module) {
    'use strict';

    module.exports = function(app){
    //Step6: use `app.register` to register controller/service/directive/filter
    app.register.controller('activityUploadCtrl', ['$scope', '$routeParams', '$location', '$http', '$timeout', 'UserService',
        function($scope, $routeParams, $location, $http, $timeout, UserService) {
            $scope.activity = {};
            $scope.activity.id = $routeParams.id;

            $scope.$watch("session.user", function() {
                if (!$scope.session.user) {
                    return;
                }
            });
            
            $("#upload").attr("src", "upload.html?id=" + $routeParams.id);
        }]
    );
    }
});