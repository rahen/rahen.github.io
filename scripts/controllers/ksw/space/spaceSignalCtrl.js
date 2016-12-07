"use strict";
(function () {
    angular.module("app")
        .controller("spaceSignalCtrl", ["$scope", "UserContextService", "SpaceService", "LoggerService", "$stateParams", "SignalService",
            function ($scope, UserContextService, SpaceService, LoggerService, $stateParams, SignalService) {
                if (!$stateParams.spaceId) {
                    $scope.spaceId = $stateParams.parentSpaceId
                } else {
                    $scope.spaceId = $stateParams.spaceId;
                }
                var spaceId = $stateParams.spaceId;
                $scope.signals = [];
                $scope.space = {};
                var userId = UserContextService.getCurrentUserId();
                $scope.currentUserId = userId;
                $scope.offSet = -10;

                $scope.loadMoreSignal = function(){
                    $scope.offSet += 10;
                    SpaceService.getUpdateById($scope.spaceId, $scope.offSet)
                        .then(function (response) {
                            var signalData = response.data.data;
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
                        });
                }

                SpaceService.getSpaceById($scope.spaceId)
                    .then(function (response) {
                        $scope.space = response.data.data;
                        if($scope.space.entityType !='Space'){
                            $scope.space.entityType = 'Space-' + $scope.space.entityType;
                        }
                        $scope.signal = {
                            content: '',
                            taggedPeople: [],
                            attachments: [],
                            spaceId: $scope.space._id,
                            activityType: "Composed-" + $scope.space.entityType,
                            object: {id: $scope.space._id}
                        };
                    });

                $scope.peoplePickerFlag = false;

                $scope.groupCollection = {};

                $scope.signalOffSet = -10;

                $scope.signals = [];

                UserContextService.getProfileById(userId).then(function (response) {
                    var data = response.data;
                    $scope.currentUserId = data.connData._id;
                    $scope.myName = data.connData.firstName + " " + data.connData.lastName;
                    $scope.myEmail = data.connData.email;
                });

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
                }

                $scope.showPeoplePicker = function () {
                    if (!$scope.peoplePickerFlag) {
                        SignalService.getConnections().then(function (response) {
                            var connections = response.data;
                            $scope.peoplePickerFlag = true;
                            angular.forEach(connections, function (connection) {
                                var isExists = _.find($scope.signal.taggedPeople, {id: connection.id});
                                if (isExists) {
                                    connection.isSelected = true;
                                }
                            });

                            $scope.groupCollection["connType"] = _.groupBy(connections, function (m) {
                                return m.connType;
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
                    var isExists = _.find($scope.signal.taggedPeople, {id: person.id});
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
                                    attachmentUrl: []
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
                                            attachmentUrl: []
                                        };
                                    });
                                }
                            });
                        });
                    }
                }

                $scope.removeNewCommentTaggedPeople = function (personId, signal) {
                    signal.newComment.taggedPeople.splice(signal.newComment.taggedPeople.indexOf(personId), 1);
                }

                angular.element(document).click(function (e) {
                    var container = angular.element(".people-picker, .mini-people-picker-container");
                    if (container.has(e.target).length === 0) {
                        container.hide();
                    }
                });

            }]);
})();