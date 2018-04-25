'use strict';

/* Controllers */

angular.module('app')
    .controller('outletCtrl', ['$scope', 'outletFact', '$stateParams', function($scope, outletFact, $stateParams) {
        $scope.currentOutlet = {};

        outletFact.getOutlet($stateParams.id, function (response) {
            $scope.currentOutlet = response;
        })

    }])
    .factory('outletFact', ['$http', 'UrlFact', function($http, UrlFact){
    	let outletFact = {};

    	outletFact.getOutlet = function(id, callback) {
    	    $http.get(UrlFact.outlet + id).then(function (response) {
                callback(response.data.result)
            })
        }

    	return outletFact;
    }])