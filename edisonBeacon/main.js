/*jslint node:true, vars:true, bitwise:true, unparam:true */
/*jshint unused:true */

/*
 * Prima bozza del smartpark
 * programma non ottimizzato serve solo per provare la fattibilità dell'idea
 */

var bleacon = require('bleacon');
var mraa = require('mraa');

var Client = require('node-rest-client').Client;
var client = new Client();

var minPower = -89;
var pageServer = "http://*.*.*.*:8080/updatePark";
var park_id = 1;

var express = require('express');
var app = express();
app.use(express.static(__dirname));
var server = app.listen(8085);
var io = require('socket.io').listen(server);


var proximity = new mraa.Gpio(3);
proximity.dir(mraa.DIR_IN);

var lastState,lastDebounceTime = 0,debounceDelay = 200;


console.log("iBeacon Smart Park started");
console.log("MRAA Version: " + mraa.getVersion());

io.on('connection', function(socket){
  
  var messages = setInterval(function () {
      if(currentBeacon.uuid != ""){
        io.emit('message', currentBeacon);
      }
  }, 100);
    
  socket.on('disconnect', function () {
    clearInterval(messages);
  });

});

//Beacon corrente
var currentBeacon = {
	uuid: "",
	major: 1,
	time : Date.now(),
	minor : 1,
	measuredPower : -1000,
	rssi: -1000,
	accuracy: 1000,
	proximity : ""
}

/*
 * Questo metodo viene invocato ad ogni messaggio del beacon
 * la proprietà accuracy indica la distanza in metri del beacon 
 * ovviamente considero valido il più vicino
 */
bleacon.on('discover', function (bleacon) {
	
    if(bleacon.rssi < minPower){
        console.log("RSSI basso " + bleacon.rssi);
        return;
    }
    
   // console.log(JSON.stringify(bleacon));
	
	if(bleacon.accuracy < currentBeacon.accuracy){
		currentBeacon = bleacon;
		currentBeacon.time = Date.now();
		//console.log("Cambio il beacon con il seguente " + currentBeacon.uuid);
	}
	
	if(bleacon.uuid == currentBeacon.uuid){
		//console.log("Refresh beacon " + currentBeacon.uuid);
		currentBeacon.time = Date.now();
	}
	
});

bleacon.startScanning();
periodicActivity();

function periodicActivity() {
  var proximityValue = proximity.read();
  //console.log('Gpio is ' + proximityValue);
  
  if(lastState != proximityValue){
	 lastDebounceTime = Date.now();
  }
  
  
  var debounceTime = (Date.now() - lastDebounceTime) > debounceDelay;
  
  //Il valore basso significa che il sensore ha rilevato l'auto
  //Attenzione ai falsi positivi "rimbalzi"
	if(debounceTime){
        var state = 'free';
        var args = {
            data: { 
                date: Date.now(),
                plate: "",
                state: state,
                tag_id: currentBeacon.uuid,
                park_id: park_id
            },
            headers: { "Content-Type": "application/json" }
        };
        
        
		if(proximityValue == 0){
			if(currentBeacon.uuid != ""){
				console.log("Parcheggiata auto con permesso " + currentBeacon.uuid);
			}else{
				console.log("Parcheggio occupato abusivamente");
			}
            state = 'busy';
            client.post(pageServer, args, function (data, response) {
	           console.log(data);
	           console.log(response);
            });
		}else{
            
           
            if(currentBeacon.uuid != "" && currentBeacon.accuracy < 1000){
                //console.log(args);
                state = 'free';
                client.post(pageServer, args, function (data, response) {
                    console.log("Response: " + response.statusCode);
                    console.log("Dati : " + data.toString());
                });
                
            }
            
			currentBeacon.uuid = "";
			currentBeacon.accuracy = 1000;

			//console.log("Parcheggio libero");
		}
	}
  
  lastState = proximityValue;
  
  setTimeout(periodicActivity,1000);
}
