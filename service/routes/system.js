let express = require('express');
let router = express.Router();
let User = require('../models/user');
let utils = require('../utils/utils');

/* GET users listing. */
// router.route('/')
router.post('/login',function (req, res, next) {
        let userInfo = req.body;
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
					let {_id, username, admin} = userList[0];
					let authToken = utils.getAuthToken(10);
					//登录成功将用户信息写入 session
					req.session.userInfo = {
						_id,
						username,
						admin
					};
                    res.send({
                        success: true,
                        userInfo:{
                            username: userInfo['username'],
                            authToken:authToken,
                        }
					});
					// global[Symbol.for('currentUser')] = userList[0];
					// if(global[Symbol.for('authObject')]){
					// 	//以token的值作为键
					// 	global[Symbol.for('authObject')][`${authToken}`] = userList[0]['_id'];
					// }else {
					// 	global[Symbol.for('authObject')] = {
					// 		//以token的值作为键
					// 		[`${authToken}`]: userList[0]['_id']
					// 	}
					// }
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

router.post('/logup',function (req, res, next) {
	let userInfo = req.body;
	User.findByUserName(userInfo['username'], (err, userList)=>{
		if(err){
			res.send({
				success: false,
				error: err
			});
		}else {
			if(userList.length>0){
				//该用户名已经存在
				res.send({
					success: false,
					code: 3
				});
			}else {
				let user = new User(userInfo);
				user.save(function (err, user) {
					if (err) {
						res.send({
							error: err
						});
					}else {
						let {_id, username, admin} = user;
						let authToken = utils.getAuthToken(10);
						//注册成功将用户信息写入 session
						req.session.userInfo = {
							_id,
							username,
							admin
						};
						res.send({
							success: true,
							userInfo:{
								username: userInfo['username'],
								authToken: authToken,
							}
						});
						// global[Symbol.for('currentUser')] = user;
						// if(global[Symbol.for('authObject')]){
						// 	//以token的值作为键
						// 	global[Symbol.for('authObject')][`${authToken}`] = user['_id'];
						// }else {
						// 	global[Symbol.for('authObject')] = {
						// 		//以token的值作为键
						// 		[`${authToken}`]: userList[0]['_id']
						// 	}
						// }
					}
				});
			}
		}
	});
});

//退出登录
router.post('/logout',function (req, res, next) {
	let currentUser = req.session.userInfo;
	console.log('logout'+JSON.stringify(currentUser));
	if(currentUser && currentUser._id){
		//销毁session
		req.session.destroy(function(err) {
			res.send({
				success: true,
				userInfo:{
					username: currentUser['username']
				}
			});
		});
	}else {
		res.send({
			isAuth: false
		})
	}
});

module.exports = router;
