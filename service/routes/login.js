var express = require('express');
var router = express.Router();

/* GET users listing. */
router.route('/')
    .post(function (req, res, next) {
        console.log('post success!');
        res.send('respond with a resource');
    });

module.exports = router;
