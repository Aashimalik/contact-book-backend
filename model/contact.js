var mongoose = require('mongoose');
var Schema=mongoose.Schema;
var contactSchema = new Schema({
    name:String,
    address:String,
    phno:String,
    email:String,
    status:{
        type:Boolean,
        default:false
    },
},{
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});
module.exports = mongoose.model('Contact',contactSchema);