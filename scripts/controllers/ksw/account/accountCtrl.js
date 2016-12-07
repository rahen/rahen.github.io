"use strict";
(function () {
    angular.module('app')
        .controller('accountCtrl', ["$scope",
            "$stateParams",
            "UserContextService",
            "SignalService",
            "hashTagService",
            "SpaceService",
            "LoggerService",
            "$state",
            "$rootScope",
            "ChatService",
            "NotificationService",
            function ($scope, $stateParams, UserContextService, SignalService, hashTagService, SpaceService, LoggerService, $state, $rootScope, ChatService, NotificationService) {
                var currentAccount = UserContextService.getCurrentlySignedAsAccount();
                if ($stateParams.accountId == '') {
                    //var currentAccountId = currentAccount.isPersonalAccount == true ? currentAccount.accountInfo.accountId : currentAccount.accountInfo.id;
                    $state.go('app.accounts', {
                        accountId: UserContextService.currentUserOrg().id
                    });
                }
                $scope.hashTagsBypersona = [];
                hashTagService.getHotHashTagsByPersona(3, null)
                    .then(function (response) {
                        LoggerService.log(response);
                        $rootScope.hashTagsBypersona = response.data;
                    });

                ChatService.getUnreadConversationIds()
                    .then(function (response) {
                        $rootScope.totalUnreadMessage = response.data.count;
                    });

                NotificationService.getNotificationsWithUnseenCount()
                    .then(function (response) {
                        $rootScope.notifications = response.data;
                         console.log('notifications',response.data);
                 });
                
                $scope.loadMoreSignal = function () {
                    $scope.signalOffSet += 10;
                    $scope.signalLoaderIsBusy = true;
                    SignalService.getSignals($scope.signalOffSet).then(function (response) {
                        var signals = response.data;
                        angular.forEach(signals.data, function (signal) {
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
                        $scope.signalLoaderIsBusy = false;
                        $scope.$broadcast('content.changed');
                    });
                };
                var currentAccount = UserContextService.getCurrentlySignedAsAccount();
                $scope.accountName = currentAccount.isPersonalAccount == true ? 'Personal Account' : currentAccount.accountInfo.title;
                $rootScope.parentSpaceId = currentAccount.isPersonalAccount == true ? UserContextService.getPersonalAccountInfo().currentUserData.predefinedSpaces.sharedSpace : currentAccount.accountInfo.predefinedSpaces.sharedSpace;

                SpaceService.getUserOrganizationsWithNotificationCount()
                    .then(function (response) {
                        var orgList = response.data.data;
                        var currentOrg = _.find(orgList, {id: $stateParams.accountId});
                        $rootScope.privateSpaceId = currentOrg != null ? currentOrg.predefinedSpaces.privateSpace : null;
                    });
                SpaceService.getTotalSpaceCountAccessLevel("Shared")
                    .then(function (response) {
                        $scope.spaceCount = response.data.data.spaceCount;
                    });
                SpaceService.getUpdateById()
                    .then(function (response) {
                        LoggerService.log(response);
                    });

                var userId = UserContextService.getCurrentUserId();

                $scope.spaceGroupByTag = {};
                SpaceService.getSpaceElements($scope.parentSpaceId)
                    .then(function (response) {
                        angular.forEach(response.data.data, function (space) {
                            if (space.tags.length > 0) {
                                angular.forEach(space.tags, function (tag) {
                                    if (!$scope.spaceGroupByTag.hasOwnProperty(tag)) {
                                        $scope.spaceGroupByTag[tag] = [];
                                    }
                                    $scope.spaceGroupByTag[tag].push(space);
                                });
                            } else {
                                if (!$scope.spaceGroupByTag.hasOwnProperty("#UNTAGGED")) {
                                    $scope.spaceGroupByTag["#UNTAGGED"] = [];
                                }
                                $scope.spaceGroupByTag["#UNTAGGED"].push(space);
                            }
                        });
                        $scope.$broadcast('content.changed');
                    });

                $scope.$watch('scrollPosition', function () {
                    var window = angular.element('#ksw-loader .scrollable .scrollable-content');
                    var innerHeight = window.innerHeight();
                    var scrolledPercentage = ($scope.scrollPosition / innerHeight) * 100;
                    if (scrolledPercentage >= 50 && !$scope.signalLoaderIsBusy) {
                        $scope.loadMoreSignal();
                    }
                });

                $scope.loadMoreSignal();

                $rootScope.currentUserId = userId;
                $scope.signal = {
                    content: '',
                    taggedPeople: [],
                    attachments: [],
                    spaceId: null,
                    activityType: "Composed-DashBoard",
                    object: null,
                    hashTags: []
                };
                $scope.peoplePickerFlag = false;
                $scope.groupCollection = {
                    connType: {}
                };
                $scope.signalOffSet = -10;
                $scope.signals = [];

                $scope.onAttachmentChange = function () {
                    angular.forEach(window.event.target.files, function (attachment) {
                        var fileReader = new FileReader();
                        fileReader.onload = function (fileLoadedEvent) {
                            var attachmentData = fileLoadedEvent.target.result.replace(/^data(.*?),/, '');
                            $scope.signal.attachments.push({
                                name: attachment.name,
                                fileBase64: attachmentData
                            });
                            $scope.$apply();
                        }
                        fileReader.readAsDataURL(attachment);
                        $scope.$apply();
                    });
                };

                $scope.removeAttachment = function (attachment) {
                    var attachmentIndex = $scope.signal.attachments.indexOf(attachment);
                    $scope.signal.attachments.splice(attachmentIndex, 1);
                };

                $scope.showPeoplePicker = function () {
                    if (!$scope.peoplePickerFlag) {
                        SignalService.getConnections().then(function (response) {
                            var connections = response.data;
                            $scope.peoplePickerFlag = true;
                            angular.forEach(connections, function (connection) {
                                var isExists = _.find($scope.signal.taggedPeople, {
                                    id: connection.id
                                });
                                if (isExists) {
                                    connection.isSelected = true;
                                }
                            });

                            angular.forEach(connections, function (entity) {
                                angular.forEach(entity.connTypes, function (type) {
                                    if (!$scope.groupCollection.connType.hasOwnProperty(type)) {
                                        $scope.groupCollection.connType[type] = [];
                                    }
                                    $scope.groupCollection.connType[type].push(entity);
                                });
                            });

                            //$scope.groupCollection["connType"] = _.groupBy(connections, function (m) {
                            //    return m.connType;
                            //});
                            $scope.groupCollection["entityType"] = _.groupBy(connections, function (m) {
                                return m.entityType;
                            });
                            $scope.groupCollection["nameType"] = _.groupBy(connections, function (m) {
                                return m.title.charAt(0);
                            });

                            var group=$scope.selectedPeoplePickerGroup?$scope.selectedPeoplePickerGroup.key:"nameType";
                                $scope.selectedGroup = $scope.groupCollection[group];
                        });
                    } else {
                        $scope.peoplePickerFlag = !$scope.peoplePickerFlag;
                    }
                };

                $scope.hidePeoplePicker = function () {
                    if ($scope.peoplePickerFlag) {
                        $scope.peoplePickerFlag = false;
                    }
                }

                $scope.showBottomPart = function () {
                    if ($scope.peoplePickerFlag) {
                        $scope.peoplePickerFlag = false;
                    }
                }

                $scope.toggleSelectPeople = function (person) {
                    person.isSelected = !person.isSelected;
                    var isExists = _.find($scope.signal.taggedPeople, {
                        id: person.id
                    });
                    if (!isExists) {
                        $scope.signal.taggedPeople.push(person);
                    } else {
                        $scope.signal.taggedPeople.splice($scope.signal.taggedPeople.indexOf(isExists), 1);
                    }
                }

                $scope.findPeople = function (peopleSearchText) {

                }

                $scope.updatePeoplePickerResults = function (selectedPeoplePickerGroup) {
                    if (selectedPeoplePickerGroup) {
                        $scope.selectedGroup = $scope.groupCollection[selectedPeoplePickerGroup.key];
                    }
                }

                $scope.postSignal = function (signal) {
                    signal.attachmentUrl = [];
                    if (!signal.attachments.length) {
                        SignalService.saveSignal(signal)
                            .then(function (response) {

                                var signal = response.data;
                                LoggerService.log(signal);
                                var newSignal = {
                                    doc: signal.data,
                                    newComment: {
                                        attachments: [],
                                        taggedPeople: [],
                                        message: ''
                                    },
                                    comments: []
                                }

                                $scope.signals.unshift(newSignal);

                                $scope.signal = {
                                    content: '',
                                    taggedPeople: [],
                                    attachments: [],
                                    attachmentUrl: [],
                                    hashTags: []
                                };

                            });
                    } else {
                        angular.forEach(signal.attachments, function (attachment) {
                            SignalService.attachNewFileMobile(attachment).then(function (response) {
                                // signal.attachmentUrl.push(response.headers('Url'));
                                signal.attachmentUrl.push(response.data.url);
                                if (signal.attachmentUrl.length == signal.attachments.length) {
                                    SignalService.saveSignal(signal).then(function (response) {
                                        var signal = response.data;
                                        var newSignal = {
                                            doc: signal.data,
                                            newComment: {
                                                attachments: [],
                                                taggedPeople: [],
                                                message: ''
                                            },
                                            comments: []
                                        }
                                        $scope.signals.unshift(newSignal);
                                        $scope.signal = {
                                            content: '',
                                            taggedPeople: [],
                                            attachments: [],
                                            attachmentUrl: [],
                                            hashTags: []
                                        };
                                    });
                                }
                            });
                        });
                    }
                }
                $scope.saveDisLike = function (signal) {
                    SignalService.saveFeedback('n', signal._id)
                        .then(function (response) {
                            var data = response.data;
                            if (data.code) {
                                signal.fbYes = data.data.fbYes;
                                signal.fbNo = data.data.fbNo;
                            }
                        });
                }

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
                            signal.newComment.attachments.push({
                                name: attachment.name,
                                fileBase64: attachmentData
                            });
                            $scope.$apply();
                        }
                        fileReader.readAsDataURL(attachment);
                    });
                }

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
                }

                $scope.removeNewCommentAttachment = function (attachment, signal) {
                    signal.newComment.attachments.splice(signal.newComment.attachments.indexOf(attachment), 1);
                }

                $scope.removeNewCommentTaggedPeople = function (personId, signal) {
                    signal.newComment.taggedPeople.splice(signal.newComment.taggedPeople.indexOf(personId), 1);
                }

                $scope.showMiniPeoplePickerInComment = function ($event, newComment) {
                    if (newComment.message.substr($event.currentTarget.selectionStart - 1, $event.currentTarget.selectionStart) == '') {
                        newComment.caretPosition = $event.currentTarget.selectionStart;
                        newComment.showMiniPeoplePicker = true;
                        SignalService.getConnections().then(function (response) {
                            var connections = response.data;
                            newComment.people = connections;
                        });
                    }
                }

                angular.element(document).click(function (e) {
                    var container = angular.element(".people-picker, .mini-people-picker-container");
                    if (container.has(e.target).length === 0) {
                        container.hide();
                    }
                });
            }]);
})();