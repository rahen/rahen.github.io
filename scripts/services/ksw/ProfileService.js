"use strict";
(function () {
    angular.module("app")
        .factory("ProfileService",
        ["ApiService","UserContextService","PublicService", "LoggerService", 
        function (ApiService,UserContextService,PublicService, LoggerService) {


        //http://prod-cdn.herokuapp.com/saveUserProfilePicture
        //https://prod-frontserver.herokuapp.com/personalHub/removeProfilePicture
        //https://prod-frontserver.herokuapp.com/api/entities/getPredefinedAttributeListByEntityId
        //https://prod-frontserver.herokuapp.com/api/entities/getAttributeListByEntityId
        //var postUrl = (loadedAttribute.isPredefined) ? 'api/entities/editPredefinedAttribute' : 'api/entities/editCustomAttribute';
        //https://prod-frontserver.herokuapp.com/api/entities/editEntityName
        //request={accessToken:'',entityId:'',entityType:'Person',firstName:'',lastName:''}
        //response={"code":1,"data":{"newTitle":"Brian Tobey","firstName":"Brian","lastName":"Tobey"},"message":"Edit Success : Brian Tobey"}
        //https://prod-frontserver.herokuapp.com/api/entities/editPredefinedAttribute
        ////request={entityId:'',entityType:'Person',attributeId:'',attributeValue:''}
        //response={"code":"1","message":"OK"}
        //https://prod-frontserver.herokuapp.com/api/public/profile/Organization/544b1986529171020000003a
        // https://prod-frontserver.herokuapp.com/api/public/profile/Person/544b11bf5291710200000030
        //var currentlySignedAs = UserContextService.getCurrentlySignedAsAccount();
        //var currentUserData = UserContextService.getCurrentUserData();
        //var orgId =currentlySignedAs.isPersonalAccount == true ? null : currentlySignedAs.accountInfo.id;

        
            var credentials={
                    entityId:   UserContextService.getPersonalAccountInfo().accountId,
                    entityType: 'Person', 
                    accessToken: UserContextService.getAccessToken()
            }

            var saveUserProfilePicture = function (attachment) {
                var data = {
                    filename:       attachment.name,
                    fileBase64:     attachment.fileBase64,
                    accessToken:    credentials.accessToken
                }
              //return ApiService.post("/saveUserProfilePicture", data);
                return ApiService.postWithHeader('/saveUserProfilePicture', data, ApiService.fileCdnServer);
            }
            
            
            var removeProfilePicture = function(orgId,accountId){
                var data = {
                    accessToken:    credentials.accessToken,
                    id:             accountId||credentials.entityId,
                    selectedOrgId:  orgId
                };
                return ApiService.post("/personalHub/removeProfilePicture", data);
            }
            
            
           var getPredefinedAttributeListByEntityId = function(entityId,entityType){
                var data = {
                    entityId: entityId||credentials.entityId,
                    entityType: entityType||credentials.entityType,
                    accessToken: credentials.accessToken
                };
                return ApiService.post("/api/entities/getPredefinedAttributeListByEntityId", data);
            }
            
            var getAttributeListByEntityId = function(entityId,entityType){
                var data = {
                    entityId: entityId||credentials.entityId,
                    entityType: entityType||credentials.entityType,
                    accessToken: credentials.accessToken
                };
                return ApiService.post("/api/entities/getAttributeListByEntityId", data);
            }
            

            var editEntityName = function(data){
                    //data={firstName:'',lastName:''}
                 data=angular.extend({},credentials,data||{});
                return ApiService.post("/api/entities/editEntityName", data);
            }
            
            var editPredefinedAttribute = function(data){
                data.isPredefined=true;
                return editAttribute(data);
            }
            
            var editAttribute = function(data,remove){
                   data = {
                        entityId: credentials.entityId,
                        entityType: credentials.entityType,
                        attributeId: data._id,
                        attributeValue: data.value,
                        isPredefined: data.isPredefined
                   };
                var method=(data.isPredefined?'editPredefinedAttribute':'editCustomAttribute');
                if(remove) {
                    method='deleteAttribute';
                }
                var url = '/api/entities/'+ method;
                return ApiService.post(url, data);
            }
            
            return {
                getPublicProfile: PublicService.getPublicProfile,
                getPublicProfileBadges: PublicService.getPublicProfileBadges,
                saveUserProfilePicture: saveUserProfilePicture,
                removeProfilePicture: removeProfilePicture,
                getPredefinedAttributeListByEntityId: getPredefinedAttributeListByEntityId,
                getAttributeListByEntityId: getAttributeListByEntityId,
                editEntityName: editEntityName,
                editAttribute: editAttribute,
                editPredefinedAttribute: editPredefinedAttribute
            };
        }]);
})(app);