var  express=require('express'),
  bodyParser=require('body-parser'),
  db=require('../mysql');

  var router= express.Router();
  router.use(bodyParser.json());

  router.route('/')
  .put(function (req, res) {
      db.updateUser(req.body.userID, req.body.timeStart, req.body.timeFinish, function(err, data){
        if(err)console.log(err);
        else res.end('database aggiornato');
      });
    });

  router.route('/:userID')
  .get(function(req, res){
    db.getUser(req.params.userID, function(err, data){
      if(err)console.log(err);
      else{
        res.end('userID: '+ data.userID+', name: '+ data.name+', beacon: '+ data.bleaconID+', timeStart: '+data.timeStart+', timeFinish: '+data.timeFinish);
      }
    });
  });

module.exports = router;
