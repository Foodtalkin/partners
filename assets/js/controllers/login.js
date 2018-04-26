'use strict';

/* Controllers */

angular.module('app')
    .factory('LoginFact', ['$http','$cookies', '$location', 'UrlFact',
    	function($http, $cookies,$location,UrlFact){
    	var LoginFact = {};
    	LoginFact.doLogin = function(pin, loginKey, callback){
    		$http({
				method: 'POST',
				url: UrlFact.login,
				data: {partner_pin:pin, password:loginKey}
			}).then(function (response) {
				console.log(response);
				if(response.data.result.APPSESSID){
					$cookies['batman'] = response.data.result;
                    $cookies['APPSESSID'] = response.data.result.APPSESSID;
                    $cookies['restaurant'] = response.data.result.name;
                    $cookies['restaurant_id'] = response.data.result.id;
                    $cookies['partner_pin'] = response.data.result.partner_pin;
					callback(true);
				}else{
					callback(false);
				}
	            
	        });
    	}

    	LoginFact.getUserData = function(callback){
		    var session = $cookies["batman"];
		    if(session) {
                callback(session);
			} else {
                callback(false);
			}
		}


    	return LoginFact;
    }])
    .controller('LoginCtrl', ['$scope','$location','LoginFact', function($scope,$location,LoginFact) {
    	$scope.partner = {};
    	$scope.doLogin = function(){
    		LoginFact.doLogin($scope.partner.pin, $scope.partner.password, function(response){
    			if (response) {
    				$location.path('/app/home');
    				window.location.reload(true)
    			} else {
                    alert("Invalid Pin Or Password");
                }
    		})
    	}

    }])



