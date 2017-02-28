let express = require('express');
let router = express.Router();
let User = require('../models/user');
let utils = require('../utils/utils');

/* GET users listing. */
// router.route('/')
router.post('/',function (req, res, next) {
        let userInfo = req.body;
        /*let user = new User({
            username:'lihuan',
            password:'lihuan0215',
        });
        user.save(function (err) {
            if (err){
                res.send({
                    error: err
                });
            }
        });*/
        User.findByUserName(userInfo['username'], function(err, userList){
            if(err){
                res.send({
                    error:err
                });
            }
            //console.log(userList);
            if(userList.length==0){
                //用户不存在
                res.send({
                    success: false,
                    code: 1
                });
            }else {
                if(userInfo['password']==userList[0]['password']){
                    let authToken = utils.getAuthToken(10);
                    res.send({
                        success: true,
                        userInfo:{
                            username: userInfo['username'],
                            authToken:authToken,
                        }
                    });
                    global[Symbol.for('authToken')] = authToken;
                }else {
                    //密码错误
                    res.send({
                        success: false,
                        code: 2
                    });
                }
            }
        });
    });

module.exports = router;
