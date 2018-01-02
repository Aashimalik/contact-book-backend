var mongoose = require('mongoose');
var Schema=mongoose.Schema;
var contactSchema = new Schema({
    name:String,
    address:String,
    phno:String,
    email:String,
   
});
module.exports = mongoose.model('Contact',contactSchema);