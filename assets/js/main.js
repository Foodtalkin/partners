/* ============================================================
 * File: main.js
 * Main Controller to set global scope variables. 
 * ============================================================ */

angular.module('app')
    .controller('AppCtrl', ['$scope', '$rootScope', '$state','Idle','$location', 'appFact', '$cookies',
        function($scope, $rootScope, $state,Idle, $location, appFact, $cookies) {

        // App globals
        $scope.app = {
            name: 'Pages',
            description: 'Admin Dashboard UI kit',
            layout: {
                menuPin: false,
                menuBehind: false,
                theme: 'pages/css/pages.css'
            },
            author: 'Revox'
        }

        // Checks if the given state is the current state
        $scope.is = function(name) {
            return $state.is(name);
        }

        // Checks if the given state/child states are present
        $scope.includes = function(name) {
            return $state.includes(name);
        }

        // Broadcasts a message to pgSearch directive to toggle search overlay
        $scope.showSearchOverlay = function() {
            $scope.$broadcast('toggleSearchOverlay', {
                show: true
            })
        }
        $scope.events = [];
        $scope.idle = 600;
        $scope.timeout = 30;

        $scope.$on('IdleStart', function() {
            //console.log('IdleStart');
          addEvent({event: 'IdleStart', date: new Date()});
        });

        $scope.$on('IdleEnd', function() {
            //console.log('IdleEnd');
          addEvent({event: 'IdleEnd', date: new Date()});
        });

        $scope.$on('IdleWarn', function(e, countdown) {
            //console.log('warn');
          addEvent({event: 'IdleWarn', date: new Date(), countdown: countdown});
        });

        $scope.$on('IdleTimeout', function() {

            //console.log('Idletimeout');
          addEvent({event: 'IdleTimeout', date: new Date()});
          $location.path('access/login');
           $scope.reset();
        });

        $scope.$on('Keepalive', function() {
            //console.log('keepalive');
          addEvent({event: 'Keepalive', date: new Date()});
        });

        function addEvent(evt) {
          $scope.$evalAsync(function() {
            $scope.events.push(evt);
          })
        }

        $scope.reset = function() {
            console.log('reset');
          Idle.watch();
        }

        $scope.$watch('idle', function(value) {
          if (value !== null) Idle.setIdle(value);
        });

        $scope.$watch('timeout', function(value) {
          if (value !== null) Idle.setTimeout(value);
        });

        $scope.logOut = function(){
            appFact.LogOut(function(response){
                if(response){
                    $location.path('/access/login');
                }
            })
        }

        $scope.outlets = {};
        $scope.restaurant = {}

        $scope.getRestaurantDetails = function () {
            if ($cookies['APPSESSID'] && $cookies['restaurant_id']) {
                appFact.getRestaurantDetails(function (response) {
                    $scope.restaurant = response.data.result;
                    $scope.outlets = response.data.result.outlet;
                });
            }
        }
        $scope.getRestaurantDetails();
    }])
    .factory('appFact', ['$http','$cookies', 'UrlFact',
        function($http, $cookies, UrlFact){
            let appFact = {};

            appFact.LogOut = function(callback){
                $http({
                    method: 'DELETE',
                    url: UrlFact.logOut
                }).then(function (response) {
                    console.log(response)
                    if(response.status = 202){
                        $cookies['APPSESSID'] = "";
                        callback(true);
                    }else{
                        callback(false);
                    }
                });
            }

            appFact.getRestaurantDetails = function  (callback) {
                $http.get(UrlFact.restaurant).then(function (response) {
                    callback(response);
                })
            }

            return appFact;
        }]);




angular.module('app')
    /*
        Use this directive together with ng-include to include a 
        template file by replacing the placeholder element
    */
    
    .directive('includeReplace', function() {
        return {
            require: 'ngInclude',
            restrict: 'A',
            link: function(scope, el, attrs) {
                el.replaceWith(el.children());
            }
        };
    })