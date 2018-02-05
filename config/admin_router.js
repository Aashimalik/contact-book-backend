const path 	= require('path');
const fs=require('fs');
const express=require('express');
const expressJWT 	= require('express-jwt');
// const routes=express.Router();

let ctrls = {};
fs.readdirSync(path.resolve('./controller')).forEach(file => {
	let name = file.substr(0,file.indexOf('.js'));
	ctrls[name] = require(path.resolve(`./controller/${name}`));
});



module.exports = {
    routes:[
        { url: '/api/contacts',method: ctrls.showallCtrl.all, type: 'get'},
        { url: '/contact',method: ctrls.addCtrl.add, type: 'post' }, 
        { url: '/contact/:id',method: ctrls.deleteCtrl.delete, type: 'delete'},
        { url: '/contact/update/:id',method: ctrls.updateCtrl.update, type: 'put'},
        { url: '/contact/:id',method: ctrls.particularCtrl.show, type: 'get' }, 
        { url: '/user/sign' ,method:ctrls.userCtrl.register,type :'post'},
        { url: '/user/login',method:ctrls.userCtrl.login,type:'post'},
    ]
};
