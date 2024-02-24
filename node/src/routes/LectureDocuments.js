var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('pages/LectureDocuments', { title: '授業資料' });
});

module.exports = router;
