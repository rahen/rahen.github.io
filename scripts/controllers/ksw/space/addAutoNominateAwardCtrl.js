"use strict";
(function () {
    angular.module("app")
        .controller("addAutoNominateAwardCtrl", ["$scope", "$stateParams", "SpaceService", "LoggerService", "$rootScope", "$mdDialog", "$state", "AwardService","UserContextService",
            function ($scope, $stateParams, SpaceService, LoggerService, $rootScope, $mdDialog, $state, AwardService,UserContextService) {
                $scope.rule = $rootScope.selectedRule;
                $scope.attribute = $rootScope.selectedAttribute;
                $scope.selectedCandidate = null;
                $scope.inputSet = {};
                $scope.selectedAward = {};
                $scope.awards = [];
                $scope.currentUser = UserContextService.getPersonalAccountInfo();
                $scope.nominator = null;

                $scope.candidateOption = 'Whoever makes the change';
                $scope.awardedByOption = 'The rule maker'

                AwardService.getAllAwards()
                    .then(function (response) {
                        var data = response.data;
                        if (data.code) {
                            $scope.awards = data.data;
                        }
                    });

                SpaceService.getSpaceById($stateParams.spaceId)
                    .then(function (response) {
                        $scope.space = response.data.data;
                        LoggerService.log($scope.rule);
                    });

                $scope.openPeoplePickerModalForCandidates = function (ev) {
                    $mdDialog.show({
                        controller: "peoplePickerCtrl",
                        templateUrl: 'views/dialogs/peoplePicker.html',
                        targetEvent: ev,
                        locals: {whoCanModify: [], singleSelection: true}
                    })
                        .then(function (candidate) {
                            $scope.selectedCandidate = candidate;
                            LoggerService.log($scope.selectedCandidate);

                        }, function () {

                        });
                };

                $scope.openPeoplePickerModalForAwardedBy = function (event) {
                    $mdDialog.show({
                        controller: "peoplePickerCtrl",
                        templateUrl: 'views/dialogs/peoplePicker.html',
                        targetEvent: event,
                        locals: {whoCanModify: [], singleSelection: true}
                    })
                        .then(function (candidate) {
                            $scope.nominator = candidate;

                        }, function () {

                        });
                };

                $scope.openAwardPickerModal = function (event) {

                    $mdDialog.show({
                        controller: "awardSelectionCtrl",
                        templateUrl: 'views/dialogs/awardSelection.html',
                        targetEvent: event,
                        locals: {selectedAward: $scope.selectedAward, awards: $scope.awards}
                    })
                        .then(function (selectedAward) {
                            $scope.selectedAward = selectedAward;
                            LoggerService.log(selectedAward);

                        }, function () {

                        });
                };

                $scope.applyRule = function () {
                    var currentlySignedAs = UserContextService.getCurrentlySignedAsAccount();

                    if(!$scope.nominator){
                        $scope.nominator = {
                            id : $scope.currentUser.accountId,
                            title : $scope.currentUser.userName
                        };
                    }

                    var inputSetValues = [
                        {
                            name: "AwardNominationData",
                            value: {
                                awardDbObj: {
                                    whoCanPledge: currentlySignedAs.isPersonalAccount == true ? null : currentlySignedAs.accountInfo.id,
                                    candidates: [],
                                    templateId: $scope.selectedAward._id,
                                    initialPledgeRequired: $scope.selectedAward.initialPledgeRequired,
                                    comment: ""
                                },
                                awardTemplate: {
                                    title: $scope.selectedAward.title,
                                    description: $scope.selectedAward.description,
                                    imageUri: $scope.selectedAward.imageUri,
                                    _id: $scope.selectedAward._id,
                                    __v: $scope.selectedAward.__v,
                                    initialPledgeRequired: $scope.selectedAward.initialPledgeRequired,
                                    awardScope: {
                                        _id: null,
                                        organizationName: "Public"
                                    },
                                    tags: $scope.selectedAward.tags,
                                    displayOrganization: "Public",
                                    id: $scope.selectedAward._id,
                                    tag: $scope.selectedAward.tags[0],
                                    candidatesList: [],
                                    candidates: []
                                },
                                nominator: {
                                    id: $scope.nominator.id,
                                    title: $scope.nominator.title
                                },
                                isWhoeverChanges: $scope.candidateOption == 'Whoever makes the change' ? true : false,
                                isRuleMaker: $scope.awardedByOption == 'The rule maker' ? true : false
                            }
                        }
                    ];

                    if($scope.selectedCandidate){
                        inputSetValues[0].value.awardDbObj.candidates.push($scope.selectedCandidate.id);
                        inputSetValues[0].value.awardTemplate.candidates.push($scope.selectedCandidate.id);
                        inputSetValues[0].value.awardTemplate.candidatesList.push({
                            id: $scope.selectedCandidate.id,
                            title: $scope.selectedCandidate.title
                        });
                    }
                    SpaceService.setRulesForAttributeId($scope.rule, inputSetValues, $scope.space, $scope.attribute)
                        .then(function (response) {
                            LoggerService.log(response);
                            if (response.data.code) {
                                $state.go("space.manageAttribute", {spaceId: $stateParams.spaceId});
                            }
                        });
                };

                $scope.onSelectCandidateOption = function(value){
                  if(value == 'Whoever makes the change')  {
                      $scope.selectedCanditate == null;
                  }
                };

                $scope.onSelectAwardedByOption = function(value){
                    if(value == 'The rule maker'){
                        $scope.nominator = null;
                    }
                };

            }]);
})();