"use strict";
(function(){
    angular.module("app")
        .factory("ForgotPasswordService",["ApiService",function(ApiService){
            var recover = function(email){
               var data = {
                   email:email,
                   clientURI:""
               };
                return ApiService.post("/api/requestToResetPassword",data);
            }
            return{
                recover:recover
            }
        }]);
})();