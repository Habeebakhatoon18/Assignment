# PrimeTrade - Backend Internship Assignment

A complete full-stack e-commerce application with user authentication, admin panel, product management, and shopping cart functionality. Built as a Backend Developer Intern Assignment.

## 📋 Project Overview

This project is a modern e-commerce platform that allows users to browse products, add items to cart. Administrators can manage products, and control the platform. The application features separate authentication systems for users and admins, with role-based access control.

## 🚀 Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js 5.1.0
- **Database**: MongoDB
- **ODM**: Mongoose 8.19.2
- **Authentication**: JWT (jsonwebtoken 9.0.2)
- **Password Hashing**: bcrypt 6.0.0
- **File Upload**: Multer 2.0.2
- **Session Management**: express-session, cookie-parser
- **CORS**: cors 2.8.5
- **Environment**: dotenv

### Frontend
- **Framework**: React 18.3.1
- **Build Tool**: Vite 5.1.0
- **Routing**: React Router DOM 6.28.0
- **Styling**: Tailwind CSS 3.3.6
- **State Management**: React Context API

## 📁 Project Structure

```
Assignment/
├── server/
│   ├── config/
│   │   ├── mongo-connect.js      # MongoDB connection
│   │   ├── multer-config.js      # File upload configuration
│   │   └── development.js        # Development config
│   ├── controllers/
│   │   └── authController.js     # Authentication logic
│   ├── middlewares/
│   │   ├── isLoggedIn.js        # User authentication middleware
│   │   ├── isAdmin.js            # Admin authentication middleware
│   │   └── isUserOrAdmin.js      # Combined auth middleware
│   ├── models/
│   │   ├── userModel.js          # User schema
│   │   ├── adminModel.js         # Admin schema
│   │   └── productModel.js       # Product schema
│   ├── routes/
│   │   ├── userRouter.js         # User routes
│   │   ├── adminRouter.js        # Admin routes
│   │   ├── productRouter.js      # Product routes
│   │   └── indexRouter.js       # Shop & cart routes
│   ├── utils/
│   │   └── generateToken.js      # JWT token generation
│   ├── app.js                    # Express app entry point
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx        # Navigation bar
│   │   │   ├── ProtectedRoute.jsx # Route protection
│   │   │   └── Spinner.jsx       # Loading spinner
│   │   ├── context/
│   │   │   └── AuthContext.jsx  # Authentication context
│   │   ├── lib/
│   │   │   └── api.js           # API service functions
│   │   ├── pages/
│   │   │   ├── Login.jsx        # User login page
│   │   │   ├── AdminLogin.jsx   # Admin login page
│   │   │   ├── Register.jsx     # User registration
│   │   │   └── Dashboard.jsx    # Main shop dashboard
│   │   ├── App.jsx               # Main app component
│   │   ├── main.jsx              # React entry point
│   │   └── index.css             # Global styles
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── .env
└── README.md
```

## ⚙️ Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (running locally or MongoDB Atlas)
- npm or yarn
- Git

### Backend Setup

1. **Navigate to backend directory:**
```bash
cd server
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create `.env` file in Backend directory:**
```env
PORT=3000
NODE_ENV=development

# Database
DATABASE_URL=mongodb://localhost:27017/primetrade
# Or use MongoDB Atlas:
# DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/primetrade

# JWT
JWT_KEY=your_super_secret_jwt_key_change_this_in_production
SESSION_SECRET=your_session_secret_key_change_this

# CORS
VITE_BASE_URL=http://localhost:5173
```

4. **Start the server:**
```bash
node app.js
# Or with nodemon (if installed):
# nodemon app.js
```

Backend will run on: **http://localhost:3000**

### Frontend Setup

1. **Navigate to frontend directory:**
```bash
cd frontend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create `.env` file in frontend directory (optional):**
```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_BASE_URL=http://localhost:3000
```

4. **Start the development server:**
```bash
npm run dev
```

Frontend will run on: **http://localhost:5173**

## 🔑 API Endpoints

### Authentication (Users)
- `POST /api/users/register` - Register new user
  - Body: `{ name, email, password }`
  - Returns: `{ success, token, user }`
  
- `POST /api/users/login` - Login user
  - Body: `{ email, password }`
  - Returns: `{ success, token, user }`
  
- `GET /api/users/me` - Get current user profile (Protected)
  - Returns: `{ success, user }`
  
