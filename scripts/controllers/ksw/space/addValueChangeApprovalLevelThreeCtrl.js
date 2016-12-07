"use strict";
(function(){
    angular.module("app")
        .controller("addValueChangeApprovalLevelThreeCtrl",["$scope", "$stateParams", "SpaceService", "LoggerService", "$rootScope", "$mdDialog", "$state",
            function ($scope, $stateParams, SpaceService, LoggerService, $rootScope, $mdDialog, $state) {
                $scope.rule = $rootScope.selectedRule;
                $scope.attribute = $rootScope.selectedAttribute;
                $scope.whoCanModify = [];
                $scope.inputSet = {
                    question : 'like'
                };

                LoggerService.log($scope.rule);
                LoggerService.log($scope.attribute);


                SpaceService.getSpaceById($stateParams.spaceId)
                    .then(function(response){
                        $scope.space = response.data.data;
                        LoggerService.log($scope.rule);
                    });

                $scope.openPeoplePickerModal = function(ev){
                    $mdDialog.show({
                        controller: "peoplePickerCtrl",
                        templateUrl: 'views/dialogs/peoplePicker.html',
                        targetEvent: ev,
                        locals:{ whoCanModify: $scope.whoCanModify,singleSelection: false}
                    })
                        .then(function (people) {
                            $scope.whoCanModify = people;

                        }, function () {

                        });
                };

                $scope.applyRule = function(){
                    var inputSetValues = [
                        {
                            name: "DueDate",
                            value: $scope.inputSet.dueDate
                        },
                        {
                            name: "Question",
                            value: $scope.inputSet.question
                        },
                        {
                            name : "AllowedUsers",
                            value : $scope.whoCanModify
                        }
                    ];
                    SpaceService.setRulesForAttributeId($scope.rule,inputSetValues,$scope.space,$scope.attribute)
                        .then(function(response){
                            LoggerService.log(response);
                            if(response.data.code){
                                $state.go("space.manageAttribute",{spaceId : $stateParams.spaceId});
                            }
                        });
                };

            }]);
})();