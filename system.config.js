/**
 * Created by hanlu on 2017/3/24.
 */

//服务器端口
const serverPort = '4000';

//服务器地址
const httpServer = 'http://localhost:'+serverPort;
//const httpServer = '';

//数据库地址
const mongooseConnect = "mongodb://localhost:27017/accountSystem";
//const mongooseConnect = "mongodb://lihuan:lihuan0215@localhost:29019/accountSystem";

//上传图片后返回的服务器地址
//const uploadImgServer = 'localhost';
const uploadImgServer = '139.224.195.74';

module.exports = {
	httpServer,
	serverPort,
	mongooseConnect,
	uploadImgServer
};