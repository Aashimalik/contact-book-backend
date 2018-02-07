const mongoose 	= require('mongoose'),
crypto 		= require('crypto'),
path 		= require('path'),
core 	 	= require('../config/core'),

Schema 		= mongoose.Schema,

UserSchema 	= new Schema({
	username: {
		type: String,
		unique: true,
		required: true
	},
	email:{
		type: String,
		unique: true,
	},
	emailVerificationKey: {
        type: String
  },
 verified: {
 	type:Boolean,
 	default:false

  },
	password: {
		type: String,
		required: true
	},
	status: {
		type: Boolean,
		default: true
	},
	created: {
		type: Date,
		default: Date.now
	}
});


UserSchema.pre('save', function(next){
	var user = this;
	if(this.isModified('password') || this.isNew){
		if(this.isNew){
            user.emailVerificationKey   = crypto.createHash('md5').update((user.username + Math.floor((Math.random() * 1000) + 1))).digest("hex");
        }
		user.password = this.hashPassword(core.salt, user.password);
		next();
	} else {
		return next();
	}
});

UserSchema.methods.hashPassword = function (salt, password) {
  if (salt && password) {
    return crypto.createHmac('sha512', salt).update(password).digest('base64');
  } else {
    return password;
  }
};


UserSchema.methods.comparePassword = function(salt, password){
	return this.password === this.hashPassword(salt, password);
};

module.exports = mongoose.model('User', UserSchema);