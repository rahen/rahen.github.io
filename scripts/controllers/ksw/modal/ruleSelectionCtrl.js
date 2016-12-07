"use strict";
(function () {
    angular.module("app")
        .controller("ruleSelectionCtrl", ["$scope", "SpaceService", "$rootScope", "$mdDialog",
            function ($scope, SpaceService, $rootScope, $mdDialog) {
                $scope.rules = $rootScope.rules;
                $scope.currentSelectedAttribute = $rootScope.selectedAttribute;

                $scope.isAlreadyAdded = function (rule) {
                    var isAdded = _.find($rootScope.selectedAttribute.ruleSet, function(r){
                        return r.ruleId._id == rule._id;
                    });

                    if(isAdded){
                        rule.isAlreadyAdded = true;
                        return true;
                    }
                    rule.isAlreadyAdded = false;
                    return false;
                };

                $scope.selectRule = function(rule){
                    if(rule.isAlreadyAdded){
                        return;
                    }
                    $mdDialog.hide(rule);
                };

                $scope.cancelModal = function(){
                    $mdDialog.cancel();
                }
            }]);
})();