"use strict";
(function () {
    angular.module("app")
        .factory("SpaceService", ["ApiService", "UserContextService", "LoggerService",
            function (ApiService, UserContextService, LoggerService) {

                var getTotalSpaceCountAccessLevel = function (accessLevel) {
                    var currentlySignedAs = UserContextService.getCurrentlySignedAsAccount();
                    var data = {
                        orgId: currentlySignedAs.isPersonalAccount == true ? null : currentlySignedAs.accountInfo.id,
                        accessLevel: accessLevel || "Shared",
                        accessToken: UserContextService.getAccessToken()
                    };
                    if (currentlySignedAs.isPersonalAccount) {
                        return ApiService.post("/api/spaces/getTotalSpaceCountForPersonalByAccessLevel", data);
                    }
                    return ApiService.post("/api/spaces/getTotalSpaceCountForOrganizationByAccessLevel", data);
                };
                var getSpaceElements = function (parentSpaceId) {
                    var currentlySignedAs = UserContextService.getCurrentlySignedAsAccount();
                    var data = {
                        parentSpaceId: parentSpaceId,
                        orgId: currentlySignedAs.isPersonalAccount == true ? null : currentlySignedAs.accountInfo.id,
                        accessToken: UserContextService.getAccessToken()
                    };
                    return ApiService.post("/api/spaces/getSpaceElements", data);
                }
                var getSpaceById = function (spaceId) {
                    var currentlySignedAs = UserContextService.getCurrentlySignedAsAccount();
                    var data = {
                        id: spaceId,
                        selectedOrgId: currentlySignedAs.isPersonalAccount == true ? null : currentlySignedAs.accountInfo.id,
                        accessToken: UserContextService.getAccessToken()
                    };
                    return ApiService.post("/api/spaces/getSpaceById", data);
                };
                var getSpaceAscendantsBySpaceId = function (spaceId) {
                    var data = {
                        spaceId: spaceId,
                        accessToken: UserContextService.getAccessToken()
                    };
                    return ApiService.post("/api/graph/getSpaceAscendantsBySpaceId", data);
                };
                var getRelatedNeighboursWithRelation = function (spaceId) {
                    var data = {
                        dbId: spaceId,
                        accessToken: UserContextService.getAccessToken()
                    };
                    return ApiService.post("/api/graph/getRelatedNeighboursWithRelation", data);
                };
                var getUpdateById = function (spaceId, offset) {
                    var currentlySignedAs = UserContextService.getCurrentlySignedAsAccount();
                    var data = {
                        spaceId: spaceId,
                        orgId: currentlySignedAs.isPersonalAccount == true ? null : currentlySignedAs.accountInfo.id,
                        offset: offset,
                        count: 10,
                        destination: "Space",
                        accessToken: UserContextService.getAccessToken()
                    };
                    return ApiService.post("/api/spaces/getUpdateById", data);
                };
                var getSpaceAttributes = function (spaceId) {
                    var data = {
                        spaceId: spaceId,
                        accessToken: UserContextService.getAccessToken()
                    };
                    return ApiService.post("/api/spaces/getSpaceAttributes", data);
                };
                var getFrequentAndRecentRecordAccess = function () {
                    var currentlySignedAs = UserContextService.getCurrentlySignedAsAccount();
                    var data = {
                        accessToken: UserContextService.getAccessToken(),
                        selectedOrgId: currentlySignedAs.isPersonalAccount == true ? null : currentlySignedAs.accountInfo.id
                    };
                    return ApiService.post("/api/account/getFrequentAndRecentRecordAccess", data);
                }
                var updateSpace = function (space) {
                    var data = {
                        spaceId: space._id,
                        title: space.spaceName,
                        contents: space.docContents,
                        fileUrl: space.fileUrl,
                        imgSrc: space.imgSrc,
                        entityType: space.entityType,
                        accessToken: UserContextService.getAccessToken()
                    };
                    LoggerService.log(data);
                    return ApiService.post("/api/spaces/update", data);
                };
                var saveFileToSpace = function (data) {
                    var currentlySignedAs = UserContextService.getCurrentlySignedAsAccount();
                    var data = {
                        spaceId: data.spaceId,
                        orgId: currentlySignedAs.isPersonalAccount == true ? null : currentlySignedAs.accountInfo.id,
                        fileUrl: data.fileUrl,
                        accessLevel: "Shared",
                        title: data.title,
                        tags: data.tags,
                        fileExtension: data.fileExtension,
                        accessToken: UserContextService.getAccessToken()
                    };
                    return ApiService.post("/api/spaces/saveFileToSpace", data);
                };
                var ogData = function (url) {
                    var data = {
                        accessToken: UserContextService.getAccessToken(),
                        url: url
                    };
                    return ApiService.post("/api/service/linkService/ogData", data);
                };
                var create = function (space) {
                    var currentlySignedAs = UserContextService.getCurrentlySignedAsAccount();
                    var currentUserData = UserContextService.getCurrentUserData();
                    var data = {
                        parentId: space.parentId,
                        orgId: currentlySignedAs.isPersonalAccount == true ? null : currentlySignedAs.accountInfo.id,
                        accessLevel: "Shared",
                        title: space.title,
                        spaceName: space.spaceName,
                        docContents: space.docContents || "",
                        imgSrc: "api/defaultImages/image/defaultDoc.png",
                        entityType: space.entityType,
                        tags: space.tags,
                        attributes: [],
                        relations: [],
                        orgDomain: currentUserData.orgDomain,
                        userData: currentUserData,
                        accessToken: UserContextService.getAccessToken()
                    };
                    return ApiService.post("/api/spaces/Create", data);
                };
                var addTag = function (spaceId, tags) {
                    var data = {
                        spaceId: spaceId,
                        tag: _.pluck(tags, 'text'),
                        accessToken: UserContextService.getAccessToken()
                    };
                    return ApiService.post("/api/spaces/addTag", data);
                };
                var deleteTag = function (spaceId, tag) {
                    var data = {
                        spaceId: spaceId,
                        tag: tag,
                        accessToken: UserContextService.getAccessToken()
                    };
                    return ApiService.post("/api/spaces/deleteTag", data);
                };
                var getSuggestedHashTags = function () {
                    var currentlySignedAs = UserContextService.getCurrentlySignedAsAccount();
                    var data = {
                        accessToken: UserContextService.getAccessToken(),
                        orgId: currentlySignedAs.isPersonalAccount == true ? null : currentlySignedAs.accountInfo.id
                    };
                    return ApiService.post("/api/tag/getSuggestedHashTags", data);
                };
                var addSpaceAttributes = function (attribute) {
                    //var data = {
                    //    spaceId: attribute.spaceId,
                    //    accessToken: UserContextService.getAccessToken(),
                    //    attribute: {
                    //        name: attribute.name,
                    //        type: attribute.type.key,
                    //        value: attribute.type.key == 'date' ? new Date("" + attribute.value + "").toISOString() : attribute.value,
                    //        graphType: null
                    //    }
                    //};

                    var attributeCopy = angular.copy(attribute);

                    switch (attribute.type.key){
                        case 'date':
                            attributeCopy.value = new Date("" + attribute.value + "").toISOString();
                            break;
                        case 'user':
                            attributeCopy.value = _.pluck(attribute.value, 'id');
                    }

                    var currentlySignedAs = UserContextService.getCurrentlySignedAsAccount();
                    var data = {
                        spaceId: attributeCopy.spaceId,
                        tags: attributeCopy.tags,
                        orgId: currentlySignedAs.isPersonalAccount == true ? null : currentlySignedAs.accountInfo.id,
                        attribute: {
                            attributeValues: [],
                            badgeRuleImageUrl: null,
                            badgeRuleTitle: "",
                            isDisableBadgeRule: true,
                            title: "",
                            ruleTitle: "",
                            ruleCount: "",
                            addRuleVisibilityClass: "",
                            attributeEditTemplate: "",
                            attributeRuleEditvisibilityClass: "",
                            approvalNotificationBellVisibilityClass: "icon-attribute-notification invisible",
                            hasAutoNominateAwardRule: "0",
                            notificationIconPath: "#",
                            hasApprovalRule: "0",
                            hasApproved: "0",
                            editInProgress: false,
                            hasOneLevelRule: false,
                            isEditMode: false,
                            name: attributeCopy.name,
                            type: attributeCopy.type.key,
                            value: attributeCopy.value
                        },
                        accessToken: UserContextService.getAccessToken()
                    };

                    return ApiService.post("/api/spaces/addSpaceAttributes", data);
                };
                var getSpaceAttributes = function (spaceId) {
                    var data = {
                        spaceId: spaceId,
                        accessToken: UserContextService.getAccessToken()
                    };
                    return ApiService.post("/api/spaces/getSpaceAttributes", data);
                }
                var updateSpaceAttribute = function (attribute) {
                    var currentlySignedAs = UserContextService.getCurrentlySignedAsAccount();
                    var data = {
                        spaceId: attribute.spaceId,
                        orgId: currentlySignedAs.isPersonalAccount == true ? null : currentlySignedAs.accountInfo.id,
                        attributeId: attribute.id,
                        modifiedValue: attribute.type == 'date' ? new Date(attribute.value).toISOString() : attribute.value,
                        customMessage: "",
                        accessToken: UserContextService.getAccessToken()
                    };
                    return ApiService.post("/api/spaces/updateSpaceAttribute", data);
                };
                var getAllRules = function () {
                    var data = {
                        accessToken: UserContextService.getAccessToken()
                    };
                    return ApiService.post("/api/getAllRules", data);
                };
                var removeSpaceAttributes = function (attribute) {
                    var data = {
                        accessToken: UserContextService.getAccessToken(),
                        entityId: attribute.spaceId,
                        attributeId: attribute.id
                    };
                    return ApiService.post("/api/spaces/removeSpaceAttributes", data);
                };
                var setRulesForAttributeId = function (rule, inputSetValues, space, attribute) {
                    var data = {
                        accessToken: UserContextService.getAccessToken(),
                        rule: {
                            ruleId: rule._id,
                            entityType: space.entityType,
                            entityId: space._id,
                            attributeId: attribute.id,
                            inputSetValues: inputSetValues
                        }
                    };
                    return ApiService.post("/api/setRulesForAttributeId", data);
                };
                var copySpaceAttribute = function (attribute) {
                    var data = {
                        spaceId: attribute.spaceId,
                        accessToken: UserContextService.getAccessToken(),
                        attributeInfo: {
                            name: "Copy of " + attribute.name,
                            type: attribute.type,
                            value: attribute.value,
                            graphType: null,
                            masterAttributeId: attribute.id
                        }
                    };
                    return ApiService.post("/api/spaces/copySpaceAttribute", data);
                };
                var getUserOrganizationsWithNotificationCount = function () {
                    var data = {
                        accessToken: UserContextService.getAccessToken()
                    };
                    return ApiService.post("/api/user/getUserOrganizationsWithNotificationCount", data);
                };

                return {
                    getTotalSpaceCountAccessLevel: getTotalSpaceCountAccessLevel,
                    getUpdateById: getUpdateById,
                    getSpaceElements: getSpaceElements,
                    getSpaceById: getSpaceById,
                    getSpaceAscendantsBySpaceId: getSpaceAscendantsBySpaceId,
                    getRelatedNeighboursWithRelation: getRelatedNeighboursWithRelation,
                    getSpaceAttributes: getSpaceAttributes,
                    getFrequentAndRecentRecordAccess: getFrequentAndRecentRecordAccess,
                    updateSpace: updateSpace,
                    saveFileToSpace: saveFileToSpace,
                    ogData: ogData,
                    create: create,
                    addTag: addTag,
                    deleteTag: deleteTag,
                    getSuggestedHashTags: getSuggestedHashTags,
                    addSpaceAttributes: addSpaceAttributes,
                    updateSpaceAttribute: updateSpaceAttribute,
                    getAllRules: getAllRules,
                    removeSpaceAttributes: removeSpaceAttributes,
                    copySpaceAttribute: copySpaceAttribute,
                    setRulesForAttributeId: setRulesForAttributeId,
                    getUserOrganizationsWithNotificationCount: getUserOrganizationsWithNotificationCount
                };
            }])
})();