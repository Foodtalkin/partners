'use strict';

/* Controllers */

angular.module('app')
    .controller('HomeCtrl', ['$scope','sortData','homeFact', function($scope, sortData, homeFact) {

    }])
    .factory('homeFact', ['$http', 'UrlFact', function($http, UrlFact){
    	let homeFact = {};


    	return homeFact;
    }])