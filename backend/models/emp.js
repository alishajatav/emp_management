const mongoose = require('mongoose');

const empSchema = new mongoose.Schema({
    empID: { type: Number, unique: true },
    firstName: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    designation: { type: String, required: true }, 
    gender: { type: String, required: true },        
    course: { type: String, required: true },                               
    image: { type: String },                         
}, { timestamps: true });



const EMP = mongoose.model('EMP', empSchema);
module.exports =  EMP ;
