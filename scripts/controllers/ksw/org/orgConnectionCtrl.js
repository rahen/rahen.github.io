"use strict";
(function () {
    angular.module("app")
        .controller("orgConnectionCtrl", ["$scope", "OrgProfileService", "UserContextService", "$stateParams","LoggerService","$state",
            function ($scope, OrgProfileService, UserContextService, $stateParams,LoggerService, $state ) {
                if ($stateParams.accountId == '') {
                    //var currentAccountId = currentAccount.isPersonalAccount == true ? currentAccount.accountInfo.accountId : currentAccount.accountInfo.id;
                    $state.go('org.connection', {
                        accountId: UserContextService.currentUserOrg().id
                    });
                }
                $scope.groupCollection = {
                    connType:{}
                };
                $scope.peoplePickerGroups = [
                    {key: "connType", value: "Group by connection type"},
                    {key: "entityType", value: "Group by type"},
                    {key: "nameType", value: "Group by name"}
                ];

                $scope.selectedPeoplePickerGroup = $scope.peoplePickerGroups[0];
                  
                OrgProfileService.getAllConnectionsOfOrgs($stateParams.accountId)
                    .then(function (response) {
                        var data = response.data;
                        angular.forEach(data,function(entity){
                            angular.forEach(entity.connTypes,function(type){
                                type=type.toLowerCase();
                                if(!$scope.groupCollection.connType.hasOwnProperty(type)){
                                    $scope.groupCollection.connType[type] = [];
                                }
                                $scope.groupCollection.connType[type].push(entity);
                            });
                        });
                        
                                                                
                        $scope.groupCollection["entityType"] = _.groupBy(data, function (m) {
                            return m.entityType;
                        });
                        $scope.groupCollection["nameType"] = _.groupBy(data, function (m) {
                            return m.title.charAt(0);
                        });
                       
                        var group=$scope.selectedPeoplePickerGroup.key;
                        $scope.selectedGroup = $scope.groupCollection[group];
                    });
                $scope.updatePeoplePickerResults = function (selectedPeoplePickerGroup) {
                    if (selectedPeoplePickerGroup) {
                        $scope.selectedGroup = $scope.groupCollection[selectedPeoplePickerGroup.key];
                    }
                };
                
                
                
                $scope.getEntityProfileLink = function (entity) {
                    var state=entity.entityType == "Organization"?"page.orgProfile":"page.profile";
                        $state.go(state,{accountId: entity.id});
                };
            }]);
})();