# YARSA Professional MERN Ecommerce

## Login
Admin: `admin@yarsa.com` / `admin123`  
User: `user@yarsa.com` / `user123`

## Setup

### 1. Backend
```bash
cd backend
cp .env .env
npm install
npm run seed
npm run dev
```
Backend runs on `http://localhost:5001`.

If your frontend/admin Vite ports are different, add them to `CLIENT_URL` / `ADMIN_URL` in `backend/.env` or keep the included localhost CORS list.

### 2. Frontend
```bash
cd frontend
cp .env .env
npm install
npm run dev
```
Use `VITE_API_URL=http://localhost:5001`.

### 3. Admin
```bash
cd admin
cp .env .env
npm install
npm run dev
```
Use `VITE_API_URL=http://localhost:5001`.

## Notes
- Product assets are included in `frontend/public/assets/frontend_assets`, so seeded paths like `/assets/frontend_assets/p_img1.png` work directly in browser.
- Checkout requires user login. Login with the demo user before placing an order.
- eSewa is implemented as a developer/demo flow. Add real eSewa/DomiPay credentials and production callback verification before real payment deployment.
- Product reviews are stored in MongoDB and update product rating averages.
