(function () {
  "use strict";

  angular.module('app.controllers', [
    'ui.router'
  ])

    // directive ctrls
    .controller('MainNavCtrl', ['$scope', '$state', function ($scope, $state) {
      $scope.$state = $state;
      $scope.toggled = {
        isToggled: false
      };

      // $scope.topLevelStates = $state.get()
      //   .filter(function (states) {
      //     return !states.abstract;
      //   })
      //   .filter(function (nonAbstractStates) {
      //     return nonAbstractStates.name.match(new RegExp(".", "g")) || [].length == 1;
      //   });
      //
      // console.log("topLevelStates:", $scope.topLevelStates);

    }])

    .controller('NavMenuCtrl', ['$scope', '$state', function ($scope, $state) {
      $scope.$state = $state;
    }])

    // state ctrls
    .controller('RootCtrl', ['$scope', 'FirstLoad', function ($scope, FirstLoad) {

    }])

    .controller('HomeCtrl', ['$scope', 'FirstLoad', function ($scope, FirstLoad) {
      $scope.firstLoad = FirstLoad.getFirstLoad();
    }])

    .controller('PortfolioCtrl', ['$scope', function ($scope) {

    }])

    .controller('PortfolioItemCtrl', ['$scope', function ($scope) {

    }]);

})();
