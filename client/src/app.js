(function () {
  "use strict";

  angular.module('app', [
    'ui.router',
    'ngAnimate',
    'particle.canvas',
    'app.controllers',
    'app.directives',
    'app.services'
  ])

    .config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function ($stateProvider, $urlRouterProvider, $locationProvider) {

      $locationProvider.html5Mode({
        requireBase: true,
        enabled: true
      });

      $urlRouterProvider.otherwise('/404');

      $stateProvider
        .state('app', {
          abstract: true,
          url: '',
            templateUrl: './views/index.html',
            controller: 'RootCtrl'
        })
        .state('app.home', {
          url: '/',
            templateUrl: './views/home/index.html',
            controller: 'HomeCtrl'
        })

        .state('app.portfolio', {
          abstract: true,
          url: '/portfolio',
          templateUrl: './views/portfolio/index.html'
        })

        .state('app.portfolio.home', {
          url: '',
            templateUrl: './views/portfolio/home/index.html',
            controller: 'PortfolioCtrl'
        })

        .state('app.portfolio.tempostorm', {
          url: '/tempostorm',
          templateUrl: './views/portfolio/tempostorm/index.html'
        })

        .state('app.portfolio.canvas-squares', {
          url: '/canvas-squares',
          templateUrl: './views/portfolio/canvas-squares/index.html'
        })

        .state('app.about', {
          url: '/about',
          templateUrl: './views/about/index.html'
        })

        .state('app.contact', {
          url: '/contact',
          templateUrl: './views/contact/index.html',
          controller: ['$scope', '$http', '$timeout', function($scope, $http, $timeout) {
            $scope.user = {
              name: '',
              email: '',
              message: ''
            };

            $scope.submitting = false;
            $scope.emailSent = false;
            $scope.error = false;

            $scope.sendEmail = function (formValid) {
              if (formValid) {
                $scope.submitting = true;

                $http({
                  method: 'POST',
                  url: '/api/send-email',
                  data: $scope.user
                }).then(function () {
                  $scope.submitting = false;
                  $scope.emailSent = true;
                  $scope.contactForm.$setPristine();
                  $scope.user = {
                    name: '',
                    email: '',
                    message: ''
                  };
                }, function errorCallback(err) {
                  $scope.error = true;
                  console.log("err  :", err);
                });

              }
            };
          }]
        });

    }])

    .run(['$rootScope', 'CanvasSystem', function ($rootScope, CanvasSystem) {
      $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
        if (fromState.name == 'app.home') {
          CanvasSystem.stopAnimation();
        }

      });
    }]);

})();
