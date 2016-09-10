
angular.module('starter')
.controller('mapCtrl',['$scope', '$http', function($scope, $http){

//base open street map
var raster = new ol.layer.Tile({
  source: new ol.source.OSM()
});

//MAPPA

var map = new ol.Map({
  layers: [raster],
  target: document.getElementById('map'),
  view: new ol.View({
    center:[0,0],
    zoom: 12,
    projection:'EPSG:3857'
  }),
  controls:[]
});

//TODO socketio

//GEOLOCALIZATION

var geolocation = new ol.Geolocation({
  projection: map.getView().getProjection(),
  tracking: true
});

geolocation.once('change:position', function() {
  chiamata(ol.proj.transform(geolocation.getPosition(),'EPSG:3857','EPSG:4326'));
});

geolocation.on('error', function(error) {
  console.log(error);
});

var accuracyFeature = new ol.Feature();
geolocation.on('change:accuracyGeometry', function() {
  accuracyFeature.setGeometry(geolocation.getAccuracyGeometry());
});

var positionFeature = new ol.Feature();
positionFeature.setStyle(new ol.style.Style({
 image: new ol.style.Circle({
   radius: 6,
   fill: new ol.style.Fill({
     color: '#3399CC'
   }),
   stroke: new ol.style.Stroke({
     color: '#fff',
     width: 2
   })
 })
}));

geolocation.on('change:position', function() {
 var coordinates = geolocation.getPosition();
 positionFeature.setGeometry(coordinates ?
     new ol.geom.Point(coordinates) : null);

chiamata(ol.proj.transform(geolocation.getPosition(),'EPSG:3857','EPSG:4326'));
});

new ol.layer.Vector({
 name:'positionLayer',
 map: map,
 source: new ol.source.Vector({
   features: [accuracyFeature, positionFeature]
 })
});


//TODO service to get data
//data parks


function aggiornaMappa(parks){
  // handle when no parks returned from db
  if(parks.length == 0){
    map.getView().setCenter(geolocation.getPosition());
    map.getView().setResolution(10);
    $('#noParkModal').modal('show');
    return
  }

  var features = new Array(parks.length);
  for (var i = 0; i < parks.length; ++i) {
           features[i] = new ol.Feature({
             parkID:parks[i].parkID,
             geometry: new ol.geom.Point(ol.proj.transform([parks[i].latitude,parks[i].longitude], 'EPSG:4326', 'EPSG:3857'))
           });
         }

  var point= new ol.style.Style({
    image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
         anchor: [0.5, 46],
         anchorXUnits: 'fraction',
         anchorYUnits: 'pixels',
         src: 'https://192.168.50.205:3000/public/park.svg'
       }))
   });

  var vectorSource = new ol.source.Vector({
    features: features
  });
new ol.layer.Vector({
    name:'parksLayer',
    map:map,
    source: vectorSource,
    style: point
  });



  // IDEA cerca quale radius nel rest api corrisponde a questa 'resolution'
  map.getView().setCenter(geolocation.getPosition());
  map.getView().setResolution(1);
}


function chiamata(pos) {
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

//modal info parks
map.on('click', function(e){
  map.forEachFeatureAtPixel(e.pixel, function(feature, layer) {
    //fuori da angularjs in oljs.... che palle
    var scope = angular.element($("#infoID")).scope();
    scope.$apply(function(){
        scope.parkID = feature.getProperties().parkID;
    })
    //visualizza il modal
    $('#parkInfoModal').modal('show')
  }, null, function(layer) {
    return layer.getProperties().name === 'parksLayer';
  })
});
}])
