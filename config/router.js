const
    express 	= require('express'),
    path 		= require('path'),
    adminRoutes = require(path.resolve('./config/admin_router')),
    matchRoute 	= require(path.resolve('./config/matchRoute')),
    router 		= express.Router(),
    // expressJWT 	= require('express-jwt'), //to add jwt
    // config 		= require(require(path.resolve('./env/')).getEnv),
    admin 		= express.Router();
    


adminRoutes.routes.forEach(x => matchRoute(admin, x));



module.exports = {
    router: router,
    admin: admin
};
