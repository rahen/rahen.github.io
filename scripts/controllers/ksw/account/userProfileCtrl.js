"use strict";
(function () {
    angular.module("app")
        .controller("userProfileCtrl", 
                    ["$scope", "$stateParams", "UserContextService","AwardService","LoggerService", "ProfileService",
            function ($scope, $stateParams, UserContextService,AwardService, LoggerService, ProfileService) {
                
                $scope.userProfile={
                    firstName:'---',
                    lastName:'---'
                };
                
                // UserContextService.getProfileById($stateParams.accountId)
                //     .then(function(response){
                //         $scope.userProfile = response.data.connData;
                //         //$scope.apply();
                //         console.log($scope.userProfile);
                // });

                // AwardService.getAwardListByUserId($stateParams.accountId)
                //     .then(function(response){
                //         LoggerService.log(response.data);
                //         $scope.userProfile.awardList = response.data.data.awardList;
                        
                //     });
                    

                    
                    
            }]);
})();