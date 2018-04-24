/* ============================================================
 * File: config.js
 * Configure routing
 * ============================================================ */

angular.module('app')
    .config(['$stateProvider', '$urlRouterProvider', '$ocLazyLoadProvider', '$httpProvider',

        function($stateProvider, $urlRouterProvider, $ocLazyLoadProvider, $httpProvider) {

            // remove chaching in browser
            if (!$httpProvider.defaults.headers.get) {
                $httpProvider.defaults.headers.get = {};    
            }    

            // Answer edited to include suggestions from comments
            // because previous version of code introduced browser-related errors

            //disable IE ajax request caching
            // $httpProvider.defaults.headers.get['If-Modified-Since'] = 'Mon, 26 Jul 1997 05:00:00 GMT';
            // extra
            $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
            $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';



            $httpProvider.defaults.headers.common = {};
            $httpProvider.defaults.headers.post = {};
            $httpProvider.defaults.headers.put = {};
            $httpProvider.defaults.headers.patch = {};
            $httpProvider.defaults.headers.get = {};
            delete $httpProvider.defaults.headers.common["X-Requested-With"];


            $httpProvider.interceptors.push('sessionInjector');


            $urlRouterProvider
                .otherwise('/access/login');

            $stateProvider
                .state('app', {
                    abstract: true,
                    url: "/app",
                    templateUrl: "tpl/app.html"
                })
                .state('app.home', {
                    url: "/home",
                    templateUrl: "tpl/home.html",
                    controller: 'HomeCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                    'nvd3',
                                    'rickshaw',
                                    'sparkline'
                                ], {
                                    insertBefore: '#lazyload_placeholder'
                                })
                                .then(function() {
                                    return $ocLazyLoad.load([
                                        'assets/js/controllers/home.js'
                                    ]);
                                });
                        }]
                    }
                })
                .state('app.contact', {
                    url: "/contact",
                    templateUrl: "tpl/contact.html",
                    controller: 'contactCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                    
                                ], {
                                    insertBefore: '#lazyload_placeholder'
                                })
                                .then(function() {
                                    return $ocLazyLoad.load([
                                        'assets/js/controllers/contact.js'
                                    ]);
                                });
                        }]
                    }
                })
                .state('access', {
                    url: '/access',
                    template: '<div class="full-height" ui-view></div>'
                })
                .state('access.login', {
                    url: '/login',
                    templateUrl: 'tpl/login.html',
                    controller: 'LoginCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                /*
                                    Load any ocLazyLoad module here
                                    ex: 'wysihtml5'
                                    Open config.lazyload.js for available modules
                                */
                            ], {
                                insertBefore: '#lazyload_placeholder'
                            })
                                .then(function() {
                                    return $ocLazyLoad.load([
                                        'assets/js/controllers/login.js'
                                    ]);
                                });
                        }]
                    }
                })


        }
    ]);


    // cloudinary
    angular.module('app').config(['cloudinaryProvider', function (cloudinaryProvider) {
        cloudinaryProvider
            .set("cloud_name", "digital-food-talk-pvt-ltd")
            .set("upload_preset", "litsmjmb");
    }]);

    angular.module('app').config(['TitleProvider', function(TitleProvider) {
        TitleProvider.enabled(false); // it is enabled by default
     }]);
    
    angular.module('app').config(['KeepaliveProvider', 'IdleProvider', function(KeepaliveProvider, IdleProvider) {
        KeepaliveProvider.interval(10);
    }]).run(function(Idle){
        // start watching when the app runs. also starts the Keepalive service by default.
        Idle.watch();
        console.log('app started.');
    });


    // intercepter
    angular.module('app').factory('sessionInjector', ['$cookies', function($cookies) {  
    var sessionInjector = {
        request: function(config) {
            var session = $cookies["APPSESSID"];
            //console.log(session);
            if(config.url == 'https://api.cloudinary.com/v1_1/digital-food-talk-pvt-ltd/upload'){
                // console.log('');
            }else{
                if (session) {
                    config.headers['APPSESSID'] = session;
                    // console.log(config);
                }
            }
            return config;
        }
    };
    return sessionInjector;
}]);


    // experience directive
    angular.module('app').directive('experienceData', function() {
        return {
            restrict: 'EA',
            scope: {
                item : "="
            },
            replace: true,
            link: function(scope, element, attrs) {
                   scope.contentUrl = 'assets/js/directiveTemplates/' + attrs.type + '.html';
                   attrs.$observe("type",function(v){
                       scope.contentUrl = 'assets/js/directiveTemplates/' + v + '.html';
                   });
               },
            template: '<div ng-include="contentUrl"></div>'
        };
    });


    angular.module('app')
    .factory('UrlFact', function(){
        var UrlFact = {}
        var local = 'http://foodtalk-api.test/';
        var stg = "http://stg-api.foodtalk.in/";
        var live = "http://api.foodtalk.in/";

        // change before pushing online
        var baseurl = local;

        UrlFact.login = baseurl + "partners/login";
        UrlFact.logOut = baseurl + "partners/logout";

        UrlFact.appfeed = {};
        UrlFact.appfeed.redmption = baseurl + "privilege/feeds/redeemptions";
        UrlFact.appfeed.purchase = baseurl + "privilege/feeds/purchases";
        UrlFact.appfeed.eventPurchase = baseurl + "privilege/feeds/event-purchases";
        UrlFact.appfeed.signup = baseurl + "privilege/feeds/signups";

        UrlFact.contact = baseurl + "contact";

        UrlFact.experience = {};
        UrlFact.experience.main = baseurl + "privilege/experiences";
        UrlFact.experience.data = baseurl + "privilege/experiences/data";
        UrlFact.experience.sortdata = baseurl + "privilege/experiences/sort_data/";
        UrlFact.experience.refund = baseurl + "privilege/refund/"

        UrlFact.home = {};
        UrlFact.home.user = baseurl + "/privilege/analytics/user/";
        UrlFact.home.redemption = baseurl + "/privilege/analytics/redemption/";
        UrlFact.home.restaurants = baseurl + "/privilege/analytics/restaurants/";
        UrlFact.home.topuser = baseurl + "/privilege/analytics/topuser/";



        UrlFact.notification = baseurl + "privilege/push";

        UrlFact.privilege = {};
        UrlFact.privilege.restaurant = baseurl + "privilege/restaurant";
        UrlFact.privilege.outlet = baseurl + "privilege/outlet";
        UrlFact.privilege.outletRedeemedReport = baseurl + "privilege/outlet/redeemed-report";
        UrlFact.privilege.cuisine = baseurl + "privilege/cuisine";
        UrlFact.privilege.outletOffer = baseurl + "privilege/outlet-offer";
        UrlFact.privilege.offer = baseurl + "privilege/offer";
        UrlFact.privilege.userReport = baseurl + "privilege/analytics/user-csv";

        UrlFact.transactions = baseurl + "privilege/transactions";

        UrlFact.user = baseurl + "privilege/user";
        UrlFact.privilege.salesRevenue = baseurl + "privilege/analytics/sales-revenue";

        UrlFact.privilege.liveEvents = baseurl + "privilege/details/live-events";
        UrlFact.privilege.valuableUsers = baseurl + "privilege/analytics/valuable-users";
        UrlFact.privilege.onboardedUsersCount = baseurl + "privilege/analytics/onboarded-users-count";
        UrlFact.privilege.couponOnBoardPieChart = baseurl + "privilege/analytics/coupon-boarded-pie-chart";
        UrlFact.privilege.restaurantRating = baseurl + "privilege/analytics/restaurant-rating";
        UrlFact.privilege.userSubscriptionState = baseurl + "privilege/analytics/user-state";

        UrlFact.coupon = baseurl + "privilege/coupons";

        return UrlFact;
    })