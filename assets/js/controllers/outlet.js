'use strict'

/* Controllers */

angular.module('app')
    .controller('outletCtrl', ['$scope', 'outletFact', '$stateParams', 'sortData', function ($scope, outletFact, $stateParams, sortData) {
        $scope.currentOutlet = {}
        $scope.allData = {};
        $scope.usercsv = [];
        $scope.nvd3_area_options = [];
        outletFact.getOutlet($stateParams.id, function (response) {
            $scope.currentOutlet = response
            $scope.setConfig();
            $scope.getAreaChats();
        })

        $scope.getAreaChats = function () {
            $scope.getAreaChatWithDate({})
        }

        $scope.getAreaChatWithDate = function (data) {
            outletFact.getRedemption($stateParams.id, data, function (response) {
                $scope.allData = response.data.result;
                $scope.getUserCsvData();
                sortData.mainSorting(response.data.result, $scope.currentOutlet.offer, function (response) {
                    $scope.offerRedemp = response;
                })

            })
        }

        $scope.getOutletDetailsByDate = function () {
            if ($scope.startDate && $scope.endDate) {
                $scope.getAreaChatWithDate({
                    start_date: $scope.startDate,
                    end_date: $scope.endDate
                });
            } else {
                $scope.getAreaChats();
            }
        }

        $scope.getUserCsvData = function () {
            $scope.usercsv.push({
                a: 'User Name',
                b: 'User Phone',
                c: 'User Email',
                d: 'Redemption Id',
                e: 'Outlet Name',
                f: 'outlet Address',
                g: 'Offer Title',
                h: 'offers_redeemed',
                i: 'Redemption Time',
            })
            angular.forEach($scope.allData.users, function (result) {

                $scope.usercsv.push({
                    a: result.user,
                    b: result.phone,
                    c: result.email,
                    d: result.id,
                    e: $scope.currentOutlet.name,
                    f: $scope.currentOutlet.address,
                    g: result.title,
                    h: result.offers_redeemed,
                    i: result.created_at,
                })
            })

        }

        $scope.getConfig = function () {
            let colors = [];
            let fullColors = ['#601adc', '#e91e63', '#ff9800', '#742282', '#3fb55f', '#07e2ff'];
            for (let i=0; i < $scope.currentOutlet.offer.length; i++) {
                colors.push(fullColors[i]);
            }

            return {
                chart: {
                    type: 'stackedAreaChart',
                    height: 400,
                    margin: {
                        left: 15
                    },
                    x: function (d) {
                        return d[0]
                    },
                    y: function (d) {
                        return d[1]
                    },
                    color: colors,
                    useInteractiveGuideline: true,
                    rightAlignYAxis: false,
                    transitionDuration: 500,
                    showControls: false,
                    clipEdge: true,
                    xAxis: {
                        tickFormat: function (d) {
                            return d3.time.format('%d/%m/%Y')(new Date(d))
                        }
                    },
                    yAxis: {
                        tickFormat: d3.format('d')
                    },
                    legend: {
                        margin: {
                            top: 5
                        }
                    }
                }
            };
        }

        $scope.setConfig = function () {
            $scope.$watch('offerRedemption', function() {
                $scope.nvd3_area_options = $scope.getConfig();
            });
        }

    }])
    .factory('outletFact', ['$http', 'UrlFact', function ($http, UrlFact) {
        let outletFact = {}

        outletFact.getOutlet = function (id, callback) {
            $http.get(UrlFact.outlet + id).then(function (response) {
                callback(response.data.result)
            })
        }

        outletFact.getRedemption = function(id, data, callback){
            $http({
                method: 'POST',
                url: UrlFact.redemption + id,
                data: data
            }).then(function (response) {
                callback(response);
            });
        }

        return outletFact
    }]).factory('sortData', ['outletFact', function (outletFact) {
        let sortData = {}

        sortData.mainSorting = function (records, offers, callback) {
            let allData = [];

            function dateformat (date, count) {
                let array = date.split('-')

                return [Date.UTC(parseInt(array[0]), parseInt(array[1]) - 1, parseInt(array[2])), parseInt(count)]
            }

            angular.forEach(offers, function (offer) {
                let offerData = {
                    'key': offer.title,
                    'values': []
                }

                angular.forEach(records.datewise[offer.id], function (value, key) {
                    offerData.values.push(dateformat(value.date, value.count))
                })
                allData.push(offerData)
            })

            callback(allData)
        }

        return sortData
    }])