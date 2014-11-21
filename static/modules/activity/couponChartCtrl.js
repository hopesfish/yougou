/**
 * 需要外部传入的app, 则`module.exports`为function
 */
define(function (require, exports, module) {
    'use strict';

    module.exports = function(app){
        app.controller('couponChartCtrl', ['$scope', '$routeParams', '$location', '$http', 'ActivityService',
            function($scope, $routeParams, $location, $http, ActivityService) {
                var cal;
                $scope.chart = {};
                
                $scope.chart.update = function() {
                    if (!cal) { return; }
                    cal.rewind();
                }

                ActivityService.get($routeParams.id).then(function(record) {
                    $scope.activity.record = record;

                    cal = new CalHeatMap();
                    cal.init({
                        itemSelector: "#wx-coupon-chart",
                        domain: "day",
                        subDomain: "x_hour",
                        range: 11,
                        cellSize: 14,
                        displayLegend: true,
                        label: {
                            position: "top"
                        },
                        tooltip: true,
                        domainLabelFormat: "%m-%d",
                        start: new Date(record.createdTime),
                        legend: [0, 10, 20],
                        data: window.API_ROOT + '/activity/' + $routeParams.id + '/coupon/timeline',
                        previousSelector: '#chart-pre',
                        nextSelector: '#chart-next'
                    });
                    cal.highlight(new Date(record.createdTime));
                });
            }]
        );
    }
});