var  express=require('express'),
  assets = require('./public'),
  bodyParser=require('body-parser');

var router= express.Router();
router.use(bodyParser.json());
router.use('/public', assets);

router.route('/').get(function(req, res){
  res.render('./app');
});
router.route('/map').get(function(req, res){
  res.render('./map');
});
router.route('/about').get(function(req, res){
  res.render('./layouts/about');
});
router.route('/contact').get(function(req, res){
  res.render('./layouts/contact');
});
/*
router.route('/user').get(function(req, res){
  res.render('./layouts/user');
});
router.route('/login').get(function(req, res){
  res.render('./layouts/login');
});
router.route('/userMap').get(function(req, res){
  res.render('./layouts/userMap');
})
*/
module.exports = router;
