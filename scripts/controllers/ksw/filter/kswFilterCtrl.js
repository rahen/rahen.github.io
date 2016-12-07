"use strict";
(function () {
    angular.module("app")
        .controller("kswFilterCtrl", ["$scope", "KswFilterService", "LoggerService", "$stateParams", "UserContextService", "SignalService", "$mdUtil", "$mdSidenav", "SpaceService", "OrgService", "$timeout", "ToasterService",
            function ($scope, KswFilterService, LoggerService, $stateParams, UserContextService, SignalService, $mdUtil, $mdSidenav, SpaceService, OrgService, $timeout, ToasterService) {
                //$scope.suggestedEmployeesContainer = false;
                //$scope.suggestedHashTagsContainer = false;
                $scope.filterParams = {
                    limit: 100,
                    hashTags: [],
                    peopleTags: [],
                    rootHashTag: $stateParams.tagName,
                    dateRange: {},
                    offset: 0,
                    count: 10,
                    awardIds: []
                };
                $scope.spaceGroupBy = [
                    {key: "entityType", value: "Group by type"},
                    {key: "tagName", value: "Group by tag"}
                ];

                initFilter();
                getAllEmployeesOfOrgs();

                var userId = UserContextService.getCurrentUserId();
                $scope.currentUserId = userId;
                $scope.selectedSpaceGroup = $scope.spaceGroupBy[1];
                $scope.spaceGroupOnSelect = function (selectedSpaceGroup) {
                    if (selectedSpaceGroup) {
                        $scope.selectedSpaces = $scope.groupCollection[selectedSpaceGroup.key];
                    }
                };
                $scope.filterMyThings = initFilter;

                $scope.loadMoreSignal = function () {
                    $scope.offSet += 10;
                };

                $scope.saveDisLike = function (signal) {
                    SignalService.saveFeedback('n', signal._id)
                        .then(function (response) {
                            var data = response.data;
                            if (data.code) {
                                signal.fbYes = data.data.fbYes;
                                signal.fbNo = data.data.fbNo;
                            }
                        });
                };

                $scope.saveLike = function (signal) {
                    SignalService.saveFeedback('y', signal._id)
                        .then(function (response) {
                            var data = response.data;
                            if (data.code) {
                                signal.fbYes = data.data.fbYes;
                                signal.fbNo = data.data.fbNo;
                            }
                        });
                };

                $scope.onCommentAttachmentChange = function (signal) {
                    var attachments = window.event.target.files;
                    angular.forEach(attachments, function (attachment) {
                        var fileReader = new FileReader();
                        fileReader.onload = function (fileLoadedEvent) {
                            var attachmentData = fileLoadedEvent.target.result.replace(/^data(.*?),/, '');
                            signal.newComment.attachments.push({name: attachment.name, fileBase64: attachmentData});
                            $scope.$apply();
                        }
                        fileReader.readAsDataURL(attachment);
                    });
                };

                $scope.saveNewComment = function (signal) {
                    signal.newComment.attachmentUrls = [];
                    if (signal.newComment.attachments.length == 0) {
                        SignalService.saveComment(signal).then(function (response) {
                            var comment = response.data;
                            if (comment.code) {
                                signal.comments.push(comment.data);
                                //  signal.newComment = {};
                                signal.newComment.attachments = [];
                                signal.newComment.attachmentUrls = [];
                                signal.newComment.taggedPeople = [];
                                signal.newComment.message = '';
                            }
                        });
                        return;
                    }

                    angular.forEach(signal.newComment.attachments, function (attachment) {
                        SignalService.attachNewFileMobile(attachment).then(function (response) {
                            // console.log(response.data);

                            // signal.newComment.attachmentUrls.push(response.headers('Url'));
                            signal.newComment.attachmentUrls.push(response.data.url);

                            if (signal.newComment.attachmentUrls.length == signal.newComment.attachments.length) {
                                SignalService.saveComment(signal).then(function (response) {
                                    var comment = response.data;
                                    if (comment.code) {
                                        signal.comments.push(comment.data);
                                        //  signal.newComment = {};
                                        signal.newComment.attachments = [];
                                        signal.newComment.attachmentUrls = [];
                                        signal.newComment.taggedPeople = [];
                                        signal.newComment.message = '';
                                    }
                                });
                            }

                        });
                    });
                };

                $scope.removeNewCommentAttachment = function (attachment, signal) {
                    signal.newComment.attachments.splice(signal.newComment.attachments.indexOf(attachment), 1);
                };

                $scope.showMiniPeoplePickerInComment = function ($event, newComment) {
                    if (newComment.message.substr($event.currentTarget.selectionStart - 1, $event.currentTarget.selectionStart) == '') {
                        newComment.caretPosition = $event.currentTarget.selectionStart;
                        newComment.showMiniPeoplePicker = true;
                        SignalService.getConnections().then(function (response) {
                            var connections = response.data;
                            newComment.people = connections;
                        });
                    }
                };

                $scope.removeNewCommentTaggedPeople = function (personId, signal) {
                    signal.newComment.taggedPeople.splice(signal.newComment.taggedPeople.indexOf(personId), 1);
                };

                angular.element(document).click(function (e) {
                    var container = angular.element(".people-picker, .mini-people-picker-container, #suggestedEmployeesContainer, #suggestedHashTagsContainer");
                    if (container.has(e.target).length === 0) {
                        container.hide();
                    }
                });

                $scope.toggleFilter = buildToggler('filter');
                $scope.toggleFilter();
                $scope.suggestedAllTags = [];
                $scope.tagSuggestions = [];
                $scope.allEmployeesOfOrgs = [];
                $scope.suggestedEmployees = [];

                SpaceService.getSuggestedHashTags()
                    .then(function (response) {
                        LoggerService.log(response.data);
                        $scope.suggestedAllTags = response.data;
                    });

                $scope.getSuggestedHashTags = function (tagName) {
                    $scope.tagSuggestions = $scope.suggestedAllTags.filter(function (tag) {
                        //$scope.suggestedHashTagsContainer = true;
                        $("#suggestedHashTagsContainer").show();
                        return tag.title.toLowerCase().indexOf(tagName.toLowerCase()) != -1;
                    });
                };

                $scope.getEmployeeSuggestion = function (employeeName) {
                    $scope.suggestedEmployees = $scope.allEmployeesOfOrgs.filter(function (employee) {
                        //$scope.suggestedEmployeesContainer = true;
                        $("#suggestedEmployeesContainer").show();
                        return employee.title.toLowerCase().indexOf(employeeName.toLowerCase()) != -1;
                    });
                    LoggerService.log($scope.suggestedEmployees);
                };

                $scope.addTagInFilter = function (tag) {
                    $scope.tagSuggestions = [];
                    $scope.filterParams.hashTags.push(tag);
                    //$scope.suggestedHashTagsContainer = false;
                    $("#suggestedHashTagsContainer").hide();
                    initFilter();
                };

                $scope.addEmployeeInFilter = function (employee) {
                    $scope.suggestedEmployees = [];
                    $scope.filterParams.peopleTags.push(employee._id);
                    //$scope.suggestedEmployeesContainer = false;
                    $("#suggestedEmployeesContainer").hide();
                    initFilter();

                };

                function initFilter() {
                    KswFilterService.getSpacesByFilters($scope.filterParams)
                        .then(function (response) {
                            if (response.data.length <= 0) {
                                ToasterService.successToaster("No space found");
                            }
                            $scope.groupCollection = {
                                entityType: {},
                                tagName: {}
                            };
                            $scope.groupCollection["entityType"] = _.groupBy(response.data, function (m) {
                                return m.entityType;
                            });
                            angular.forEach(response.data, function (space) {
                                if (space.tags.length > 0) {
                                    angular.forEach(space.tags, function (tag) {
                                        if (!$scope.groupCollection.tagName.hasOwnProperty(tag)) {
                                            $scope.groupCollection.tagName[tag] = [];
                                        }
                                        $scope.groupCollection.tagName[tag].push(space);
                                    });
                                } else {
                                    if (!$scope.groupCollection.tagName.hasOwnProperty("#UNTAGGED")) {
                                        $scope.groupCollection.tagName["#UNTAGGED"] = [];
                                    }
                                    $scope.groupCollection.tagName["#UNTAGGED"].push(space);
                                }
                            });

                            if ($scope.selectedSpaceGroup) {
                                $scope.selectedSpaces = $scope.groupCollection[$scope.selectedSpaceGroup.key];
                            } else {
                                $scope.selectedSpaces = $scope.groupCollection["tagName"];
                            }
                        });
                    KswFilterService.getActivitiesByHashTag($scope.filterParams)
                        .then(function (response) {
                            var signalData = response.data.data;
                            $scope.signals = [];
                            angular.forEach(signalData, function (signal) {
                                if (signal.hasOwnProperty('doc')) {
                                    signal.newComment = {
                                        attachments: [],
                                        people: [],
                                        taggedPeople: [],
                                        caretPosition: 0,
                                        message: ''
                                    };
                                    $scope.signals.push(signal);
                                }
                            });
                            if ($scope.signals <= 0) {
                                ToasterService.successToaster("No signal found");
                            }
                        });
                };

                function getAllEmployeesOfOrgs() {
                    var currentlySignedAs = UserContextService.getCurrentlySignedAsAccount();
                    var orgEmployeesParams = {
                        orgIds: [currentlySignedAs.isPersonalAccount == true ? null : currentlySignedAs.accountInfo.id],
                        searchKey: null,
                        includeOrgs: false
                    };
                    OrgService.getAllEmployeesOfOrgs(orgEmployeesParams)
                        .then(function (response) {
                            $scope.allEmployeesOfOrgs = response.data;
                            LoggerService.log($scope.allEmployeesOfOrgs);
                        });
                };

                function buildToggler(navID) {
                    var debounceFn = $mdUtil.debounce(function () {
                        $mdSidenav(navID)
                            .toggle()
                            .then(function () {
                                angular.element('.md-sidenav-backdrop').hide();
                            });
                    }, 300);
                    return debounceFn;
                };

                $scope.removeSuggestedEmployees = function (personId, filterParams) {
                    filterParams.peopleTags.splice(filterParams.peopleTags.indexOf(personId), 1);
                };

                $scope.removeTag = function (tag) {
                    $scope.filterParams.hashTags.splice($scope.filterParams.hashTags.indexOf(tag), 1);
                };

                //angular.element(document).click(function (e) {
                //    var container = angular.element("#suggestedEmployeesContainer, #suggestedHashTagsContainer");
                //    LoggerService.log(container);
                //    if (container.has(e.target).length === 0) {
                //        $timeout(function () {
                //            $scope.suggestedEmployeesContainer = false;
                //            $scope.suggestedHashTagsContainer = false;
                //        });
                //    }
                //});
                
            }]);
})();