let express = require('express');
let router = express.Router();

const routerAuth = function (req, res, next) {
    //对业务数据路由进行拦截
    console.log(req.url);
    if(/\/api\//.test(req.url)){
        let currentUser = req.session.userInfo;
        if (currentUser && currentUser._id && currentUser.username) {
            next();
        } else {
            res.send({
                isAuth: false
            });
        };
    } else {
        next();
    }
}

module.exports = routerAuth;
