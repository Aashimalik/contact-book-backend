var express = require('express')
var contactRoutes = express.Router();
var Contact = require('../model/contact');
const async      = require('async');

contactRoutes.get('/api/contacts',function (req, res) {
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
                            "address":1,
                            "created_at":1,
                            "status":1
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

contactRoutes.post('/contact',  function (req, res) {
    var contact = req.body;
    var newContact = new Contact({
        name: req.body.name,
        address:req.body.address,
        phno:req.body.phno,
        email: req.body.email,
      })
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

contactRoutes.delete('/contact/:id',(req,res)=>{
    Contact.remove({
        _id:req.params.id
    },(err,result)=>{
        if (err) {
            res.send({
                error: err,
                status: false
            })
        } else {
            res.send({
                contacts:result,
                status: true
            })
        }
    })
});

contactRoutes.put('/contact/update/:id',function(req,res){
    var contact=req.body;
      Contact.findByIdAndUpdate({
        _id:req.params.id
    },{
        $set:contact
    },function(err,result){
        if(err){
            res.status(500).json({
                erorr:err,
                status:false
            })
        }
        else{
            res.json({
                contact:result,
                status:true,
                message:"Updated Successfully"
            })
        }
    })
});

contactRoutes.get('/contact/:id',function (req, res) {
    Contact.findOne({
        _id: req.params.id
    }, function (err, _contact) {
        if (err) {
            res.status(500).json({
                error: err
         })
        } else {
            res.json({
                contact: _contact
                })
        }
    })
});


module.exports=contactRoutes;