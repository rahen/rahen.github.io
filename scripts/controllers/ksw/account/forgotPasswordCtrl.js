'use strict';
(function() {
    angular.module('app')
        .controller('forgotPasswordCtrl', ['$scope',
            'ForgotPasswordService',
            '$location',
            '$rootScope',
            'EventService',
            'MixPanelService',
            'UserContextService',
            '$state',
            'LoggerService', 'ToasterService',
            function($scope, ForgotPasswordService, $location, $rootScope, EventService,
                     MixPanelService, UserContextService, $state, LoggerService, ToasterService) {
                
                if (UserContextService.isLoggedIn()) {
                    EventService.trigger('signedIn');
                    $state.go('app.accounts');
                }

                $scope.user = {
                    email: "",
                    clientURI: "NO_CLIENT_URI"
                };

                $scope.recoverNow = function(form) {
                    ToasterService.successToaster("processing...");
                    ForgotPasswordService.recover($scope.user.email).then(function(response) {
                        console.log(response);
                        var data = response.data;
                        if(data.accountStatus==1){
                            data.message+=". You\'ll receive an email shortly. Please follow the instruction in the email to complete the password recovery process.";
                            $scope.user.email="";
                        }
                        
                        ToasterService.successToaster(data.message);
                        
                    },function(response){
                         var data=response.result.error;
                         ToasterService.successToaster(data.message);
                    });
                };

            }
        ]);
})();