# GOURMET — Restaurant Company Profile

A full-stack restaurant company profile website with an elegant dark theme, AI-powered chatbot, online reservations, and a complete admin dashboard. Built with React, Express, PostgreSQL, and Prisma ORM.

---

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React 19, Vite, Tailwind CSS v4, React Router DOM, Axios, React Hook Form, Zod, Lucide React, Motion |
| **Backend** | Node.js, Express.js, JWT Authentication, Bcrypt, Multer, Helmet, CORS, Rate Limiting |
| **Database** | PostgreSQL, Prisma ORM |
| **AI** | Google Gemini API |

---

## Features

### Public Pages
- **Landing Page** — Hero section, signature dishes, chef profile, quick reservation
- **About** — Restaurant history, vision, mission, values, awards
- **Menu** — Browse dishes with category filter, search, and wishlist
- **Promotions** — Active promo banners with detail modal
- **Gallery** — Filterable photo grid with lightbox preview
- **Reservation** — Online booking form with Zod validation and reservation code generation
- **Contact** — Google Maps embed, contact info, and message form
- **AI Chatbot** — Gemini-powered sommelier assistant with updatable knowledge base

### Admin Dashboard (JWT Protected)
- Dashboard with statistics and bar charts
- CRUD: Menu items, Promotions, Gallery, Restaurant Profile
- Reservation management with status workflow (Pending → Confirmed → Completed → Cancelled)
- Contact message inbox

---

## Project Structure

```
├── prisma/
│   ├── schema.prisma        # Database schema (9 tables)
│   └── seed.ts              # Seed data
├── src/
│   ├── components/          # Reusable UI components
│   ├── hooks/               # Auth context & hooks
│   ├── layouts/             # MainLayout, AdminLayout
│   ├── pages/               # Route page components
│   │   └── admin/           # Admin panel pages
│   ├── server/              # Backend modules
│   │   ├── middleware/       # Auth, upload, security
│   │   └── routes/          # API route handlers
│   ├── services/            # Axios API client
│   ├── types.ts             # TypeScript interfaces
│   ├── App.tsx              # Router & route definitions
│   └── main.tsx             # Entry point
├── server.ts                # Express server entry
└── vite.config.ts
```

---

## Getting Started

### Prerequisites

- **Node.js** 18+
- **PostgreSQL** 14+

### Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment variables**

   Copy `.env.example` to `.env` and fill in your values:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/gourmet?schema=public"
   JWT_SECRET="your-secret-key"
   JWT_EXPIRES_IN="24h"
   GEMINI_API_KEY="your-gemini-api-key"
   PORT=3000
   ```

3. **Run database migrations**
   ```bash
   npx prisma migrate dev --name init
   ```

4. **Seed the database**
   ```bash
   npm run prisma:seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:3000`.

### Default Admin Credentials

| Email | Password |
|-------|----------|
| admin@gourmet.com | admin123 |

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | TypeScript type checking |
| `npm run prisma:generate` | Generate Prisma Client |
| `npm run prisma:migrate` | Run database migrations |
| `npm run prisma:seed` | Seed database with sample data |
| `npm run prisma:studio` | Open Prisma Studio |

---

## API Endpoints

### Public
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/menu` | List menu items (search, filter, paginate) |
| GET | `/api/menu/categories` | List categories |
| GET | `/api/promotions` | List promotions |
| GET | `/api/gallery` | List gallery items |
| GET | `/api/restaurant` | Get restaurant profile |
| POST | `/api/reservations` | Create reservation |
| POST | `/api/contacts` | Send contact message |
| POST | `/api/chat` | Chat with AI assistant |

### Protected (JWT Required)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Admin login |
| GET | `/api/auth/me` | Get current user |
| POST | `/api/menu` | Create menu item |
| PUT | `/api/menu/:id` | Update menu item |
| DELETE | `/api/menu/:id` | Delete menu item |
| GET | `/api/reservations` | List reservations |
| PUT | `/api/reservations/:id/status` | Update reservation status |
| DELETE | `/api/reservations/:id` | Delete reservation |
| POST | `/api/promotions` | Create promotion |
| PUT | `/api/promotions/:id` | Update promotion |
| DELETE | `/api/promotions/:id` | Delete promotion |
| POST | `/api/gallery` | Create gallery item |
| PUT | `/api/gallery/:id` | Update gallery item |
| DELETE | `/api/gallery/:id` | Delete gallery item |
| GET | `/api/contacts` | List contact messages |
| DELETE | `/api/contacts/:id` | Delete contact message |
| PUT | `/api/restaurant` | Update restaurant profile |
| GET | `/api/admin/stats` | Get dashboard statistics |

---

## Database Schema

9 tables with full relational mapping:

- **users** — Admin accounts with bcrypt-hashed passwords
- **restaurant_profiles** — Restaurant information and settings
- **categories** — Menu categories (Makanan, Minuman, Dessert, Paket Spesial)
- **menus** — Menu items with category relation, pricing, and availability
- **promotions** — Promo banners with date ranges
- **galleries** — Photo gallery with category filtering
- **reservations** — Bookings with unique codes and status workflow
- **contacts** — Contact form submissions
- **chatbot_knowledge** — AI chatbot knowledge base entries

---

## Deployment

### Frontend (Vercel)
```bash
npm run build
vercel --prod
```

### Backend (Railway)
1. Create a PostgreSQL database on Railway
2. Set environment variables (`DATABASE_URL`, `JWT_SECRET`, `GEMINI_API_KEY`)
3. Deploy: `railway up`
4. Run migrations: `npx prisma migrate deploy`
5. Seed: `npx tsx prisma/seed.ts`

---

## License

This project is built for educational purposes.
