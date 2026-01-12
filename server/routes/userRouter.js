const express = require('express');
const router = express.Router();
const {registerUser,loginUser} = require('../controllers/authController');
const isLoggedIn = require('../middlewares/isLoggedIn');
router.get('/', (req, res) => {
    res.send('user route working');
});

router.post('/register',registerUser);

router.post('/login', loginUser);

router.get('/me', isLoggedIn, async (req, res) => {
    try {
        const user = await req.user.populate('cart');
        return res.json({ success: true, user: { _id: user._id, name: user.name, email: user.email, cart: user.cart } });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
});

router.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.locals.isLoggedIn = false;
    return res.json({ success: true, message: 'Logged out successfully' });
});


router.get("/cart", isLoggedIn, async (req, res) => {
  try {
    const user = await req.user.populate("cart");
    const cartItems = user.cart || [];
    return res.json({ success: true, cartItems });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Unable to load cart' });
  }
});



module.exports = router;