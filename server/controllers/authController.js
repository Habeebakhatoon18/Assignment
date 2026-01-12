const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const generateToken = require('../utils/generateToken');


module.exports.registerUser = async (req, res) => {
    try {
        let { name, email, password } = req.body;
        let user = await userModel.findOne({email});
        if (user) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }
        bcrypt.genSalt(10, async (err, salt) => {
            if (err) {
                console.error(err.message);
                return res.status(500).json({ success: false, message: 'Server error' });
            }
            bcrypt.hash(password, salt, async (err, hash) => {
                if (err) {
                    console.error(err.message);
                    return res.status(500).json({ success: false, message: 'Server error' });
                }
                let newUser = await userModel.create({
                    name,
                    email,
                    password:hash
                });
                const token = generateToken(newUser);
                res.cookie('token', token, { httpOnly: true, sameSite: 'lax' });
                const userResponse = { _id: newUser._id, name: newUser.name, email: newUser.email, cart: newUser.cart };
                return res.json({ success: true, token, user: userResponse });
            }) 
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};

module.exports.loginUser = async (req, res) => {
    try {
        let { email, password } = req.body;
        let user = await userModel.findOne({ email:email });
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }
        bcrypt.compare(password, user.password, (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ success: false, message: 'Server error' });
            }
            if(result){
                const token = generateToken(user);
                res.cookie('token', token, { httpOnly: true, sameSite: 'lax' });
                const userResponse = { _id: user._id, name: user.name, email: user.email, cart: user.cart };
                return res.json({ success: true, token, user: userResponse });
            }else{
                return res.status(401).json({ success: false, message: 'Invalid email or password' });
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};


