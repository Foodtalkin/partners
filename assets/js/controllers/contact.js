'use strict';

/* Controllers */

angular.module('app')
    .controller('contactCtrl', ['$scope','$location','contactFact','UrlFact',
     function($scope,$location,contactFact, UrlFact) {

    }])
    .factory('contactFact', ['$http','UrlFact', 
    	function($http, UrlFact){
    	var contactFact = {};

    	return contactFact;
    }])