- `GET /api/users/logout` - Logout user
  - Returns: `{ success, message }`

### Authentication (Admin)
- `POST /api/admin/login` - Admin login
  - Body: `{ email, password }`
  - Returns: `{ success, token, admin }`
  
- `GET /api/admin/logout` - Admin logout
  - Returns: `{ success, message }`

- `POST /api/admin/create` - Create admin (Production only via Postman)
  - Body: `{ name, email, password }`
  - **Security Note**: Only works in production environment. Use Postman to create admin accounts securely.

### Products
- `GET /api/products` - Get all products (Public)
  - Returns: `{ success, products }` (with base64 images)
  
- `POST /api/products/create` - Create product (Admin only)
  - Body: FormData with `name`, `price`, `discount`, `image` (file)
  - Returns: `{ success, message, product }`

- `PUT /api/admin/updateProduct/:id` - Update product (Admin only)
  - Body: FormData with `name`, `price`, `discount`, `image` (optional file)
  - Returns: `{ success, message, product }`

- `DELETE /api/admin/deleteProduct/:id` - Delete product (Admin only)
  - Returns: `{ success, message }`

### Shop & Cart
- `GET /api/shop` - Get shop products (Protected - User or Admin)
  - Returns: `{ success, products }`
  
- `POST /api/cart/add/:product_id` - Add product to cart (User only)
  - Returns: `{ success, message }`
  
- `DELETE /api/cart/remove/:product_id` - Remove from cart (User only)
  - Returns: `{ success, message }`
  
- `GET /api/users/cart` - Get user cart (User only)
  - Returns: `{ success, cartItems }`

### Admin Panel
- `GET /api/admin` - Get all products for admin (Admin only)
  - Returns: `{ success, products }`

## 🎯 Features

### User Features
- ✅ User registration and login
- ✅ Browse products with images
- ✅ View product details (name, price, discount)
- ✅ Add products to shopping cart
- ✅ View cart items
- ✅ Remove items from cart
- ✅ "Added to Cart" indicator for products already in cart

### Admin Features
- ✅ Separate admin login system
- ✅ Create, update, and delete products
- ✅ Upload product images
- ✅ Set product prices and discounts
- ✅ View all products in admin panel
- ✅ Secure admin creation (production only via Postman)

### Security Features
- ✅ JWT-based authentication with cookies
- ✅ Password hashing with bcrypt (10 salt rounds)
- ✅ Separate authentication for users and admins
- ✅ Role-based access control
- ✅ Protected routes (middleware)
- ✅ CORS configuration
- ✅ Cookie-based session management
- ✅ Admin creation restricted to production environment

### UI/UX Features
- ✅ Modern, responsive design with Tailwind CSS
- ✅ Loading states and error handling
- ✅ Success/error messages
- ✅ Form validation
- ✅ Autocomplete attributes for better UX
- ✅ Protected routes
- ✅ Separate login pages for users and admins



## 🔒 Security Best Practices

### Authentication
- Passwords hashed with bcrypt (10 salt rounds)
- JWT tokens stored in HTTP-only cookies
- Separate tokens for users (`token`) and admins (`adminToken`)
- Token expiration and validation
- Secure cookie settings (httpOnly, sameSite)

### Authorization
- Middleware-based route protection
- Role-based access control
- Admin-only endpoints protected
- User cart operations restricted to authenticated users

### Admin Security
- **Admin creation is ONLY allowed in production environment via Postman**
- This prevents unauthorized admin account creation in development
- Use Postman to securely create admin accounts in production:
  ```bash
  POST http://your-production-url/api/admin/create
  Body: {
    "name": "Admin Name",
    "email": "admin@example.com",
    "password": "secure_password"
  }
  ```

### Data Protection
- Input validation
- MongoDB injection prevention
- CORS configuration
- Environment variables for sensitive data
- Image storage in MongoDB as Buffer

## 🎨 User Interface

### Pages
1. **Login** (`/login`) - User authentication page
2. **Admin Login** (`/admin/login`) - Admin authentication page
3. **Register** (`/register`) - New user registration
4. **Dashboard** (`/`) - Main shop page with products
   - Shows all products with images
   - "Add to Cart" button for users
   - "Edit" and "Delete" buttons for admins
   - Product creation modal for admins

