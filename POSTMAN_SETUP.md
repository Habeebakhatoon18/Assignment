# Postman Collection Setup Guide

This guide will help you import and use the PrimeTrade API Postman collection.

## 📦 Files Included

1. **PrimeTrade_API.postman_collection.json** - Complete API collection
2. **PrimeTrade_API.postman_environment.json** - Environment variables for local development

## 🚀 Quick Start

### Step 1: Import Collection

1. Open Postman
2. Click **Import** button (top left)
3. Select **File** tab
4. Choose `PrimeTrade_API.postman_collection.json`
5. Click **Import**

### Step 2: Import Environment

1. Click **Import** again
2. Select **File** tab
3. Choose `PrimeTrade_API.postman_environment.json`
4. Click **Import**
5. Select the environment from the dropdown (top right) - choose "PrimeTrade API - Local"

### Step 3: Update Base URL (if needed)

1. Click the environment dropdown (top right)
2. Click the eye icon to view variables
3. Update `base_url` if your backend runs on a different port
4. Default is: `http://localhost:3000`

## 📋 Collection Structure

The collection is organized into folders:

### 1. **Authentication - Users**
- Register User
- Login User
- Get User Profile
- Logout User

### 2. **Authentication - Admin**
- Create Admin (Production Only)
- Login Admin
- Logout Admin

### 3. **Products**
- Get All Products (Public)
- Create Product (Admin only)

### 4. **Admin - Product Management**
- Get All Products (Admin)
- Update Product
- Delete Product

### 5. **Shop & Cart**
- Get Shop Products
- Add to Cart
- Remove from Cart
- Get User Cart

### 6. **Health Check**
- API Status

## 🔐 Authentication Setup

### For User Endpoints

1. **Register or Login** first using:
   - `POST /api/users/register` or
   - `POST /api/users/login`

2. The JWT token will be automatically stored in cookies by Postman

3. Subsequent requests will automatically include the cookie

### For Admin Endpoints

1. **Login Admin** first using:
   - `POST /api/admin/login`

2. The admin JWT token will be automatically stored in cookies

3. Admin endpoints will automatically use the admin cookie

## 📝 Important Notes

### Cookie Management
- Postman automatically manages cookies when `credentials: include` is set
- Cookies are stored per domain
- To clear cookies: Click the **Cookies** link below the Send button

### Admin Creation
- Admin creation endpoint (`POST /api/admin/create`) **ONLY works in production**
- Set `NODE_ENV=production` in your backend `.env` file
- In development, it returns `403 Forbidden`

### File Uploads
- For product creation/update with images:
  1. Select the request
  2. Go to **Body** tab
  3. Select **form-data**
  4. For the `image` field, change type from "Text" to "File"
  5. Click **Select Files** and choose an image

### Testing Flow

**Recommended Testing Order:**

1. **User Flow:**
   ```
   Register User → Login User → Get Profile → Get Products → Add to Cart → Get Cart → Remove from Cart
   ```

2. **Admin Flow:**
   ```
   Create Admin (production) → Login Admin → Get All Products → Create Product → Update Product → Delete Product
   ```

## 🔧 Environment Variables

The environment includes:
- `base_url` - API base URL (default: http://localhost:3000)
- `user_token` - User JWT token (auto-managed via cookies)
- `admin_token` - Admin JWT token (auto-managed via cookies)

## 🐛 Troubleshooting

### Cookies Not Working
- Ensure you're using the correct environment
- Check that cookies are enabled in Postman settings
- Try manually adding cookies: Click **Cookies** link below Send button

### 401 Unauthorized
- Make sure you've logged in first
- Check that cookies are being sent (view in Postman console)
- Verify the token hasn't expired

### 403 Forbidden (Admin Create)
- This is expected in development mode
- Set `NODE_ENV=production` in backend `.env` to enable

### CORS Errors
- Ensure backend CORS is configured for your Postman requests
- Check `VITE_BASE_URL` in backend `.env`

## 📚 Additional Resources

- [Postman Documentation](https://learning.postman.com/docs/)
- [Postman Cookie Management](https://learning.postman.com/docs/sending-requests/cookies/)

## 🎯 Example Requests

### Register User
```json
POST http://localhost:3000/api/users/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Create Product (Admin)
```
POST http://localhost:3000/api/products/create
Content-Type: multipart/form-data

name: "New Product"
price: "99.99"
discount: "10"
image: [select file]
```

### Add to Cart
```
POST http://localhost:3000/api/cart/add/507f1f77bcf86cd799439011
```

---

**Note**: Replace `507f1f77bcf86cd799439011` with actual product IDs from your database.
