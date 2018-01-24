const
    path=require('path'),
    Contact = require('../model/contact');

exports.delete=(req,res)=>{
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
}