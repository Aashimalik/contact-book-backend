'use strict';
const path                = require('path'),
	  ASYNC				  = require("async");


var socketUsers = [];

module.exports =  (io) => {

	io.on('connection', (socket) => {

		console.log('=====socket connection is ready-=====');
		/**********************************************
		* Create room with hotel id and join the user
		/**********************************************/
		socket.on('web.login', (data) => {
		    console.log('--datra--',data) ;
	  		socket.join(data.user_id);
	  		io.sockets.emit('web.login', {result:data});
	    });		

	    socket.on('web.logout', function(data) {
			
			socket.leave(data.user_id);
	    });
		  
	  	/**********************************************
		* Send Notification to all
		/**********************************************/

	  	socket.on('notificationToAll', (data) => {  
	  		io.sockets.emit('notificationToAll', {result:data});
	    });

	  	/**********************************************
		* Send Notification to selected users
		/**********************************************/
	     socket.on('notificationToRoom', (data) => {	     	
	  		io.sockets.in(data.hotel_id).emit('notificationToRoom');
	    });
	    
	});
};