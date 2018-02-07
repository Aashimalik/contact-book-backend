const jwt 	= require('jsonwebtoken'),
path 	= require('path'),
core 	 	= require('../config/core'),
_           = require('lodash'),
config	= require(path.resolve('./config/database')),
User 	= require('../model/user'),
async   = require('async'),
hostPath 	= require('../config/lib/hostPath');

exports.register = function(req, res, next){
	
		async.waterfall([
			function(done){
				let  user = new User({ username: req.body.username, password: req.body.password,email:req.body.email });
				user.save(function(err, user){
					done(err,user);
				});
			},
			function(user,done){
				let baseUrl    = hostPath.host(req),
				signupLink     = baseUrl + 'adminapi/verify/' + user.emailVerificationKey;
				if(user.username){
					console.log(signupLink)
					done(null,signupLink)
				}

			}

		],function(err, signupLink) {

                if(err){
                    res.json({
                    	error:'user already registered'
                    });
                }else{

                    res.json({
                    	signupLink:signupLink,
                    	Success:"registration successfull"
                    })
                }
            });
	
	
};

 
exports.login = function(req, res, next){
	User.findOne({ username: req.body.username }, function(err, user){
		if(err){
			res.send(err);
		} else {
			if(!user){
				res.json({
					errors: {
						name: 'Authentication error', 
						message: 'Authentication failed. User not found.'
					}
				});
			} else {
				 if(!user.verified){
					res.json({
						errors: {
							name: 'Authentication error', 
							message: ' Account not verified'
						}	
					});

				}
				else if(user.comparePassword(core.salt, req.body.password)){
                        console.log("inseiede if",user)
					user.password = undefined;
					var token = jwt.sign(user.toJSON(), config.secret);
					res.json({ user: user, token: token });
				}
				 else {
					res.json({
						errors: {
							name: 'Authentication error', 
							message: 'Authentication failed. Wrong password.'
						}	
					});
				}
			}
		}
	});
};

exports.reset=function(req,res,next){
	// console.log(req.headers.host)

	User.findOne({username:req.body.username},function(err,user){
		if(err){
			res.send(err);
		}else{
			if(!user){
				res.json({
					error: {
						name: 'Authentication error', 
						message: 'Authentication failed. User not found.'
					}
				})
			}else{
				
				user.password=req.body.password;
				user.save(function(err,result){
					if(err){
						res.send(err)
					}else{
						
						res.json({
							sucess:{
							status:true,
                            message:'Your password has been changed'
                        }
						})
					}
				})
				
			}
		}	
	})
}

exports.verify=function(req,res,next){
	console.log("insed verify",req.params.hashkey)
	let emailVerificationKey    = req.params.hashkey;
	User.findOneAndUpdate({emailVerificationKey:emailVerificationKey},{
		$set:{
			verified:true,
			emailVerificationKey:null
		}
	},function(err,result){
		if(err){
			res.send(err)
		}else{
			res.json({
				message:"Email verified",
				verified:"true"
			})
		}
	})


}