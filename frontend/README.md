# PrimeTrade Frontend

React application with Tailwind CSS for interacting with the PrimeTrade API.

## Features

- User registration and login
- Protected dashboard
- Product CRUD operations
- Error and success message handling
- Responsive design

## Environment Variables

Create a `.env` file in the frontend directory:

```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_BASE_URL=http://localhost:3000
```

## Installation

```bash
npm install
```

## Running

Development mode:
```bash
npm run dev
```

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## Project Structure

```
frontend/
├── src/
│   ├── components/   # Reusable components
│   ├── context/      # React context (Auth)
│   ├── lib/          # API utilities
│   ├── pages/        # Page components
│   ├── App.jsx       # Main app component
│   ├── main.jsx      # Entry point
│   └── index.css     # Global styles
├── public/
└── package.json
```

