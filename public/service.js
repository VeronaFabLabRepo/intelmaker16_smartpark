angular.module('starter')
.factory('parkService',['$http', function($http){

var parksFactory={};

parksFactory.search = function(pos) {
  //console.log(pos[0], pos[1]);
  $http({
  method: 'POST',
  data:{latitude:pos[0], longitude:pos[1], radius:0.05},
  url: '/park/',
}).then(function successCallback(response) {
    aggiornaMappa(response.data);
  }, function errorCallback(response) {
    console.log(response);
  });
}

return parksFactory;
}])
