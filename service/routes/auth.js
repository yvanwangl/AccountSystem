/**
 * Created by wyf on 2017/1/16.
 */
let express = require('express');
let router = express.Router();

router.route('/')
    .get(function (req, res, next) {
        let authToken = global[Symbol.for('authToken')];
        let requestAuthToken = req.query.authToken;
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