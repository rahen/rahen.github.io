"use strict";
(function () {

    angular.module("app")

        .controller("manageAttributeCtrl", ["$scope", "$stateParams", "SpaceService", "LoggerService","$mdDialog","ToasterService","$rootScope","$state",
            function ($scope, $stateParams, SpaceService, LoggerService,$mdDialog,ToasterService,$rootScope,$state) {

                $scope.toastPosition = {
                    bottom: false,
                    top: true,
                    left: false,
                    right: true
                };

                $scope.getToastPosition = function() {
                    return Object.keys($scope.toastPosition)
                        .filter(function(pos) { return $scope.toastPosition[pos]; })
                        .join(' ');
                };

                $scope.init = function(){
                    SpaceService.getSpaceAttributes($stateParams.spaceId)
                        .then(function (response) {
                            var spaceAttributes = response.data.data;
                            $scope.attributes = [];
                            angular.forEach(spaceAttributes,function(attribute){
                                if(attribute.hasOwnProperty('name')){
                                    attribute.spaceId = $stateParams.spaceId;
                                    if(attribute.type == 'date'){
                                        attribute.value = new Date(attribute.value).toLocaleDateString();
                                    }
                                    $scope.attributes.push(attribute);
                                }
                            });
                        });
                };

                $scope.init();

                $scope.openAddAttributeModal = function(ev){
                    $mdDialog.show({
                        controller: "addAttributeCtrl",
                        templateUrl: 'views/dialogs/addAttribute.html',
                        targetEvent: ev
                    })
                        .then(function (attribute) {
                            $scope.init();
                        }, function () {
                            $scope.alert = 'You cancelled the dialog.';
                        });
                };

                $scope.removeAttribute = function(attribute){
                    SpaceService.removeSpaceAttributes(attribute)
                        .then(function(response){
                            if(response.data.code){
                                $scope.init();
                                ToasterService.successToaster(response.data.message);
                            }
                        });
                };
                $scope.copyAttribute = function(attribute){
                    SpaceService.copySpaceAttribute(attribute)
                        .then(function(response){
                            if(response.data.code){
                                $scope.init();
                            }
                        });
                };

                SpaceService.getAllRules()
                    .then(function(response){
                        if(response.data.code){
                            $rootScope.rules = response.data.data;
                        }
                    });

                $scope.addNewRule = function(attribute,ev){
                    $rootScope.selectedAttribute = attribute;
                    $mdDialog.show({
                        controller: "ruleSelectionCtrl",
                        templateUrl: 'views/dialogs/ruleSelection.html',
                        targetEvent: ev
                    })
                        .then(function (rule) {
                            $rootScope.selectedRule = rule;
                            switch (rule.ruleType){
                                case 'ValueChangeUserRestriction':
                                    $state.go("space.addValueChangeUserRestrictionRule",{spaceId : $stateParams.spaceId, attributeId : $rootScope.selectedAttribute.id, ruleId : rule._id });
                                    break;
                                case 'ValueChangeApprovalLevelOne':
                                    $state.go("space.addValueChangeApprovalLevelOne",{spaceId : $stateParams.spaceId, attributeId : $rootScope.selectedAttribute.id, ruleId : rule._id });
                                    break;
                                case 'ValueChangeApprovalLevelTwo':
                                    $state.go("space.addValueChangeApprovalLevelTwo",{spaceId : $stateParams.spaceId, attributeId : $rootScope.selectedAttribute.id, ruleId : rule._id });
                                    break;
                                case 'ValueChangeApprovalLevelThree':
                                    $state.go("space.addValueChangeApprovalLevelThree",{spaceId : $stateParams.spaceId, attributeId : $rootScope.selectedAttribute.id, ruleId : rule._id });
                                    break;
                                case 'AutoNominateAward':
                                    $state.go("space.addAutoNominateAward",{spaceId : $stateParams.spaceId, attributeId : $rootScope.selectedAttribute.id, ruleId : rule._id });
                                    break;
                            }
                        }, function () {
                            $scope.alert = 'You cancelled the dialog.';
                        });
                };
            }]);
})();