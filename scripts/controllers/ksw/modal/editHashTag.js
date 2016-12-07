"use strict";
(function () {
    angular.module("app")
        .controller("editHashTag", ["$scope","$mdDialog","hashTag", function ($scope,$mdDialog,hashTag) {
            $scope.hashTag = hashTag;
            $scope.saveTag = function () {
                $mdDialog.hide($scope.hashTag);
            };
            $scope.cancelModal = function () {
                $mdDialog.cancel();
            };
        }]);
})();