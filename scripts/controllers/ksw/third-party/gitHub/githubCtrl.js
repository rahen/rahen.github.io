"use strict";
(function () {
    angular.module("app")
        .controller("githubCtrl", [
            "$scope", "UserContextService","ApiService",
            function ($scope, UserContextService,ApiService) {
                
                $scope.corporateConnections = UserContextService.getCorporateConnection();
                $scope.personalAccountInfo = UserContextService.getPersonalAccountInfo();
                $scope.personalAccountInfo.title =  $scope.personalAccountInfo.accountType;
                $scope.corporateConnections.splice(0, 0, $scope.personalAccountInfo);

                $scope.data = {};
                $scope.data.isDisabled = true;
                
                $scope.data.getValue = function(organization){                    
                    $scope.data.isDisabled = organization == null ? true : false;
                };
                $scope.addGitAccountUrl = ApiService.thirdPartyServiceUrl+"/api/gitHub/registerNewAccount?knotSuiteAccessToken="+UserContextService.getAccessToken();
            }
        ]);
})();