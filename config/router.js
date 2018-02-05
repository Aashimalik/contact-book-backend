const
    express 	= require('express'),
    path 		= require('path'),
    adminRoutes = require(path.resolve('./config/admin_router')),
    matchRoute 	= require(path.resolve('./config/matchRoute')),
    database	= require(path.resolve('./config/database'));
    router 		= express.Router(),
    admin 		= express.Router();
    const expressJWT 	= require('express-jwt');
    
//    console.log(database.secret.toString('base64'))

admin.use(expressJWT({
	secret: (database.secret).toString('base64'),
}).unless({
	path:[
		'/adminapi/user/login',
        '/adminapi/user/sign',
        // '/adminapi/api/contacts'
        
	]
}));

adminRoutes.routes.forEach(x => matchRoute(admin, x));


module.exports = {
    admin: admin
};
