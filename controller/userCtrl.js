const jwt 	= require('jsonwebtoken'),
path 	= require('path'),
core 	 	= require('../config/core'),
config	= require(path.resolve('./config/database')),
User 	= require('../model/user');

exports.register = function(req, res, next){
	var user = new User({ username: req.body.username, password: req.body.password });
	user.save(function(err, user){
		if(err){
            res.json( {message: 'User already exists.',
                status:false})
		} else {
			res.json({message: 'User registered successfully', user: user});
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
				if(user.comparePassword(core.salt, req.body.password)){
                        console.log("inseiede if",user)
					user.password = undefined;
					var token = jwt.sign(user.toJSON(), config.secret);
					res.json({ user: user, token: token });
				} else {
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