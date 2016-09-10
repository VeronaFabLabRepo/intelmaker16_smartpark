var mysql = require('mysql');

var connection = mysql.createConnection({ //add your database's login details here!
  host     : '*.*.*.*',
  user     : '****', 
  password : '****', 
  database : '******'
});


exports.insertOccupato = function (parkID, beaconID, plate, occupato, callback){

    var sql="INSERT INTO ISP_register (parkID, beaconID, timeStart, plate, state) VALUES ("+parkID+",'"+beaconID+"',SYSDATE(),'"+plate+"',"+occupato+")";
    connection.query(sql, function(err, result){

      if(err) callback(err, null);
      else callback(null, result);

    });

}

exports.updateLibero = function (parkID, beaconID, plate, callback){

    var sql="UPDATE ISP_register SET timeFinish = SYSDATE() WHERE parkID="+parkID+" AND beaconID='"+beaconID+"' AND timeFinish IS NULL";
    connection.query(sql, function(err, result){

      if(err) callback(err, null);
      else callback(null, result);

  });
}

//TODO remove logs
exports.getAvailableNearByRadius= function (latitude, longitude, radius, callback){
  var sql="SELECT DISTINCT ISP_parks.* FROM ISP_parks LEFT JOIN ISP_register ON ISP_parks.parkID = ISP_register.parkID WHERE (longitude BETWEEN "+(longitude-radius)+" AND "+(longitude+radius)+") AND (latitude BETWEEN "+(latitude-radius)+" AND "+(latitude+radius)+") AND ISP_parks.parkID NOT IN (SELECT parkID FROM ISP_register WHERE timeFinish IS NULL)";
  console.log(sql);
  connection.query(sql, function(err, result){
    if(err) callback(err, null);
    else {
      callback(null, result);
      console.log(result);
    }
  });
}

exports.getAbusiveNearByRadius= function (callback){
  var sql="SELECT ISP_parks.parkID, ISP_parks.latitude, ISP_parks.longitude FROM ISP_register INNER JOIN ISP_parks ON ISP_parks.parkID = ISP_register.parkID WHERE  timeFinish IS NULL AND state = 2;";
  console.log(sql);
  connection.query(sql, function(err, result){
    if(err) callback(err, null);
    else {
      callback(null, result);
      console.log(result);
    }
  });
}

exports.updateUser = function (userID, timeStart, timeFinish, callback){ //modifica userID timeStart e timeFinish
  var sql="UPDATE ISP_users SET timeStart='"+timeStart+"', timeFinish='"+timeFinish+"' WHERE userID='"+userID+"'";
  connection.query(sql, function(err, result){
    if(err) callback(err, null);
    else callback(null, result);
  });
}

exports.getUser = function (userID, callback){
  var sql="SELECT * FROM ISP_users WHERE userID='"+userID+"'";
  connection.query(sql, function(err, result){
    if(err) callback(err, null);
    else callback(null, result[0]);
  });
}
