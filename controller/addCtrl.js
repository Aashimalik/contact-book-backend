const
    path=require('path'),
    Contact = require('../model/contact');

exports.add=(req,res)=>{
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
}