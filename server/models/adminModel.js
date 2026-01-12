const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    name : {
        type : String,
        trim : true,
    },
    email : String,
    password : String,
    products : {
        type :Array,
        default : []
    },
    picture :String
})

module.exports  = mongoose.model('Admin',adminSchema);