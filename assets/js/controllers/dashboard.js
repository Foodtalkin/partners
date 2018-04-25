'use strict';

/* Controllers */

angular.module('app')
    .controller('dashboardCtrl', ['$scope', 'dashboardFact', '$cookies', function($scope, dashboardFact, $cookies) {
        /*dashboardFact.getDetails(function (response) {
            console.log(response);
        })*/
    }])
    .factory('dashboardFact', ['$http', 'UrlFact', function($http, UrlFact){
    	var dashboardFact = {};

        dashboardFact.getDetails = function (callback) {
            $http.get(UrlFact.restaurant).then(function (response) {
                callback(response);
            })
        }

    	return dashboardFact;
    }])