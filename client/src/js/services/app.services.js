(function () {
  "use strict";

  angular.module('app.services', [])

    .service('FirstLoad', [function () {
      var firstLoad = true;
      return {
        setFirstLoad: function (bool) {
          firstLoad = bool;
        },
        getFirstLoad: function () {
          return firstLoad;
        }
      };
    }]);

})();
