"use strict";
(function () {
    angular.module("app")
        .controller("orgProfileCtrl", ["$scope", "OrgProfileService", "$stateParams", "LoggerService",
            function ($scope, OrgProfileService, $stateParams, LoggerService) {
                $scope.orgId = $stateParams.accountId;
                $scope.isAdminOfThisOrg = false;
                OrgProfileService.getProfileById($scope.orgId)
                    .then(function (response) {
                        LoggerService.log(response.data);
                        $scope.orgProfile = response.data.connData;
                    });

                OrgProfileService.hasAdminConnectionToOrg($scope.orgId)
                    .then(function(response){
                       LoggerService.log(response.data);
                        $scope.isAdminOfThisOrg = response.data;
                    });
            }]);
})();