var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('pages/3dCreate', { title: '3Dモデル作成' });
});

module.exports = router;
