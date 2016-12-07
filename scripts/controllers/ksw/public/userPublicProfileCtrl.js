"use strict";
(function(){
    angular.module("app")
        .controller("userPublicProfileCtrl",["$scope","PublicService","$stateParams", function($scope, PublicService, $stateParams){
            
            $scope.entityType = "Person";
            $scope.entityId  = $stateParams.accountId;
            
            PublicService.getPublicProfile($scope.entityType, $scope.entityId)
                .then(function(response){
                    $scope.userProfile = response.data.connData;
                    console.log('userProfile',response.data);
                });

            PublicService.getPublicProfileBadges($scope.entityType, $scope.entityId)
                .then(function(response){
                    console.log('getPublicProfileBadges',response.data);
                    $scope.userAdwards = _.where(response.data.data, {status: 'Awarded'});
                });
             
             
        }]);
})();