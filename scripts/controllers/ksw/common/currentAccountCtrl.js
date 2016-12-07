"use strict";
(function () {
    angular.module("app")
        .controller("currentAccountCtrl", [
            "$scope", "EventService", "UserContextService", "LoginService", "$location", "$rootScope", "LoggerService","hashTagService", "$stateParams",
            function ($scope, EventService, UserContextService, LoginService, $location, $rootScope, LoggerService, hashTagService, $stateParams) {
                $scope.currentAccount = UserContextService.getCurrentAccountInfo();
                $scope.corporateConnections = UserContextService.getCorporateConnection();
                $scope.personalAccountInfo = UserContextService.getPersonalAccountInfo();
                $scope.stateParams= $stateParams||{};
                
                $scope.canEdit=function(accountId){
                    
                    var ac=$scope.currentAccount,
                        cc=$scope.corporateConnections,
                        pc=$scope.personalAccountInfo,
                        li=UserContextService.isLoggedIn(),
                        sp=$scope.stateParams;
                        //console.log({ac:ac,cc:cc,pc:pc,li:li,sp:sp});
                   return li;
                }
                
                //console.log($scope.personalAccountInfo);
                $scope.changeAccount = function (account, isPersonal) {
                    UserContextService.changeCurrentlySignedAsAccount(isPersonal, account);

                    $scope.currentAccount = UserContextService.getCurrentAccountInfo();
                    LoggerService.log($scope.currentAccount);
                };
                $scope.signOut = function () {
                    LoginService.signOut();
                    $rootScope.isLoggedIn = false;
                    $location.path('/');
                };
            }
        ]);
})();