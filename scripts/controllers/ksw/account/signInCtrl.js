'use strict';
(function() {
    angular.module('app')
        .controller('signInCtrl', ['$scope',
            'LoginService',
            '$location',
            '$rootScope',
            'EventService',
            'MixPanelService',
            'UserContextService',
            '$state',
            'LoggerService', 'ToasterService',
            function($scope, LoginService, $location, $rootScope, EventService,
                     MixPanelService, UserContextService, $state, LoggerService, ToasterService) {
                if (UserContextService.isLoggedIn()) {
                    EventService.trigger('signedIn');
                    $state.go('app.accounts');
                }

                $scope.user = {
                    loginEmail: "",
                    loginPassword: "",
                    clientURI: "NO_CLIENT_URI",
                    timeOffset: 360
                };


                $scope.loginNow = function() {
                    if(!$scope.form.$valid) return;
                    LoginService.sendLoginRequest($scope.user).then(function(response) {
                        var data = response.data;
                        if (data.accountStatus == 2) {
                            LoggerService.log(response.data);
                            UserContextService.saveCurrentUserData(data.userObj);
                            UserContextService.changeCurrentlySignedAsAccount(false, UserContextService.currentUserOrg());
                            EventService.trigger('signedIn');
                            LoggerService.log(UserContextService.currentUserOrg());
                            EventService.trigger('updateProfilePicture', data.userObj);
                            $state.go('app.accounts', {
                                accountId: UserContextService.currentUserOrg().id
                            });
                        } else {
                            ToasterService.successToaster(data.message);
                        }
                    },function(response){
                         var data=response.result||{};
                         ToasterService.successToaster(data.message||'Opps.. Something went wrong. Please try again later.');
                         console.log(response);
                    });
                };

                $scope.loginAlert = function() {

                }
            }
        ]);
})();