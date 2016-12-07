"use strict";
(function () {
    angular.module("app")
        .controller("awardSelectionCtrl", ["$scope", "AwardService", "LoggerService", "selectedAward", "$mdDialog", "awards",
            function ($scope, AwardService, LoggerService, selectedAward, $mdDialog, awards) {

                $scope.awards = awards;
               // LoggerService.log(awards);
                LoggerService.log(selectedAward);

                if(selectedAward){
                    var index = _.indexOf(awards, _.find(awards,{_id: selectedAward._id}));
                }

                $scope.onAwardSelect = function (award) {
                    $mdDialog.hide(award);
                };

                $scope.cancelModal = function () {
                    $mdDialog.cancel();
                };
            }]);
})();