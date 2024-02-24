var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('pages/3dMotion', { title: '3Dモデル制御'});
});

module.exports = router;