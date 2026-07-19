# XCEED India — Full Stack Website

Recreated from the provided homepage design.
**Frontend:** Next.js 14 (App Router, TypeScript, Tailwind CSS)
**Backend:** Node.js + Express
**Database:** MongoDB (Mongoose)

```
xceed-india/
└── frontend/           Next.js website
    └── backend/        Express API + MongoDB models (src/config, controllers, middlewares, models, routes, services, utils)
```

## 1. Database — MongoDB

Login credentials requested: **username `ak`**, **password `ak@123`**.
These are used two ways:

1. **Mongo DB user** — create a Mongo user with these credentials (or reuse an existing admin/root user) so the app can authenticate to MongoDB itself.
2. **Website admin login** — the same username/password are seeded as the admin account for `/admin/login` on the site (protects product & quote-request management endpoints).

### Create the MongoDB user (mongosh)
```js
use admin
db.createUser({
  user: "ak",
  pwd: "ak@123",
  roles: [{ role: "readWrite", db: "xceed_india" }]
})
```

If you're using MongoDB Atlas, create a Database User with the same username/password instead, and use the Atlas connection string in `.env`.

## 2. Backend setup

```bash
cd frontend/backend
cp .env.example .env     # edit MONGO_URI if needed
npm install
npm run seed              # creates admin user (ak/ak@123) + sample categories & products
npm run dev                # starts API on http://localhost:5000
```

Key endpoints:
| Method | Route | Description |
|---|---|---|
| POST | `/api/auth/login` | Admin login (`{ username, password }`) |
| GET | `/api/products` | List products (`?trending=true`, `?bestSeller=true`, `?category=slug`) |
| GET | `/api/products/:slug` | Single product |
| GET | `/api/categories` | List categories |
| POST | `/api/quotes` | Submit "Need Custom Marking Tools" form (public) |
| GET | `/api/quotes` | List quote requests (admin, JWT required) |

## 3. Frontend setup

```bash
cd frontend
cp .env.local.example .env.local   # set NEXT_PUBLIC_API_URL if backend isn't on localhost:5000
npm install
npm run dev                          # starts site on http://localhost:3000
```

The homepage renders every section from the design: top bar, header/search/cart, nav, hero,
trust badges, trending products (with a Best Seller feature card), industries served, pricing
table, "Why Choose Us", the custom marking tools quote form (posts to the backend), and footer.

The quote form and trending-products section talk to the backend API; if the API isn't
running yet, the trending section falls back to static demo data so the page still renders.

Admin sign-in page: `http://localhost:3000/admin/login` (use `ak` / `ak@123` after seeding).

## 4. Notes

- Passwords are hashed with bcrypt before being stored; the plaintext `ak@123` is only used for
  the initial seed and for logging in.
- JWT is used for admin-protected routes — set `JWT_SECRET` to something strong in production.
- Swap the placeholder SVG hero/product graphics for real product photography whenever ready.
