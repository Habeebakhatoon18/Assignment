const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
    },
    email: String,
    password: String,
    cart: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    }],
    orders: {
        type: Array,
        default: []
    },
    picture: String
})
module.exports = mongoose.model('User', userSchema);