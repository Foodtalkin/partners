'use strict';

/* Controllers */

angular.module('app')
    .controller('contactCtrl', ['$scope', 'contactFact', '$cookies', function($scope, contactFact, $cookies) {
		$scope.contact = {}

		$scope.createContact = function () {

            let data = {
                name: $cookies['restaurant'] + ' Restaurants',
                phone: $scope.contact.contact,
                email: $scope.contact.email,
                purpose: 'partners_app',
                message: $scope.contact.message
            };

            contactFact.sendContact(data, function (response) {
            	$scope.contact = {};
                if (response.data.code == 200) {
                    var message ="Hurray! New contact request is created"

                    $('body').pgNotification({
                        style: 'bar',
                        message: message,
                        position: 'top',
                        timeout: 5000,
                        type: 'success'
                    }).show();
                } else {
                    var message ="Oops! somthing went wrong. Please try again"
                    $('body').pgNotification({
                        style: 'bar',
                        message: message,
                        position: top,
                        timeout: 5000,
                        type: 'error'
                    }).show();
                }
            })
        }
    }])
    .factory('contactFact', ['$http', 'UrlFact', function($http, UrlFact){
    	var contactFact = {};

    	contactFact.sendContact = function(data, callback) {
            $http({
                method: 'POST',
                url: UrlFact.contact,
                data: data
            }).then(function(response){
                callback(response);
            });
		}

    	return contactFact;
    }])