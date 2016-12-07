"use strict";
(function () {
    angular.module("app")
        .controller("createConnectionCtrl", ["$scope", "ConnectionRequestService","OrgProfileService","$stateParams","LoggerService","UserContextService",
            function ($scope, ConnectionRequestService,OrgProfileService, $stateParams, LoggerService, UserContextService) {
                $scope.accountId = $stateParams.accountId;
                $scope.type = $stateParams.type;

                if(!$scope.accountId){
                    $scope.accountId = UserContextService.getCurrentUserId();
                }

                if ($stateParams.type == 'org'){
                    OrgProfileService.getProfileById($scope.accountId)
                        .then(function (response) {
                            LoggerService.log(response.data);
                           var account = response.data.connData;

                            $scope.selectedAccount = {
                                _id:  account.id,
                                name: account.companyName,
                                entityType: 'Organization'
                            };
                            init();
                        });
                }else{
                    LoggerService.log($stateParams.type);
                    $scope.selectedAccount = {
                        _id: $scope.accountId,
                        name: 'Personal Account',
                        entityType: 'Person'
                    };
                    init();
                }




                $scope.selectedConnections = [];

                $scope.acceptRequest = function (request) {
                    ConnectionRequestService.acceptConnectionRequests(request)
                        .then(function (response) {
                            if (response.data.code == 1) {
                                init();
                            } else {
                            }
                        });
                };
                $scope.rejectRequest = function (request) {
                    ConnectionRequestService.rejectConnectionRequests(request)
                        .then(function (response) {
                            if (response.data.code == 1) {
                                init();
                            } else {
                            }
                        });

                };
                $scope.acceptAll = function () {
                    if (!$scope.allConnections.connectionRequests.length) {
                        return;
                    }
                    ConnectionRequestService.acceptConnectionRequests($scope.allConnections.connectionRequests)
                        .then(function (response) {
                            FoundationApi.publish('loaderModal', 'close');
                            if (response.data.code == 1) {
                                $scope.accountOnChange($scope.selectedAccount);
                            } else {
                            }
                        });
                };
                $scope.sendRequest = function (recommended) {
                    ConnectionRequestService.sendConnectionRequests($scope.selectedAccount, recommended)
                        .then(function (response) {
                            if (response.data.code == 1) {
                                init();
                            } else {
                            }
                        });
                };
                $scope.sendRequestAll = function () {
                    if (!$scope.allConnections.recommendedConnections.length) {
                        return;
                    }
                    ConnectionRequestService.sendConnectionRequests($scope.selectedAccount, $scope.allConnections.recommendedConnections)
                        .then(function (response) {
                            if (response.data.code == 1) {
                            } else {
                            }
                        });
                };
                $scope.updateSearchResults = function (searchKey) {
                    if (searchKey == "") {
                        $scope.searchResults = [];
                        return;
                    }
                    ConnectionRequestService.searchDomainUsersAndOrgs($scope.selectedAccount, searchKey)
                        .then(function (response) {
                            if ($scope.searchKey != "") {
                                $scope.searchResults = response.data;
                            }
                        });
                };
                $scope.selectResult = function (result) {
                    $scope.selectedConnections.push(result);
                    $scope.searchResults = [];
                    $scope.searchKey = '';
                };
                $scope.sendInvitation = function (connection) {
                    ConnectionRequestService.sendConnectionRequests($scope.selectedAccount, connection)
                        .then(function (response) {
                            $scope.selectedConnections = [];
                            if (response.data.code == 1) {
                                init();
                            } else {
                            }
                        });
                };
                $scope.removeInvitation = function (connection) {
                    var connectionIndex = $scope.selectedConnections.indexOf(connection);
                    $scope.selectedConnections.splice(connectionIndex, 1);
                };
                $scope.sendInvitationToAll = function () {
                    if (!$scope.selectedConnections.length) {
                        return;
                    }
                    ConnectionRequestService.sendConnectionRequests($scope.selectedAccount, $scope.selectedConnections)
                        .then(function (response) {
                            $scope.selectedConnections = [];
                            if (response.data.code == 1) {
                            } else {
                            }
                        });
                };

                function init(){
                    ConnectionRequestService.getCreateConnectionsData($scope.selectedAccount)
                        .then(function (response) {
                            $scope.allConnections = response.data;
                            console.log(response.data);
                        });
                }
            }]);
})();