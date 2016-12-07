"use strict";
(function () {
    angular.module("app")
        .controller("thirdPartyAllServicesCtrl", ["$scope", "ApiService", "UserContextService","LoggerService", "$state", "$window","$stateParams","$mdDialog",
            function ($scope, ApiService, UserContextService, LoggerService,$state, $window, $stateParams, $mdDialog) {
                var accessToken = UserContextService.getAccessToken();
                var allServiceUrl = "/api/webhook/services/?accessToken=" + accessToken;
                var orgId = $stateParams.orgId;
                init();
                $scope.getProviderLink = function(service, event){
                 switch (service.provider){
                     case "github":
                         if(service.linkTitle == 'Manage Github Webhook'){
                             $state.go("thirdparty.github",{orgId: orgId});
                         }else {
                             $window.open( service.linkUrl, '_blank');
                             configureServiceAlert('GitHub');
                         }
                         break;
                     case "jira":
                         $state.go("thirdparty.jira", {orgId: orgId});
                         break;
                 }
                };
                function configureServiceAlert(providerName){
                    var confirm = $mdDialog.confirm()
                        .title(providerName)
                        .content('You have not configure this service yet. Please configure and come back here')
                        .ariaLabel('Lucky day')
                        .ok('OK')
                        .cancel('CANCEL')
                        .targetEvent(event);
                    $mdDialog.show(confirm).then(function() {
                        init();
                    }, function() {
                        init();
                    });
                }
                function init(){
                    ApiService.get(allServiceUrl)
                        .then(function(response){
                            LoggerService.log(response.data);
                            $scope.services = response.data;
                        });
                }
        }]);
})();