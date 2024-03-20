var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('pages/Word2Vec', { title: 'Word2Vec' });
});

module.exports = router;
