(function () {
  "use strict";

  angular.module('app.directives', [
    'app.controllers'
  ])

    .directive('mainNav', ['$window', 'FirstLoad', function ($window, FirstLoad) {
      return {
        restrict: 'E',
        replace: true,
        templateUrl: './js/directives/templates/main-nav/index.html',
        controller: 'MainNavCtrl',
        link: function (scope, elem) {
          var debug = 0;

          var real1 = 5500;
          setTimeout(function () {
            if ($window.innerWidth > 1024) {
              elem.addClass('active');
              elem.removeClass('starting');
            } else {
              elem.addClass('active-sm');
              elem.removeClass('starting');
            }
          }, debug);

          var real2 = 7500;

          setTimeout(function () {
            if (elem.hasClass('active')) elem.removeClass('active');
            if (elem.hasClass('active-sm')) elem.removeClass('active-sm');
            if ($('#svg-elem').hasClass('starting')) $('#svg-elem').removeClass('starting');
            if ($('#logo-img').hasClass('starting')) $('#logo-img').removeClass('starting');
            FirstLoad.setFirstLoad(false);
          }, debug);

          var real3 = 6500;
          setTimeout(function () {
            $('#svg-wrap').addClass('active');
          }, debug);

          var real4 = 9000;
          setTimeout(function () {
            $('#toggle').addClass('show');
          }, debug);
        }
      };
    }])

    .directive('svgLogo', [function () {
      return {
        restrict: 'E',
        templateUrl: './js/directives/templates/svg-logo/index.html'
      };
    }])

    .directive('navMenu', [function () {
      return {
        restrict: 'E',
        replace: true,
        scope: {
          toggled: '='
        },
        controller: 'NavMenuCtrl',
        templateUrl: './js/directives/templates/nav-menu/index.html',
        link: function (scope, elem) {
          setTimeout(function () {
            $('#menu-home').addClass('show');
          }, 200);

          setTimeout(function () {
            $('#menu-portfolio').addClass('show');
          }, 400);

          setTimeout(function () {
            $('#menu-about').addClass('show');
          }, 600);

          setTimeout(function () {
            $('#menu-contact').addClass('show');
          }, 800);

          setTimeout(function () {
            $('footer').addClass('show');
          }, 1000);
        }
      };
    }])

    .directive('pageTransitions', ['$rootScope', function ($rootScope) {
      return {
        link: function (scope, elem) {
          $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState) {

            var orderOfStates = ['app.home', 'app.portfolio.home', 'app.portfolio.tempostorm', 'app.portfolio.canvas-squares', 'app.about', 'app.contact'];
            var toState = toState.name;
            var fromState = fromState.name;
            var indexOfToState = orderOfStates.indexOf(toState);
            var indexOfFromState = orderOfStates.indexOf(fromState);

            if (indexOfToState < indexOfFromState && (indexOfToState != -1 && indexOfFromState != -1)) {
              if (!elem.hasClass('cube-right')) {
                elem.addClass('cube-right');
              }

              if (elem.hasClass('cube-left')) {
                elem.removeClass('cube-left');
              }
            } else {
              if (!elem.hasClass('cube-left')) {
                elem.addClass('cube-left');
              }

              if (elem.hasClass('cube-right')) {
                elem.removeClass('cube-right');
              }
            }

          });
        }
      };
    }])

    .directive('portfolioPageTransitions', ['$rootScope', function ($rootScope) {
      return {
        link: function (scope, elem) {
          $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState) {

            var orderOfStates = ['app.portfolio.home', 'app.portfolio.tempostorm', 'app.portfolio.canvas-squares'];
            var toState = toState.name;
            var fromState = fromState.name;
            var indexOfToState = orderOfStates.indexOf(toState);
            var indexOfFromState = orderOfStates.indexOf(fromState);

            if (indexOfToState < indexOfFromState && (indexOfToState != -1 && indexOfFromState != -1)) {
              if (!elem.hasClass('cube-up')) {
                elem.addClass('cube-up');
              }

              if (elem.hasClass('cube-down')) {
                elem.removeClass('cube-down');
              }
            } else {
              if (!elem.hasClass('cube-down')) {
                elem.addClass('cube-down');
              }

              if (elem.hasClass('cube-up')) {
                elem.removeClass('cube-up');
              }
            }

          });
        }
      };
    }])

    .directive('elastic', ['$timeout', '$window', function($timeout, $window) {
        return {
          restrict: 'A',
          link: function($scope, element) {
            element.focus();

            $timeout(function () {
              element.blur();
              $window.scrollTo(0, 0);
            }, 1);

            element.on("focus", function () {
              element[0].style.height = "240px";
            });

            element.on("focusout", function () {
              element[0].style.height = "40px";
            });
          }
        };
      }
    ]);

})();
