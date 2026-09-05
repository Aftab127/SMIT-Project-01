# DukanOnline E-commerce

React frontend + Node/Express backend + MongoDB.

## Project structure

- `frontend/` — React/Vite UI
- `backend/` — Express API
- `backend/config/` — database connection
- `backend/models/` — User, Product, Order
- `backend/controllers/` — auth/product/order logic
- `backend/routes/` — API routes
- `backend/middleware/` — authentication and admin authorization
- `.env.example` files — environment configuration

## Categories

Fashion & Apparel:
- Men
- Women
- Kids

Electronics:
- Mobiles
- Kitchen
- Accessories

Home & Living:
- Furniture
- Decor
- Kitchen

Sports & Fitness:
- Gym Equipment
- Sport Wear

Other:
- Gift
- Pets
- Digital

## Run

### Backend
```bash
cd backend
npm install
node scripts/createAdmin.js
npm run dev
```

### Frontend
Open a second terminal:
```bash
cd frontend
npm install
npm run dev
```

Frontend: http://localhost:5173
Backend: http://localhost:5000

Admin login:
- Email: admin@dukanonline.com
- Password: Admin@123

Product images are normal image URLs, not icon libraries.


## Login / Register roles

The Login page has a **User/Admin** selector and clearly shows which account type is being used.

The Register page also has a **User/Admin** selector and clearly shows the selected account type.

After login/register:
- User -> `/user`
- Admin -> `/admin`

The navbar also displays `Logged in: User` or `Logged in: Admin`.

## If registration says "Cannot connect to backend"

Run these in separate terminals:

Backend:
```bash
cd backend
npm install
npm run dev
```

Frontend:
```bash
cd frontend
npm install
npm run dev
```

Make sure MongoDB is running and `backend/.env` contains:
`MONGO_URI=mongodb://127.0.0.1:27017/DukanOnline`

Frontend `frontend/.env` contains:
`VITE_API_URL=http://localhost:5000/api`

If the backend is running, opening `http://localhost:5000/api/health` should return:
`{"ok":true,"message":"Backend connected"}`