### Components
- **Navbar** - Navigation bar with user/admin info and logout
- **ProtectedRoute** - Route protection wrapper
- **Spinner** - Loading indicator

## 🚢 Deployment Notes

### Backend Deployment
1. Set `NODE_ENV=production` in `.env`
2. Use strong `JWT_KEY` and `SESSION_SECRET`
3. Configure MongoDB connection string
4. Enable HTTPS
5. Set proper CORS origins
6. Use process manager (PM2) for production
7. Set up environment variables securely

### Frontend Deployment
1. Build for production:
   ```bash
   cd frontend
   npm run build
   ```
2. Serve static files from `dist/` directory
3. Configure environment variables
4. Enable HTTPS
5. Update API base URL for production

### Admin Creation in Production
To create an admin account in production:
1. Ensure `NODE_ENV=production` in backend `.env`
2. Use Postman or similar tool:
   ```
   POST https://your-production-url/api/admin/create
   Headers: Content-Type: application/json
   Body: {
     "name": "Admin Name",
     "email": "admin@example.com",
     "password": "SecurePassword123"
   }
   ```
3. This endpoint is **disabled in development** for security

## 📈 Scalability Considerations

1. **Modular Architecture**: Separated routes, controllers, models, and middleware
2. **Database Indexing**: Optimized queries with MongoDB indexes on email fields
3. **Image Storage**: Consider moving to cloud storage (AWS S3, Cloudinary) for better performance
4. **Stateless Authentication**: JWT enables horizontal scaling
5. **Environment-based Configuration**: Easy deployment across environments
6. **Middleware Pattern**: Extensible request processing
7. **Error Handling**: Centralized error responses
8. **API Structure**: RESTful design for easy extension

## 🐛 Troubleshooting

### Common Issues

1. **Connection Refused Error**
   - Ensure MongoDB is running
   - Check DATABASE_URL in `.env`
   - Verify backend server is running on port 3000

2. **CORS Errors**
   - Check `VITE_BASE_URL` in backend `.env`
   - Ensure frontend URL matches CORS configuration
   - Verify credentials are included in requests

3. **Authentication Issues**
   - Clear browser cookies
   - Check JWT_KEY is set in `.env`
   - Verify token expiration

4. **Image Upload Issues**
   - Check multer configuration
   - Verify file size limits
   - Ensure FormData is used for image uploads

## 📝 Development Notes

- Images are stored as Buffer in MongoDB (consider cloud storage for production)
- Cart items are stored as ObjectId references in User model
- Admin and User authentication use separate cookie names
- Postman collection available for API testing and documentation

## 📚 API Documentation

### Postman Collection
A complete Postman collection is included in the project root:
- **PrimeTrade_API.postman_collection.json** - Complete API collection with all endpoints
- **PrimeTrade_API.postman_environment.json** - Environment variables for local development
- **POSTMAN_SETUP.md** - Detailed setup and usage guide

**To use:**
1. Import both JSON files into Postman
2. Select the environment from dropdown
3. Start testing APIs immediately

The collection includes:
- All authentication endpoints (User & Admin)
- Product CRUD operations
- Cart management endpoints
- Example requests and responses
- Proper authentication setup

## 📦 Deliverables

✅ Backend project with RESTful APIs
✅ Frontend React application
✅ User authentication and authorization
✅ Admin panel with product management
✅ Shopping cart functionality
✅ Secure admin creation (production only)
✅ Complete documentation
✅ **API documentation (Postman collection)**

## 🎓 Evaluation Criteria

✅ API design (REST principles, proper status codes)
✅ Database schema design & relationships
✅ Security practices (JWT, password hashing, validation)
✅ Code quality (clean, organized, modular)
✅ Error handling (validation, edge cases)
✅ Documentation (clear setup instructions)
✅ Authentication & Authorization (role-based access)
✅ File upload handling (product images)

## 📄 License

ISC

## 👤 Author
Habeeba Khatoon


## 🙏 Acknowledgments

Built as part of a Backend Developer Internship Assignment, demonstrating:
- RESTful API design
- Authentication & Authorization (User & Admin)
- Database modeling with MongoDB
- Security best practices
- Full-stack development skills
- Modern React development
- File upload handling
- Shopping cart implementation

---

**Note**: For production deployment, ensure all environment variables are properly configured and admin accounts are created securely using Postman as described in the Security section.
