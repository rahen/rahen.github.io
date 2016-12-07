"use strict";
(function(){
    angular.module("app")
        .directive("kswAttachmentViewer",function(){
            return{
                restrict: 'A',
                replace: true,
                scope:{
                    attachments:'='
                },
                templateUrl: "views/directives/kswComposeSignal.html",
                link: function(scope, element, attrs){

                }
            };
        });
})();