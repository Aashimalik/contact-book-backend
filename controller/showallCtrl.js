const
    path=require('path'),
    Contact = require('../model/contact'),
     async      = require('async');


exports.all=(req,res)=>{
    let obj=req.query;
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
}