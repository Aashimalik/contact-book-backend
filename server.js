var express=require('express');
const app=express();
var PORT=process.env.PORT || 8000;
var http=require('http').Server(app);
var mongoose=require('mongoose');
var bodyParser=require('body-parser');
var Contact = require('./model/contact');
async      = require('async'),


mongoose.connect('mongodb://localhost:27017/contact');
app.use(bodyParser.urlencoded({extended:true}));


app.use(bodyParser.json());

app.get('/api/contacts',function (req, res) {
    let obj=req.query;
    // var limit=page.limit ?parseInt(page.limit):5
   let limit=2
  let page=(obj.page)?parseInt(obj.page):1
  let _skip=(page-1)*limit;
  console.log(page)
  console.log(_skip)

    console.log("inside get api");
    async.parallel({
        Count:(callback)=>{
            Contact.aggregate(
                [
                   { $group: { _id: null, count: { $sum: 1 } } },
                  
                //    { 
                //     $skip :_skip
                //    },
                //    { 
                //     $limit : limit 
                //    }
                ],callback)
        },
        Records:(callback)=>{
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
            return res.json({message:"error"})
        }
        else{
            return res.json({data:result})
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

// app.use((req, res) => {
//     // console.log(req.headers);
//     res.statusCode = 200;
//     res.setHeader('Content-Type', 'text/html');
//     res.end("connected to server");
    
//     });


http.listen(PORT, function(err){
    if(err){
        console.log(err);
    }else{
        console.log('listening on *:'+PORT);
    }  
});