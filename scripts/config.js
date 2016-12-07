// config

var app =  
angular.module('app')
  .config(
    [        '$controllerProvider', '$compileProvider', '$filterProvider', '$provide',
    function ($controllerProvider,   $compileProvider,   $filterProvider,   $provide) {
        
        // lazy controller, directive and service
        app.controller = $controllerProvider.register;
        app.directive  = $compileProvider.directive;
        app.filter     = $filterProvider.register;
        app.factory    = $provide.factory;
        app.service    = $provide.service;
        app.constant   = $provide.constant;
        app.value      = $provide.value;
    }
  ])
    .run(["UserContextService","$rootScope","EventService","$state",function(UserContextService, $rootScope, EventService,$state){
        $rootScope.$on("$stateChangeError", function(event, current) {
            $state.go("access.signin");
        });
        if(UserContextService.isLoggedIn()){
            $rootScope.isLoggedIn = UserContextService.isLoggedIn();
            UserContextService.saveCurrentUserData(UserContextService.getPersonalAccountInfo().currentUserData);
            setTimeout(function(){
                EventService.trigger('signedIn');
                EventService.trigger('updateProfilePicture', UserContextService.getPersonalAccountInfo().currentUserData);
            },400);
        }
    }])
  .config(['$translateProvider', function($translateProvider){
    // Register a loader for the static files
    // So, the module will search missing translation tables under the specified urls.
    // Those urls are [prefix][langKey][suffix].
    $translateProvider.useStaticFilesLoader({
      prefix: 'i18n/',
      suffix: '.js'
    });
    // Tell the module what language to use by default
    $translateProvider.preferredLanguage('en');
    // Tell the module to store the language in the local storage
    $translateProvider.useLocalStorage();
  }]);
