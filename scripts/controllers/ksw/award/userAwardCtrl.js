"use strict";
(function () {
    angular.module("app")
        .controller("userAwardCtrl", ["$scope", "ApiService", "UserContextService", "$stateParams", "AwardService","LoggerService",
            function ($scope, ApiService, UserContextService, $stateParams, AwardService,LoggerService) {
               
                AwardService.getNominatedAwardById($stateParams.accountId)
                    .then(function (response) {
                        LoggerService.log(response);
                        $scope.nominatedAwards = response.data.data.awardList;
                    });


                AwardService.getAwardListByUserId($stateParams.accountId)
                    .then(function (response) {
                        response.data.data.forEach(function(award){
                            award.badgeGivenDate = new Date(award.badgeGivenDate).toDateString();
                        });
                        $scope.awards = response.data.data;
                    });
            }]);
})();