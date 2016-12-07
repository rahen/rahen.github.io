"use strict";
(function () {
    angular.module("app")
        .service("ToasterService", ["$mdToast", function ($mdToast) {
            this.successToaster = function(response) {
                $mdToast.show({                                   
                  controller: 'ToastCtrl',    
                  templateUrl: 'views/ui/toaster/toast.success.html',
                  locals: { 'toasterSuccess': response },
                  position: "top right",
                  hideDelay: 6000                                  
                });               
            }
            
        }]);
})();