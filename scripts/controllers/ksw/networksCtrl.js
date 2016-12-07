"use strict";
(function () {
    angular.module("app")
        .controller("networksCtrl", ["$scope", "$stateParams", "UserContextService", "LoggerService", "$state",
            function ($scope, $stateParams, UserContextService, LoggerService, $state) {
                LoggerService.log($stateParams);

                $scope.groupCollection = {
                    connType:{}
                };

                $scope.peoplePickerGroups = [
                    {key: "connType", value: "Group by connection type"},
                    {key: "entityType", value: "Group by type"},
                    {key: "nameType", value: "Group by name"}
                ];

                $scope.selectedPeoplePickerGroup = $scope.peoplePickerGroups[1];

                UserContextService.getAllConnectionsOfUser($stateParams.accountId).then(function (response) {
                    var data = response.data;
                    $scope.peoplePickerFlag = true;

                     angular.forEach(data,function(entity){
                         angular.forEach(entity.connTypes,function(type){
                            if(!$scope.groupCollection.connType.hasOwnProperty(type)){
                                $scope.groupCollection.connType[type] = [];
                            }
                             $scope.groupCollection.connType[type].push(entity);
                         });
                     });

                    //$scope.groupCollection[""] = _.groupBy(data, function (m) {
                    //    return m.connType[0];
                    //});
                    $scope.groupCollection["entityType"] = _.groupBy(data, function (m) {
                        return m.entityType;
                    });

                    $scope.groupCollection["nameType"] = _.groupBy(data, function (m) {
                        return m.title.charAt(0);
                    });

                    if ($scope.selectedPeoplePickerGroup) {
                        $scope.selectedGroup = $scope.groupCollection[$scope.selectedPeoplePickerGroup.key];
                    } else {
                        $scope.selectedGroup = $scope.groupCollection["connType"];
                    }

                    LoggerService.log($scope.groupCollection);
                });
                $scope.updatePeoplePickerResults = function (selectedPeoplePickerGroup) {
                    if (selectedPeoplePickerGroup) {
                        $scope.selectedGroup = $scope.groupCollection[selectedPeoplePickerGroup.key];
                    }
                };

                $scope.getEntityProfileLink = function (entity) {
                    if (entity.entityType == "Organization") {
                        $state.go("page.orgProfile",{accountId: entity.id});
                    }else{
                        $state.go("page.profile",{accountId: entity.id});
                    }
                };

            }]);
})();