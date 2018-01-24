const
    path=require('path'),
    Contact = require('../model/contact');


exports.update=(req,res)=>{
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
}