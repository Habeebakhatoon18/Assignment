const express = require('express');
const router = express.Router();
const isUserOrAdmin = require('../middlewares/isUserOrAdmin');

router.post('/add/:product_id', isUserOrAdmin, async(req, res) => {
    try {
        // Only users can add to cart, not admins
        if (!req.user) {
            return res.status(403).json({ success: false, message: 'Only users can add items to cart' });
        }
        let user = req.user;
        if (!user.cart.includes(req.params.product_id)) {
            user.cart.push(req.params.product_id);
            await user.save();
        }
        return res.json({ success: true, message: 'Product added to cart' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Error adding to cart' });
    }
});

router.delete('/remove/:product_id', isUserOrAdmin, async(req, res) => {
    try {
        // Only users can remove from cart, not admins
        if (!req.user) {
            return res.status(403).json({ success: false, message: 'Only users can remove items from cart' });
        }
        let user = req.user;
        user.cart = user.cart.filter(item => item.toString() !== req.params.product_id);
        await user.save();
        return res.json({ success: true, message: 'Product removed from cart' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Error removing from cart' });
    }
});

module.exports = router;
