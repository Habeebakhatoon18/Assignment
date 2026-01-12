const express = require('express');
const app = express();
const parser = require('cookie-parser');
const path = require('path');
const expressSession = require('express-session');
const flash = require('connect-flash');
const db = require('./config/mongo-connect');
const cors = require('cors');
const adminRouter = require('./routes/adminRouter');
const productRouter = require('./routes/productRouter');
const userRouter = require('./routes/userRouter');
const cartRouter = require('./routes/cartRouter');
const shopRouter = require('./routes/shopRouter');
const indexRouter = require('./routes/indexRouter');

require('dotenv').config();

// CORS configuration for frontend
const FRONTEND_URL =
  process.env.VITE_BASE_URL || "http://localhost:5173";

app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

app.use(parser());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(expressSession({
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET
}));
app.use(flash());
// Static files and view engine removed - using API mode only


app.use('/', indexRouter);
app.use('/api/admin', adminRouter);
app.use('/api/products', productRouter);
app.use('/api/users', userRouter);
app.use('/api/shop', shopRouter);
app.use('/api/cart', cartRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});