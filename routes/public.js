var  express=require('express'),
  bodyParser=require('body-parser');

var router= express.Router();
router.use(bodyParser.json());

router.route('/:name')
.get(function(req, res){
  var options = {
    root: './public/',
    dotfiles: 'deny',
    headers: {
        'x-timestamp': Date.now(),
        'x-sent': true
    }
  };

  var fileName = req.params.name;
  console.log(req.params.name);
  res.sendFile(fileName, options, function (err) {
    if (err) {
      console.log(err);
      res.status(err.status).end();
    }
    else {
      console.log('Sent:', fileName);
    }
  });
})

module.exports = router;
