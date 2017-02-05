/**
 * Created by wyf on 2017/1/16.
 */
var express = require('express');
var router = express.Router();

router.route('/')
    .get(function (req, res, next) {
        var authToken = global[Symbol.for('authToken')];
        var requestAuthToken = req.query.authToken;
        if (authToken && requestAuthToken && authToken == requestAuthToken) {
            res.send({
                isAuth: true
            });
        } else {
            res.send({
                isAuth: false
            });
        }
    });

module.exports = router;