const mongoose = require('mongoose');

const loginSchema = new mongoose.Schema({
    Sno: { type: String, unique: true },
    UserName: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});


const LOGIN = mongoose.model('LOGIN', loginSchema);
module.exports = LOGIN;
