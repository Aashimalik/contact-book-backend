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
const socket = require('socket.io');
io = socket(http);
// const dotenv =require('dotenv');



mongoose.connect(database.url);
mongoose.set('debug',true);
app.use(bodyParser.urlencoded({extended:true}));
 var whitelist = ['http://localhost', 'http://localhost:3001','http://localhost:3000','http://localhost:8000','localhost:8000/contact']

app.use(bodyParser.json());

 
var corsOptionsDelegate = function (req, callback) {
  var corsOptions;
  if (whitelist.indexOf(req.header('Origin')) !== -1) {
    corsOptions = { origin: function (origin, callback) {
        console.log(origin)
        if (whitelist.indexOf(origin) !== -1) {
          callback(null, true)
        } else {
          callback(new Error('Not allowed by CORS'))
        }
      } } // reflect (enable) the requested origin in the CORS response 
  }else{
    corsOptions = { origin: function (origin, callback) {
        console.log(origin)
        if (whitelist.indexOf(origin) !== -1) {
          callback(null, true)
        } else {
          callback(new Error('Not allowed by CORS'))
        }
      } } // disable CORS for this request 
  }
  callback(null, corsOptions) // callback expects two parameters: error and options 
}
// app.use(cors(corsOptionsDelegate))
 app.use(cors())
// app.use(cors({
//     origin: function (origin, callback) {
//         console.log(origin)
//         if (whitelist.indexOf(origin) !== -1) {
//           callback(null, true)
//         } else {
//           callback(new Error('Not allowed by CORS'))
//         }
//       },
// }))


app.use('/adminapi',routes.admin)
// app.use('/',contactRoutes)



http.listen(PORT, function(err){
    if(err){
        console.log(err);
    }else{
        console.log('listening on *:'+PORT);
    }  
});


io = socket(http);

io.on('connection', (socket) => {
    console.log(socket.id);

    socket.on('SEND_MESSAGE', function(data){
        io.emit('RECEIVE_MESSAGE', data);
    })
});