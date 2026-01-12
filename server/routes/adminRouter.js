const express = require('express');
const router = express.Router();
const adminModel = require('../models/adminModel');
const jwt = require('jsonwebtoken');
const productModel = require('../models/productModel');
const isAdmin = require('../middlewares/isAdmin');
const bcrypt = require('bcrypt');
const upload = require('../config/multer-config');
const dotenv = require('dotenv');
dotenv.config();


// ✅ Only allow creating admin in development mode
if (process.env.NODE_ENV === 'development') {
    router.post('/create', async (req, res) => {
        try {
            let existingAdmin = await adminModel.findOne();
            if (existingAdmin) {
                return res.status(400).json({ success: false, message: 'Admin already exists' });
            }

            let { name, email, password } = req.body;
            bcrypt.genSalt(10, async (err, salt) => {
                if (err) console.error(err.message);
                bcrypt.hash(password, salt, async (err, hash) => {
                    if (err) console.error(err.message);
                    let newAdmin = await adminModel.create({
                        name,
                        email,
                        password: hash,
                    });
                    return res.json({ success: true, message: 'Admin created successfully' });
                });
            })
            } catch (err) {
                    console.error(err);
                    res.status(500).send(err.message);
                }
            });
    } else {
            router.post('/create', (req, res) => {
                res.status(403).send('Forbidden');
            });
}
router.post('/login', async(req, res) => {
    try {
        let {email, password} = req.body;
        let admin = await adminModel.findOne({email});
        if(admin){
            const isMatch = await bcrypt.compare(password, admin.password);
            if(isMatch){
                const token = jwt.sign({ id: admin._id, email: admin.email }, process.env.JWT_KEY);
                res.cookie('adminToken', token, { httpOnly: true, sameSite: 'lax' });
                return res.json({ success: true, token, admin: { _id: admin._id, name: admin.name, email: admin.email, role: 'admin' } });
            }else{
                return res.status(401).json({ success: false, message: 'Invalid credentials' });
            }
        }else{
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
});

// router.get('/login', (req, res) => {
//     res.render('owner-login', { error: req.flash('error') });
// });

router.get('/', isAdmin, async (req, res) => {
    try {
        const products = await productModel.find({});
        // Convert image buffers to base64 for frontend
        const productsWithImages = products.map(product => {
            const productObj = product.toObject();
            if (productObj.image) {
                productObj.imageBase64 = productObj.image.toString('base64');
            }
            delete productObj.image; // Remove buffer to reduce payload
            return productObj;
        });
        return res.json({ success: true, products: productsWithImages });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'Error fetching products' });
    }
});

// Product creation is handled via POST /api/products/create


router.put('/updateProduct/:id', isAdmin, upload.single('image'), async (req, res) => {
    try {
        const { name, price, discount } = req.body;
        const updateData = {
            name,
            price: parseFloat(price),
            discount: discount ? parseFloat(discount) : 0
        };
        
        // If new image is uploaded, update it
        if (req.file && req.file.buffer) {
            updateData.image = req.file.buffer;
        }
        
        const product = await productModel.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        // Convert image buffer to base64 if exists
        const productObj = product.toObject();
        if (productObj.image) {
            productObj.imageBase64 = productObj.image.toString('base64');
        }
        delete productObj.image;
        return res.json({ success: true, message: 'Product updated successfully', product: productObj });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'Error updating product' });
    }
});

router.delete('/deleteProduct/:id', isAdmin, async (req, res) => {
    try {
        await productModel.findByIdAndDelete(req.params.id);
        return res.json({ success: true, message: 'Product deleted successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'Error deleting product' });
    }
});

router.get('/logout', (req, res) => {
    res.clearCookie('adminToken');
    return res.json({ success: true, message: 'Logged out successfully' });
});

module.exports = router;
