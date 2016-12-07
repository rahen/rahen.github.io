"use strict";
(function () {
    angular.module("app")
        .controller("spaceAttributeCtrl", ["$scope", "$stateParams", "SpaceService", "LoggerService", "$mdDialog", "UserContextService",
            function ($scope, $stateParams, SpaceService, LoggerService, $mdDialog, UserContextService) {

                $scope.booleanOptions = ['Yes', 'No'];
                $scope.spaceId = $stateParams.spaceId;
                var userId = UserContextService.getCurrentUserId();

                $scope.init = function () {
                    SpaceService.getSpaceAttributes($stateParams.spaceId)
                        .then(function (response) {
                            var spaceAttributes = response.data.data;
                            $scope.attributes = [];
                            angular.forEach(spaceAttributes, function (attribute) {
                                if (attribute.hasOwnProperty('name')) {
                                    attribute.spaceId = $stateParams.spaceId;
                                    if (attribute.type == 'date') {
                                        attribute.value = new Date(attribute.value).toLocaleDateString();
                                    } else if (attribute.type == 'boolean') {
                                        attribute.value = $scope.booleanOptions[$scope.booleanOptions.indexOf(attribute.value)];
                                    }
                                    $scope.attributes.push(attribute);
                                }
                            });
                        });
                };

                $scope.init();

                $scope.openAddAttributeModal = function (ev) {
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

                $scope.updateAttribute = function (attribute) {
                    SpaceService.updateSpaceAttribute(attribute)
                        .then(function (response) {
                            if (response.data.code) {
                                $scope.init();
                            }
                        });
                };

                $scope.isEditableByCurrentUser = function (attribute) {
                    if (!attribute.hasOwnProperty('ruleSet')) return false

                    var valueChangeUserRestriction = _.find(attribute.ruleSet, {ruleType: 'ValueChangeUserRestriction'});

                    if (!valueChangeUserRestriction) return false;

                    var isCurrentUserExist = _.find(valueChangeUserRestriction.inputSetValues[0].value, {_id: userId});

                    if(isCurrentUserExist) return false;

                    return true;
                };

            }]);
})();