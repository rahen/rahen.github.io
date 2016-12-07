// 'use strict';
// (function() {
//     angular.module('app')
//     .controller('userEditableCtrl', ['$scope', '$filter', '$http', 'editableOptions', 'editableThemes', 'ProfileService',  
//     function($scope, $filter, $http, editableOptions, editableThemes,ProfileService){
//     editableThemes.bs3.inputClass = 'input-sm';
//     editableThemes.bs3.buttonsClass = 'btn-sm';
//     editableOptions.theme = 'bs3';
    
//     // $scope.html5 = {
//     //   email: 'email@example.com',
//     //   tel: '123-45-67',
//     //   number: 29,
//     //   range: 10,
//     //   url: 'http://example.com',
//     //   search: 'blabla',
//     //   color: '#6a4415',
//     //   date: null,
//     //   time: '12:30',
//     //   datetime: null,
//     //   month: null,
//     //   week: null
//     // };

//     $scope.userProfile={
//         imgSrc:''
//     };
    
    
//     $scope.onProfilePrictureChange = function () {
//          var imageFile = document.createElement('input');
//          document.body.appendChild(imageFile);
//          imageFile.type='file';
//          imageFile.name='imgSrc';
//          imageFile.click();
        
//         var attachment = window.event.target.files[0];
//         var fileReader = new FileReader();
//         fileReader.onload = function (fileLoadedEvent) {
//             var attachmentData = fileLoadedEvent.target.result.replace(/^data(.*?),/, '');
//             var data={
//                 name: attachment.name,
//                 fileBase64: attachmentData
//             };
//             imageFile.removeChild();
//             ProfileService.saveUserProfilePicture(data).then(function(response){
//                     console.log(response);
//                     var imgSrc=response.code==1&&response.connData.imgSrc;
//                     $scope.userProfile.imgSrc=imgSrc;
//                     $scope.$apply();
//             });
//             //$scope.$apply();
//         }
//         fileReader.readAsDataURL(attachment);
//     };
    
    
//     //http://prod-cdn.herokuapp.com/saveUserProfilePicture
//     //https://prod-frontserver.herokuapp.com/api/entities/getPredefinedAttributeListByEntityId
//     //https://prod-frontserver.herokuapp.com/api/entities/getAttributeListByEntityId
//     //var postUrl = (loadedAttribute.isPredefined) ? 'api/entities/editPredefinedAttribute' : 'api/entities/editCustomAttribute';
//     //https://prod-frontserver.herokuapp.com/api/entities/editEntityName
//     //request={accessToken:'',entryId:'',entryType:'Person',firstName:'',lastName:''}
//     //response={"code":1,"data":{"newTitle":"Brian Tobey","firstName":"Brian","lastName":"Tobey"},"message":"Edit Success : Brian Tobey"}
//     //
//     //https://prod-frontserver.herokuapp.com/api/entities/editPredefinedAttribute
//     ////request={entryId:'',entryType:'Person',attributeId:'',attributeValue:''}
//     //response={"code":"1","message":"OK"}
//     //
    
//     // $scope.user = {
//     // 	name: 'awesome',
//     // 	desc: 'Awesome user \ndescription!',
//     //   status: 2,
//     //   agenda: 1,
//     //   remember: false
//     // }; 

//     // $scope.statuses = [
//     //   {value: 1, text: 'status1'},
//     //   {value: 2, text: 'status2'},
//     //   {value: 3, text: 'status3'}
//     // ];

//     // $scope.agenda = [
//     //   {value: 1, text: 'male'},
//     //   {value: 2, text: 'female'}
//     // ];

//     // $scope.showStatus = function() {
//     //   var selected = $filter('filter')($scope.statuses, {value: $scope.user.status});
//     //   return ($scope.user.status && selected.length) ? selected[0].text : 'Not set';
//     // };

//     // $scope.showAgenda = function() {
//     //   var selected = $filter('filter')($scope.agenda, {value: $scope.user.agenda});
//     //   return ($scope.user.agenda && selected.length) ? selected[0].text : 'Not set';
//     // };

//     // // editable table
//     // $scope.users = [
//     //   {id: 1, name: 'awesome user1', status: 2, group: 4, groupName: 'admin'},
//     //   {id: 2, name: 'awesome user2', status: undefined, group: 3, groupName: 'vip'},
//     //   {id: 3, name: 'awesome user3', status: 2, group: null}
//     // ];

//     // $scope.groups = [];
//     // $scope.loadGroups = function() {
//     //   return $scope.groups.length ? null : $http.get('api/groups').success(function(data) {
//     //     $scope.groups = data;
//     //   });
//     // };

//     // $scope.showGroup = function(user) {
//     //   if(user.group && $scope.groups.length) {
//     //     var selected = $filter('filter')($scope.groups, {id: user.group});
//     //     return selected.length ? selected[0].text : 'Not set';
//     //   } else {
//     //     return user.groupName || 'Not set';
//     //   }
//     // };

//     // $scope.showStatus = function(user) {
//     //   var selected = [];
//     //   if(user && user.status) {
//     //     selected = $filter('filter')($scope.statuses, {value: user.status});
//     //   }
//     //   return selected.length ? selected[0].text : 'Not set';
//     // };

//     // $scope.checkName = function(data, id) {
//     //   if (id === 2 && data !== 'awesome') {
//     //     return "Username 2 should be `awesome`";
//     //   }
//     // };

//     // $scope.saveUser = function(data, id) {
//     //   //$scope.user not updated yet
//     //   angular.extend(data, {id: id});
//     //   // return $http.post('api/saveUser', data);
//     // };

//     // // remove user
//     // $scope.removeUser = function(index) {
//     //   $scope.users.splice(index, 1);
//     // };

//     // // add user
//     // $scope.addUser = function() {
//     //   $scope.inserted = {
//     //     id: $scope.users.length+1,
//     //     name: '',
//     //     status: null,
//     //     group: null 
//     //   };
//     //   $scope.users.push($scope.inserted);
//     // };

// }]);
// })();
