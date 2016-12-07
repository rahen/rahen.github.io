'use strict';

/**
 * @ngdoc function
 * @name app.config:uiRouter
 * @description
 * # Config
 * Config for the router
 */


// angular.module('app').run(function ($browser) {
//     $browser.baseHref = function () { return "/" };
// });
//How to access angularjs root scope from chrome extension
//$rootScope = angular.element($0).injector().get('$rootScope');
//$(document.body).scope().$root
//$($0).scope()
//angular.reloadWithDebugInfo()
// var injector = $(document.body).injector();
// var someService = injector.get(‘someService’);
  
angular.module('app')
    .run(
        ['$rootScope', '$state', '$stateParams', '$log', '$window', '$location',
            function ($rootScope, $state, $stateParams, $log, $window, $location) {
                
                $rootScope.$state = $state;
                $rootScope.$stateParams = $stateParams;

                $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
                    $rootScope.state = toState;
                    $rootScope.klass = toState.url.replace(/[\-\/]/,'-');
                });

                $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
                    //console.log($rootScope.state.data,$rootScope.$state.current.data);
                    //$window.document.title=$rootScope.state.data.title;
                });


            }
        ]
        )
    .config(
        ['$locationProvider', '$stateProvider', '$urlRouterProvider', 'MODULE_CONFIG',
            function ($locationProvider, $stateProvider, $urlRouterProvider, MODULE_CONFIG) {

                var authCheck = {
                    auth: function ($q, UserContextService) {
                        var defer = $q.defer();
                        if (!UserContextService.isLoggedIn()) {
                            defer.reject();
                        } else {
                            defer.resolve();
                        }
                        return defer.promise;
                    }
                };
                $urlRouterProvider
                    .otherwise('/access/signin');
                $stateProvider
                    .state('app', {
                        abstract: true,
                        url: '/app',
                        views: {
                            '': {
                                templateUrl: 'views/layout.html'
                            },
                            'aside': {
                                templateUrl: 'views/aside.html',
                                controller: 'currentAccountCtrl as CAC'
                            },
                            'content': {
                                templateUrl: 'views/dashboard-content.html'
                            }
                        }
                    })
                    .state('app.dashboard', {
                        url: '/dashboard',
                        templateUrl: 'views/pages/dashboard.html',
                        data: { title: 'Dashboard' },
                        resolve: load(['scripts/controllers/chart.js', 'scripts/controllers/vectormap.js'])
                    })
                    .state('app.accounts', {
                        url: '/accounts/:accountId',
                        templateUrl: 'views/pages/dashboard.wall.html',
                        data: { title: 'Dashboard', folded: false },
                        controller: 'accountCtrl',
                        resolve: authCheck
                    })
                    .state('app.todo', {
                        url: '/todo',
                        templateUrl: 'apps/todo/todo.html',
                        data: { title: 'Todo', theme: { primary: 'indigo-800' } },
                        controller: 'TodoCtrl',
                        resolve: load('apps/todo/todo.js')
                    })
                    .state('app.todo.list', {
                        url: '/{fold}'
                    })
                    .state('app.note', {
                        url: '/note',
                        templateUrl: 'apps/note/main.html',
                        data: { theme: { primary: 'blue-grey' } }
                    })
                    .state('app.note.list', {
                        url: '/list',
                        templateUrl: 'apps/note/list.html',
                        data: { title: 'Note' },
                        controller: 'NoteCtrl',
                        resolve: load(['apps/note/note.js', 'moment'])
                    })
                    .state('app.note.item', {
                        url: '/{id}',
                        views: {
                            '': {
                                templateUrl: 'apps/note/item.html',
                                controller: 'NoteItemCtrl',
                                resolve: load(['apps/note/note.js', 'moment'])
                            },
                            'navbar@': {
                                templateUrl: 'apps/note/navbar.html',
                                controller: 'NoteItemCtrl'
                            }
                        },
                        data: { title: '', child: true }
                    })
                    .state('ui', {
                        url: '/ui',
                        abstract: true,
                        views: {
                            '': {
                                templateUrl: 'views/layout.html'
                            },
                            'aside': {
                                templateUrl: 'views/aside.html'
                            },
                            'content': {
                                templateUrl: 'views/content.html'
                            }
                        }
                    })
                // components router
                    .state('ui.component', {
                        url: '/component',
                        abstract: true,
                        template: '<div ui-view></div>'
                    })
                    .state('ui.component.arrow', {
                        url: '/arrow',
                        templateUrl: 'views/ui/component/arrow.html',
                        data: { title: 'Arrows' }
                    })
                    .state('ui.component.badge-label', {
                        url: '/badge-label',
                        templateUrl: 'views/ui/component/badge-label.html',
                        data: { title: 'Badges & Labels' }
                    })
                    .state('ui.component.button', {
                        url: '/button',
                        templateUrl: 'views/ui/component/button.html',
                        data: { title: 'Buttons' }
                    })
                    .state('ui.component.color', {
                        url: '/color',
                        templateUrl: 'views/ui/component/color.html',
                        data: { title: 'Colors' }
                    })
                    .state('ui.component.grid', {
                        url: '/grid',
                        templateUrl: 'views/ui/component/grid.html',
                        data: { title: 'Grids' }
                    })
                    .state('ui.component.icon', {
                        url: '/icons',
                        templateUrl: 'views/ui/component/icon.html',
                        data: { title: 'Icons' }
                    })
                    .state('ui.component.list', {
                        url: '/list',
                        templateUrl: 'views/ui/component/list.html',
                        data: { title: 'Lists' }
                    })
                    .state('ui.component.nav', {
                        url: '/nav',
                        templateUrl: 'views/ui/component/nav.html',
                        data: { title: 'Navs' }
                    })
                    .state('ui.component.progressbar', {
                        url: '/progressbar',
                        templateUrl: 'views/ui/component/progressbar.html',
                        data: { title: 'Progressbars' }
                    })
                    .state('ui.component.streamline', {
                        url: '/streamline',
                        templateUrl: 'views/ui/component/streamline.html',
                        data: { title: 'Streamlines' }
                    })
                    .state('ui.component.timeline', {
                        url: '/timeline',
                        templateUrl: 'views/ui/component/timeline.html',
                        data: { title: 'Timelines' }
                    })
                    .state('ui.component.uibootstrap', {
                        url: '/uibootstrap',
                        templateUrl: 'views/ui/component/uibootstrap.html',
                        resolve: load('scripts/controllers/bootstrap.js'),
                        data: { title: 'UI Bootstrap' }
                    })
                // material routers
                    .state('ui.material', {
                        url: '/material',
                        template: '<div ui-view></div>',
                        resolve: load('scripts/controllers/material.js')
                    })
                    .state('ui.material.button', {
                        url: '/button',
                        templateUrl: 'views/ui/material/button.html',
                        data: { title: 'Buttons' }
                    })
                    .state('ui.material.color', {
                        url: '/color',
                        templateUrl: 'views/ui/material/color.html',
                        data: { title: 'Colors' }
                    })
                    .state('ui.material.icon', {
                        url: '/icon',
                        templateUrl: 'views/ui/material/icon.html',
                        data: { title: 'Icons' }
                    })
                    .state('ui.material.card', {
                        url: '/card',
                        templateUrl: 'views/ui/material/card.html',
                        data: { title: 'Card' }
                    })
                    .state('ui.material.form', {
                        url: '/form',
                        templateUrl: 'views/ui/material/form.html',
                        data: { title: 'Form' }
                    })
                    .state('ui.material.list', {
                        url: '/list',
                        templateUrl: 'views/ui/material/list.html',
                        data: { title: 'List' }
                    })
                    .state('ui.material.ngmaterial', {
                        url: '/ngmaterial',
                        templateUrl: 'views/ui/material/ngmaterial.html',
                        data: { title: 'NG Material' }
                    })
                // form routers
                    .state('ui.form', {
                        url: '/form',
                        template: '<div ui-view></div>'
                    })
                    .state('ui.form.layout', {
                        url: '/layout',
                        templateUrl: 'views/ui/form/layout.html',
                        data: { title: 'Layouts' }
                    })
                    .state('ui.form.element', {
                        url: '/element',
                        templateUrl: 'views/ui/form/element.html',
                        data: { title: 'Elements' }
                    })
                    .state('ui.form.validation', {
                        url: '/validation',
                        templateUrl: 'views/ui/form/validation.html',
                        data: { title: 'Validations' }
                    })
                    .state('ui.form.select', {
                        url: '/select',
                        templateUrl: 'views/ui/form/select.html',
                        data: { title: 'Selects' },
                        controller: 'SelectCtrl',
                        resolve: load('scripts/controllers/select.js')
                    })
                    .state('ui.form.editor', {
                        url: '/editor',
                        templateUrl: 'views/ui/form/editor.html',
                        data: { title: 'Editor' },
                        controller: 'EditorCtrl',
                        resolve: load('scripts/controllers/editor.js')
                    })
                    .state('ui.form.slider', {
                        url: '/slider',
                        templateUrl: 'views/ui/form/slider.html',
                        data: { title: 'Slider' },
                        controller: 'SliderCtrl',
                        resolve: load('scripts/controllers/slider.js')
                    })
                    .state('ui.form.tree', {
                        url: '/tree',
                        templateUrl: 'views/ui/form/tree.html',
                        data: { title: 'Tree' },
                        controller: 'TreeCtrl',
                        resolve: load('scripts/controllers/tree.js')
                    })
                    .state('ui.form.file-upload', {
                        url: '/file-upload',
                        templateUrl: 'views/ui/form/file-upload.html',
                        data: { title: 'File upload' },
                        controller: 'UploadCtrl',
                        resolve: load(['angularFileUpload', 'scripts/controllers/upload.js'])
                    })
                    .state('ui.form.image-crop', {
                        url: '/image-crop',
                        templateUrl: 'views/ui/form/image-crop.html',
                        data: { title: 'Image Crop' },
                        controller: 'ImgCropCtrl',
                        resolve: load(['ngImgCrop', 'scripts/controllers/imgcrop.js'])
                    })
                    .state('ui.form.editable', {
                        url: '/editable',
                        templateUrl: 'views/ui/form/xeditable.html',
                        data: { title: 'Xeditable' },
                        controller: 'XeditableCtrl',
                        resolve: load(['xeditable', 'scripts/controllers/xeditable.js'])
                    })
                // table routers
                    .state('ui.table', {
                        url: '/table',
                        template: '<div ui-view></div>'
                    })
                    .state('ui.table.static', {
                        url: '/static',
                        templateUrl: 'views/ui/table/static.html',
                        data: { title: 'Static', theme: { primary: 'blue' } }
                    })
                    .state('ui.table.smart', {
                        url: '/smart',
                        templateUrl: 'views/ui/table/smart.html',
                        data: { title: 'Smart' },
                        controller: 'TableCtrl',
                        resolve: load(['smart-table', 'scripts/controllers/table.js'])
                    })
                    .state('ui.table.datatable', {
                        url: '/datatable',
                        data: { title: 'Datatable' },
                        templateUrl: 'views/ui/table/datatable.html'
                    })
                    .state('ui.table.footable', {
                        url: '/footable',
                        data: { title: 'Footable' },
                        templateUrl: 'views/ui/table/footable.html'
                    })
                    .state('ui.table.nggrid', {
                        url: '/nggrid',
                        templateUrl: 'views/ui/table/nggrid.html',
                        data: { title: 'NG Grid' },
                        controller: 'NGGridCtrl',
                        resolve: load(['ngGrid', 'scripts/controllers/nggrid.js'])
                    })
                    .state('ui.table.uigrid', {
                        url: '/uigrid',
                        templateUrl: 'views/ui/table/uigrid.html',
                        data: { title: 'UI Grid' },
                        controller: "UiGridCtrl",
                        resolve: load(['ui.grid', 'scripts/controllers/uigrid.js'])
                    })
                    .state('ui.table.editable', {
                        url: '/editable',
                        templateUrl: 'views/ui/table/editable.html',
                        data: { title: 'Editable' },
                        controller: 'XeditableCtrl',
                        resolve: load(['xeditable', 'scripts/controllers/xeditable.js'])
                    })
                // chart
                    .state('ui.chart', {
                        url: '/chart',
                        templateUrl: 'views/ui/chart/chart.html',
                        data: { title: 'Charts' },
                        resolve: load('scripts/controllers/chart.js')
                    })
                // map routers
                    // .state('ui.map', {
                    //     url: '/map',
                    //     template: '<div ui-view></div>'
                    // })
                    // .state('ui.map.google', {
                    //     url: '/google',
                    //     templateUrl: 'views/ui/map/google.html',
                    //     data: { title: 'Gmap' },
                    //     controller: 'GoogleMapCtrl',
                    //     resolve: load(['ui.map', 'scripts/controllers/load-google-maps.js', 'scripts/controllers/googlemap.js'], function () {
                    //         return loadGoogleMaps();
                    //     })
                    // })
                    .state('ui.map.vector', {
                        url: '/vector',
                        templateUrl: 'views/ui/map/vector.html',
                        data: { title: 'Vector' },
                        controller: 'VectorMapCtrl',
                        resolve: load('scripts/controllers/vectormap.js')
                    })
                    .state('filter', {
                        url: '/filter',
                        views: {
                            '': {
                                templateUrl: 'views/layout.html'
                            },
                            'aside': {
                                templateUrl: 'views/aside.html',
                                controller: 'currentAccountCtrl'
                            },
                            'content': {
                                templateUrl: 'views/content.html'
                            }
                        },
                        resolve: authCheck
                    })
                    .state('filter.filterByTag', {
                        url: '/filterByTag/:tagName',
                        templateUrl: 'views/pages/kswFilter.html',
                        data: { title: 'FILTER ' },
                        controller: 'kswFilterCtrl'
                    })
                    .state('page', {
                        url: '/page',
                        views: {
                            '': {
                                templateUrl: 'views/layout.html'
                            },
                            'aside': {
                                templateUrl: 'views/aside.html',
                                controller: 'currentAccountCtrl'
                            },
                            'content': {
                                templateUrl: 'views/content.html'
                            }
                        },
                        resolve: authCheck
                    })
                    .state('page.profile', {
                        url: '/profile/:accountId',
                        templateUrl: 'views/pages/profile.html',
                        controller: 'XeditableCtrl',
                        resolve: load(['xeditable','scripts/controllers/xeditable.js']),
                        data: { title: 'Profile' }
                       
                    })
                    .state('page.orgProfile', {
                        url: '/orgProfile/:accountId',
                        templateUrl: 'views/pages/orgProfile.html',
                        data: { title: 'Org Profile' },
                        controller: 'orgProfileCtrl'
                    })
                    .state('page.settings', {
                        url: '/settings',
                        templateUrl: 'views/pages/settings.html',
                        data: { title: 'Settings'}
                    })
                    .state('page.blank', {
                        url: '/blank',
                        templateUrl: 'views/pages/blank.html',
                        data: { title: 'Blank' }
                    })
                    .state('page.document', {
                        url: '/document',
                        templateUrl: 'views/pages/document.html',
                        data: { title: 'Document' }
                    })
                    .state('page.filter', {
                        url: '/filter',
                        templateUrl: 'views/pages/filter.html',
                        data: { title: 'Filter' },
                        controller: 'filterCtrl'
                    })
                    .state('search', {
                        url: '/search',
                        views: {
                            '': {
                                templateUrl: 'views/layout.html'
                            },
                            'aside': {
                                templateUrl: 'views/aside.html',
                                controller: 'currentAccountCtrl'
                            },
                            'content': {
                                templateUrl: 'views/content.html'
                            }
                        }
                    })
                    .state('search.entity', {
                        url: '/entity',
                        templateUrl: 'views/search/searchEntity.html',
                        data: { title: 'Search' },
                        controller: 'searchEntityCtrl'
                    })
                    .state('hashTag', {
                        url: '/hashTag',
                        views: {
                            '': {
                                templateUrl: 'views/layout.html'
                            },
                            'aside': {
                                templateUrl: 'views/aside.html',
                                controller: 'currentAccountCtrl'
                            },
                            'content': {
                                templateUrl: 'views/content.html'
                            }
                        }
                    })
                    .state('hashTag.viewAll', {
                        url: '/viewAll',
                        templateUrl: 'views/hashTag/viewAll.html',
                        data: { title: 'All Hash Tags' },
                        controller: 'viewAllHashTagCtrl'
                    })
                    .state('404', {
                        url: '/404',
                        templateUrl: 'views/pages/404.html'
                    })
                    .state('network', {
                        url: '/network',
                        views: {
                            '': {
                                templateUrl: 'views/layout.html'
                            },
                            'aside': {
                                templateUrl: 'views/aside.html',
                                controller: 'currentAccountCtrl'
                            },
                            'content': {
                                templateUrl: 'views/content.html'
                            }
                        },
                        resolve: authCheck
                    })
                    .state('network.user', {
                        url: '/user/:accountId',
                        templateUrl: 'views/pages/networks.html',
                        data: { title: 'NETWORKS' },
                        controller: 'networksCtrl'
                    })
                    .state('org', {
                        url: '/connection',
                        views: {
                            '': {
                                templateUrl: 'views/layout.html'
                            },
                            'aside': {
                                templateUrl: 'views/aside.html',
                                controller: 'currentAccountCtrl'
                            },
                            'content': {
                                templateUrl: 'views/content.html'
                            }
                        },
                        resolve: authCheck
                    })
                    .state('org.connection', {
                        url: '/org/:accountId',
                        templateUrl: 'views/pages/orgConnection.html',
                        data: { title: 'Connections' },
                        controller: 'orgConnectionCtrl'
                    })
                    .state('award', {
                        url: '/award',
                        views: {
                            '': {
                                templateUrl: 'views/layout.html'
                            },
                            'aside': {
                                templateUrl: 'views/aside.html',
                                controller: 'currentAccountCtrl'
                            },
                            'content': {
                                templateUrl: 'views/content.html'
                            }
                        },
                        resolve: authCheck
                    })
                    .state('award.user', {
                        url: '/user/:accountId',
                        templateUrl: 'views/award/viewAward.html',
                        data: { title: 'AWARDS' },
                        controller: 'userAwardCtrl'
                    })
                    .state('award.all', {
                        url: '/all',
                        templateUrl: 'views/award/allAward.html',
                        data: { title: 'SELECT AWARD' },
                        controller: 'allAwardCtrl'
                    })
                    .state('award.nominate', {
                        url: '/nominate/:awardId',
                        templateUrl: 'views/award/nominateAward.html',
                        data: { title: 'NOMINATE AWARD' },
                        controller: 'nominateAwardCtrl'
                    })
                    .state('award.create', {
                        url: '/createTemplate',
                        templateUrl: 'views/award/createTemplate.html',
                        data: { title: 'CREATE TEMPLATE' },
                        controller: 'createAwardTemplateCtrl'
                    })
                    .state('connection', {
                        url: '/connection',
                        views: {
                            '': {
                                templateUrl: 'views/layout.html'
                            },
                            'aside': {
                                templateUrl: 'views/aside.html',
                                controller: 'currentAccountCtrl'
                            },
                            'content': {
                                templateUrl: 'views/content.html'
                            }
                        },
                        resolve: authCheck
                    })
                    .state('connection.manage', {
                        url: '/manage/:type/:accountId',
                        templateUrl: 'views/connection/manage.html',
                        data: { title: 'CREATE CONNECTION' },
                        controller: 'createConnectionCtrl'
                    })
                    .state('connection.accept', {
                        url: '/accept/:type/:accountId',
                        templateUrl: 'views/connection/accept.html',
                        data: { title: 'CREATE CONNECTION' },
                        controller: 'createConnectionCtrl'
                    })
                    .state('chat', {
                        url: '/chat',
                        views: {
                            '': {
                                templateUrl: 'views/layout.html'
                            },
                            'aside': {
                                templateUrl: 'views/aside.html',
                                controller: 'currentAccountCtrl'
                            },
                            'content': {
                                templateUrl: 'views/content.html'
                            }
                        },
                        resolve: authCheck
                    })
                    .state('chat.sendMessage', {
                        url: '/sendMessage',
                        templateUrl: 'views/chat/sendMessage.html',
                        data: { title: 'CHAT' },
                        controller: 'chatCtrl'
                    })
                    .state('space', {
                        url: '/space',
                        views: {
                            '': {
                                templateUrl: 'views/layout.html'
                            },
                            'aside': {
                                templateUrl: 'views/aside.html',
                                controller: 'currentAccountCtrl'
                            },
                            'content': {
                                templateUrl: 'views/content.html'
                            }
                        },
                        resolve: authCheck
                    })
                    .state('space.viewAll', {
                        url: '/viewAll/:parentSpaceId',
                        templateUrl: 'views/spaces/viewAll.html',
                        data: { title: 'Shared Desk' },
                        controller: 'viewSpaceCtrl'
                    })
                    .state('space.viewWebLink', {
                        url: '/viewWebLink/:spaceId',
                        templateUrl: 'views/spaces/viewWebLink.html',
                        data: { title: 'Link' },
                        controller: 'viewWebLinkCtrl'
                    })
                    .state('space.viewUploaded', {
                        url: '/viewUploaded/:spaceId',
                        templateUrl: 'views/spaces/viewUploaded.html',
                        data: { title: 'Document' },
                        controller: 'viewUploadedCtrl'
                    })
                    .state('space.viewText', {
                        url: '/viewText/:spaceId',
                        templateUrl: 'views/spaces/viewText.html',
                        data: { title: 'Document' },
                        controller: 'viewTextCtrl'
                    })
                    .state('space.newUpload', {
                        url: '/newUpload/:spaceId',
                        templateUrl: 'views/spaces/newUpload.html',
                        data: { title: 'NEW UPLOAD' },
                        controller: 'newUploadCtrl'
                    })
                    .state('space.newWebLink', {
                        url: '/newWebLink/:spaceId',
                        templateUrl: 'views/spaces/newWebLink.html',
                        data: { title: 'NEW WEB LINK' },
                        controller: 'newWebLinkCtrl'
                    })
                    .state('space.new', {
                        url: '/new/:entityType/:spaceId/',
                        templateUrl: 'views/spaces/newSpaceOrDoc.html',
                        data: { title: 'NEW' },
                        controller: 'newSpaceOrDocCtrl'
                    })
                    .state('space.manageAttribute', {
                        url: '/manageAttribute/:spaceId',
                        templateUrl: 'views/spaces/manageAttribute.html',
                        data: { title: 'NEW' },
                        controller: 'manageAttributeCtrl'
                    })
                    .state('space.addValueChangeUserRestrictionRule', {
                        url: '/addValueChangeUserRestrictionRule/:spaceId/:attributeId/:ruleId',
                        templateUrl: 'views/spaces/rules/ValueChangeUserRestriction.html',
                        data: { title: 'Value Change User Restriction Rule' },
                        controller: 'addValueChangeUserRestrictionRuleCtrl'
                    })
                    .state('space.addValueChangeApprovalLevelOne', {
                        url: '/addValueChangeApprovalLevelOne/:spaceId/:attributeId/:ruleId',
                        templateUrl: 'views/spaces/rules/ValueChangeApprovalLevelOne.html',
                        data: { title: 'Value Change Approval Level One' },
                        controller: 'addValueChangeApprovalLevelOneRuleCtrl'
                    })
                    .state('space.addValueChangeApprovalLevelTwo', {
                        url: '/addValueChangeApprovalLevelTwo/:spaceId/:attributeId/:ruleId',
                        templateUrl: 'views/spaces/rules/ValueChangeApprovalLevelTwo.html',
                        data: { title: 'Value Change Approval Level Two' },
                        controller: 'addValueChangeApprovalLevelTwoCtrl'
                    })
                    .state('space.addValueChangeApprovalLevelThree', {
                        url: '/addValueChangeApprovalLevelThree/:spaceId/:attributeId/:ruleId',
                        templateUrl: 'views/spaces/rules/ValueChangeApprovalLevelThree.html',
                        data: { title: 'Value Change Approval Level Three' },
                        controller: 'addValueChangeApprovalLevelThreeCtrl'
                    })
                    .state('space.addAutoNominateAward', {
                        url: '/addAutoNominateAward/:spaceId/:attributeId/:ruleId',
                        templateUrl: 'views/spaces/rules/AutoNominateAward.html',
                        data: { title: 'Auto Nominate Award' },
                        controller: 'addAutoNominateAwardCtrl'
                    })
                    .state('space.treeLayout', {
                        url: '/tree-layout/:spaceId',
                        templateUrl: 'views/spaces/graph/treeLayout.html',
                        controller: 'treeLayoutCtrl'
                    })
                    .state('space.meshLayout', {
                        url: '/mesh-layout/:spaceId',
                        templateUrl: 'views/spaces/graph/meshLayout.html',
                        controller: 'meshLayoutCtrl'
                    })
                    .state('505', {
                        url: '/505',
                        templateUrl: 'views/pages/505.html'
                    })
                    .state('access', {
                        url: '/access',
                        views: {
                            '': {
                                template: '<div class="access bg-big"><div ui-view class="fade-in-down smooth"></div></div>'
                            },
                            'header': {
                                templateUrl: 'views/public/header.html'
                            },
                            'footer': {
                                templateUrl: 'views/public/footer.html'
                            }
                        }
                        
                    })
                    .state('access.signin', {
                        url: '/signin',
                        templateUrl: 'views/pages/signin.html',
                        data: { title: 'Signin' },
                        controller: 'signInCtrl'
                    })
                    .state('access.signup', {
                        url: '/signup',
                        templateUrl: 'views/pages/signup.html',
                        data: { title: 'Register' },
                        controller: 'signUpCtrl'
                    })
                    .state('access.forgot-password', {
                        url: '/forgot-password',
                        templateUrl: 'views/pages/forgot-password.html',
                        data: { title: 'Password Recovery' },
                        controller: 'forgotPasswordCtrl'
                    })
                    .state('access.lockme', {
                        url: '/lockme',
                        templateUrl: 'views/pages/lockme.html'
                    })
                    // .state('public', {
                    //     url: '/public',
                    //     template: '<div class="bg-white"><div ui-view class="fade-in-down smooth"></div></div>'
                    // })
                    .state('public', {
                        url: '/public',
                        views: {
                            '': {
                                template: '<div class="access bg-big"><div ui-view class="fade-in-down smooth"></div></div>'
                            },
                            'header': {
                                templateUrl: 'views/public/header.html'
                            },
                            'footer': {
                                templateUrl: 'views/public/footer.html'
                            }
                        }
                        
                    })
                    .state('public.publicUserProfile', {
                        url: '/view/user/:accountId',
                        templateUrl: 'views/public/user-profile.html',
                        controller: 'userPublicProfileCtrl'
                    })
                    .state('public.publicOrgProfile', {
                        url: '/view/org/:accountId',
                        templateUrl: 'views/public/org-profile.html'
                    })
                // third party route
                    .state('thirdparty', {
                        url: '/thirdparty',
                        views: {
                            '': {
                                templateUrl: 'views/layout.html'
                            },
                            'aside': {
                                templateUrl: 'views/aside.html',
                                controller: 'currentAccountCtrl'
                            },
                            'content': {
                                templateUrl: 'views/content.html'
                            }
                        },
                        resolve: authCheck
                    })
                    .state('thirdparty.allServices', {
                        url: '/allservices/:orgId',
                        templateUrl: 'views/thirdparty/allServices.html',
                        controller: 'thirdPartyAllServicesCtrl'
                    })
                    .state('thirdparty.github', {
                        url: '/github/:orgId',
                        templateUrl: 'views/thirdparty/github/github.html',
                        controller: 'gitHubHomeCtrl'
                    }).state('thirdparty.github-preauthenticate', {
                        url: '/github/preauthenticate',
                        templateUrl: 'views/thirdparty/github/preauthenticate.html',
                        controller: 'githubCtrl'
                    }).state('thirdparty.github-settings', {
                        url: '/github/settings',
                        templateUrl: 'views/thirdparty/github/settings.html',
                        controller: 'addNewGitHookCtrl'
                    })
                    .state('thirdparty.jira', {
                        url: '/jira/:orgId',
                        templateUrl: 'views/thirdparty/jira/connetedHooks.html',
                        controller: 'jiraHomeCtrl'
                    })
                    .state('thirdparty.jirasetup', {
                        url: '/jirasetup',
                        templateUrl: 'views/thirdparty/jira/set-up.html'
                    }).state('thirdparty.jira-edit-hook', {
                        url: '/jira/editHook/:hookId',
                        templateUrl: 'views/thirdparty/jira/editHook.html',
                        controller: 'editJiraHookCtrl'
                    });
                $locationProvider.html5Mode(false).hashPrefix('!');
                //$locationProvider.html5Mode(true).hashPrefix('!');
                
                
                //
                function load(srcs, callback) {
                    //console.log(srcs,callback);
                    return {
                        deps: ['$ocLazyLoad', '$q',
                            function ($ocLazyLoad, $q) {
                                var deferred = $q.defer();
                                var promise = false;
                                srcs = angular.isArray(srcs) ? srcs : srcs.split(/\s+/);
                                if (!promise) {
                                    promise = deferred.promise;
                                }
                                angular.forEach(srcs, function (src) {
                                    promise = promise.then(function () {
                                        angular.forEach(MODULE_CONFIG, function (module) {
                                            if (module.name == src) {
                                                if (!module.module) {
                                                    name = module.files;
                                                } else {
                                                    name = module.name;
                                                }
                                            } else {
                                                name = src;
                                            }
                                        });
                                        return $ocLazyLoad.load(name);
                                    });
                                });
                                deferred.resolve();
                                return callback ? promise.then(function () {
                                    return callback();
                                }) : promise;
                            }]
                    }
                }
            }
        ]
        );

