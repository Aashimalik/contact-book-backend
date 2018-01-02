var express=require('express');
const app=express();
var PORT=process.env.PORT || 8000;
var http=require('http').Server(app);
var mongoose=require('mongoose');
var bodyParser=require('body-parser');
var Contact = require('./model/contact');
async      = require('async');
var cors = require('cors');


mongoose.connect('mongodb://localhost:27017/contact');
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

app.get('/api/contacts',function (req, res) {
    let obj=req.query;
    // var limit=page.limit ?parseInt(page.limit):5
   let limit=5
  let page=(obj.page)?parseInt(obj.page):1
  let _skip=(page-1)*limit;
  
    async.parallel({
        Count:(callback)=>{
            Contact.count(callback)},
        contacts:(callback)=>{
            Contact.aggregate(
                [
                    {
                        $project :{
                            "_id":1,
                            "name":1,
                            "email":1,
                            "phno":1,
                            "address":1
                        }
                    },
                  
                   { 
                    $skip :_skip
                   },
                   { 
                    $limit : limit 
                   }
                ],callback)
        }

    },(err,result)=>{
        if(err){
            return res.status(500).json({message:err})
        }
        else{
            let countResult = (result.contacts) ? result.contacts.length : 0,
            pageCount = countResult !== 0 ? parseInt(Math.ceil(result.Count / limit) ):0;
            return res.status(200).json(
                {
                    contacts:result.contacts,
                    pageCount:pageCount
                })
        }
    })
   

});
    
  

app.post('/contact',  function (req, res) {
    var contact = req.body;
    var newContact = new Contact({
        name: req.body.name,
        address:req.body.address,
        phno:req.body.phno,
        email: req.body.email,
      })
    console.log(req.body);
    
    newContact.save(function (err, _contact) {
        if (err) {
            res.json({
                error: err,
                status: false
            })
        } else {
            res.json({
                contact: _contact,
                status: true
            })
        }
    })
});



http.listen(PORT, function(err){
    if(err){
        console.log(err);
    }else{
        console.log('listening on *:'+PORT);
    }  
});