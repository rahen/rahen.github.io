"use strict";
(function () {
      angular.module("app")        
          .controller('ToastCtrl', function($scope, $mdToast, toasterSuccess) {
              $scope.toasterSuccess = toasterSuccess;
          });
})();