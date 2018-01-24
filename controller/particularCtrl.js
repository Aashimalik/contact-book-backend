const
    path=require('path'),
    Contact = require('../model/contact');

exports.show=(req,res)=>{
    Contact.findOne({
        _id: req.params.id
    }, function (err, _contact) {
        if (err) {
            res.status(500).json({
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

