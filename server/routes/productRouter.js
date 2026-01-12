const express = require('express');
const router = express.Router();
const upload = require('../config/multer-config');
const productModel = require('../models/productModel');

router.get('/', async (req, res) => {
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
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Error fetching products' });
    }
});

router.post('/create', upload.single('image'), async (req, res) => {
    try {
        let imageBuffer = req.file ? req.file.buffer : null;
        let { name, price, discount } = req.body;
        let product = await productModel.create({
            image: imageBuffer,
            name,
            price: parseFloat(price),
            discount: discount ? parseFloat(discount) : 0
        });
        return res.json({ success: true, message: 'Product created successfully', product });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Error creating product' });
    }
});

module.exports = router;