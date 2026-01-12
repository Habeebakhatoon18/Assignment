const express = require('express');
const router = express.Router();
const isUserOrAdmin = require('../middlewares/isUserOrAdmin');
const productModel = require('../models/productModel');

router.get('/', isUserOrAdmin, async(req, res) => {
    try {
        let products = await productModel.find({});
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

module.exports = router;
