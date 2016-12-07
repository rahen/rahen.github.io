"use strict";
(function () {
    angular.module("app")
        .controller("peoplePickerCtrl", ["$scope", "SignalService", "LoggerService","whoCanModify","$mdDialog","singleSelection",
            function ($scope, SignalService, LoggerService,whoCanModify,$mdDialog,singleSelection) {
                $scope.groupCollection = {
                    connType:{}
                };
                $scope.whoCanModify = whoCanModify;

                $scope.peoplePickerGroups = [
                    {key: "connType", value: "Group by connection type"},
                    {key: "entityType", value: "Group by type"},
                    {key: "nameType", value: "Group by name"}
                ];

                $scope.selectedPeoplePickerGroup = $scope.peoplePickerGroups[1];

                SignalService.getConnections().then(function (response) {
                    var connections = response.data;

                    angular.forEach(connections, function (connection) {
                        var isExists = _.find($scope.whoCanModify, {id: connection.id});
                        if (isExists) {
                            connection.isSelected = true;
                        }
                        angular.forEach(connection.connTypes,function(conn){
                          if(!$scope.groupCollection.connType.hasOwnProperty(conn)){
                              $scope.groupCollection.connType[conn] = [];
                          }
                            $scope.groupCollection.connType[conn].push(connection);
                        });
                    });

                    $scope.groupCollection["entityType"] = _.groupBy(connections, function (m) {
                        return m.entityType;
                    });
                    $scope.groupCollection["nameType"] = _.groupBy(connections, function (m) {
                        return m.title.charAt(0);
                    });

                    if ($scope.selectedPeoplePickerGroup) {
                        $scope.selectedGroup = $scope.groupCollection[$scope.selectedPeoplePickerGroup.key];
                    } else {
                        $scope.selectedGroup = $scope.groupCollection["nameType"];
                    }
                    LoggerService.log($scope.groupCollection);
                });

                $scope.updatePeoplePickerResults = function (selectedPeoplePickerGroup) {
                    if (selectedPeoplePickerGroup) {
                        $scope.selectedGroup = $scope.groupCollection[selectedPeoplePickerGroup.key];
                    }
                }

                $scope.toggleSelectPeople = function (person) {
                    if(singleSelection){
                        $mdDialog.hide(person);
                        return;
                    }
                    person.isSelected = !person.isSelected;
                    var isExists = _.find($scope.whoCanModify, {id: person.id});
                    if (!isExists) {
                        $scope.whoCanModify.push(person);
                    } else {
                        $scope.whoCanModify.splice($scope.whoCanModify.indexOf(isExists), 1);
                    }
                };

                $scope.selectPeople = function(){
                    $mdDialog.hide($scope.whoCanModify);
                };

                $scope.cancelModal = function(){
                    $mdDialog.cancel();
                }

            }]);
})();