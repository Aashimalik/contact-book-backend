'use strict';

const express=require('express');
const app=express();
const path = require('path');
const PORT=process.env.PORT || 8000;
const http=require('http').Server(app);
const mongoose=require('mongoose');
const bodyParser=require('body-parser');
const Contact = require('./model/contact');
const async      = require('async');
const cors = require('cors');
const contactRoutes = require('./router/contactRoutes');
const routes 		= require(path.resolve('./config/router'));
const database	= require(path.resolve('./config/database'));
const expressJWT 	= require('express-jwt');
const io = require('socket.io')(http);
	
	/*require database file to connect mongoDB*/
	
	mongoose.connect(database.url);
	mongoose.set('debug',true);

	/*Socket Init*/
	require('./socket/socket.js')(io);

	/*Listen on Server Port*/
	http.listen(8020, function(){
		console.log('Socket listening on', http.address().port);
	});