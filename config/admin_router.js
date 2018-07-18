const path 	= require('path');
const fs=require('fs');
 const  _   = require('lodash');
const multer = require('multer');
const express=require('express');
const crypto=require("crypto");
const config        = require('../core/env/extension')
const expressJWT 	= require('express-jwt');
// const routes=express.Router();

let ctrls = {};
fs.readdirSync(path.resolve('./controller')).forEach(file => {
	let name = file.substr(0,file.indexOf('.js'));
	ctrls[name] = require(path.resolve(`./controller/${name}`));
});



let uploadProfileImage = multer({
    limits: config.fileLimits,
    storage: multer.diskStorage({
      destination: 'assets/profile_image/',
      filename: function (req, file, cb) {
        cb(null, Date.now() + '.' + config.file_extensions[file.mimetype]);
      }
    }),
    fileFilter: fileFilter
    
});

function fileFilter (req, file, cb) {
  if(!_.includes(config.allowed_image_extensions, file.mimetype)){
    cb(new Error('Invalid image file'));
  }
  cb(null, true);
}




//.any() this is the multer function

module.exports = {
    routes:[
        { url: '/api/contacts',method: ctrls.showallCtrl.all, type: 'get'},
        { url: '/contact',method: ctrls.addCtrl.add, type: 'post' }, 
        { url: '/contact/:id',method: ctrls.deleteCtrl.delete, type: 'delete'},
        { url: '/contact/update/:id',method: ctrls.updateCtrl.update, type: 'put'},
        { url: '/contact/:id',method: ctrls.particularCtrl.show, type: 'get' }, 
        { url: '/user/sign' ,method:ctrls.userCtrl.register,type :'post'},
        { url: '/user/login',method:ctrls.userCtrl.login,type:'post'},
        { url: '/user/reset',method:ctrls.userCtrl.reset,type:'post'},
        { url: '/verify/:hashkey',method:ctrls.userCtrl.verify,type:'get'},
        { url:'/user/add', mwear:uploadProfileImage.any(),method: ctrls.userCtrl.add, type: 'post' },
    ]
};
