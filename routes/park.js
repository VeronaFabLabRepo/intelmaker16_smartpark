var  express=require('express'),
  bodyParser=require('body-parser'),
  db=require('../mysql');

var router= express.Router();
router.use(bodyParser.json());

var resNeg ={ // state true -> ok state false -> ko
  state:false,
  mes:'errore'
};

var resPos ={ // state true -> ok state false -> ko
  state:true,
  mes:'tutto ok'
};

var resAbu ={ // state true -> ok state false -> ko
  state:false,
  mes:'no permesso'
};

router.route('/')
.put(function (req, res) {
  var state = req.body.state; // true --> occupato, false --> libero
  var occupato;// 1>occupato, 2> abusivo
  var i =0; //IDEA non usare la i, res.rend dentro alla callback non funziona
  if(state){
    if(req.body.beacon_id ==''){
      occupato=2;
      i=2;
      db.insertOccupato(req.body.park_id, req.body.beacon_id, req.body.plate, occupato,      function(err, data){
        if(err){
          i=2;
          //res.end(resNeg);
          console.log(err);
        }
        else {
          //res.end(resPos);
          console.log('database aggiornato abusivo');
        }
        });
      }
      else{
        occupato=1;
        db.insertOccupato(req.body.park_id, req.body.beacon_id, req.body.plate, occupato,
        function(err, data){
          if(err){
            i++;
            //res.end(resNeg);
            console.log(err);
          }
          else {
            //res.end(resPos);
            console.log('database aggiornato in regola');
          }
        });
      }
    }
  else{
      db.updateLibero(req.body.park_id, req.body.beacon_id, req.body.plate, function(err, data){
              if(err){
                i++;
                //res.end(resNeg);
                console.log(err);
              }
              else{
                //res.end(resPos);
                console.log('database aggiornato update Libero');
              }
      });
  }

    if(i==0)res.send(resPos);
    if(i==2)res.send(resAbu);
    if(i==1)res.send(resPos);
    i=0;
    res.end();
  })
.post(function(req, res){
  db.getAvailableNearByRadius(req.body.latitude, req.body.longitude, req.body.radius, function(err, data){
    if(err) console.log(err);
    else res.send(data);
  });
});

router.route('/:parkID')
.get(function(req, res){
  if(req.params.parkID=='all'){
    var data = db.getAllParks(function(err, data){
      if(err)console.log(err);
      else {
        res.send(data);
        console.log('DATABASE INVIATO');
      }
    });
  }
  else {
    db.getPark(req.params.parkID, function(err, data){
      if(err)console.log(err);
      else{
        res.end('parkID: '+req.params.parkID+', userID: '+ data.userID+', timeStart: '+data.timeStart+', timeFinish: '+data.timeFinish+', name: '+data.name+', coordinates: ('+data.latitude+','+data.longitude+')');
        }
      });
    }
  });

module.exports = router;
