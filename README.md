# 🔗 LinkSnap — MVP

A full-stack Link-in-Bio app with click analytics. Built with Next.js 14, PostgreSQL, Prisma, and NextAuth.

---

## ✅ Features (MVP)

- **Auth** — Sign up, log in, JWT sessions
- **Link manager** — Add, toggle, delete links
- **Public profile page** — `yourdomain.com/username`
- **Click tracking** — Every click is logged (device, browser, OS)
- **Analytics dashboard** — Clicks over time, device breakdown, top links
- **Redirect API** — Tracks click then redirects to destination

---

## 🛠 Tech Stack

| Layer      | Tech                          |
|------------|-------------------------------|
| Framework  | Next.js 14 (App Router)       |
| Styling    | Tailwind CSS                  |
| Database   | PostgreSQL (via Prisma ORM)   |
| Auth       | NextAuth.js (credentials)     |
| Charts     | Recharts                      |
| Deployment | Vercel + Supabase/Railway     |

---

## 🚀 Getting Started

### 1. Clone & install

```bash
git clone https://github.com/yourusername/linksnap.git
cd linksnap
npm install
```

### 2. Set up your database (free)

**Option A — Supabase (recommended)**
1. Go to [supabase.com](https://supabase.com) → New project
2. Go to Settings → Database → copy the **Connection string (URI)**

**Option B — Railway**
1. Go to [railway.app](https://railway.app) → New project → PostgreSQL
2. Copy the **DATABASE_URL** from the Variables tab

### 3. Configure environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
DATABASE_URL="postgresql://..."          # from Supabase or Railway
NEXTAUTH_SECRET="run: openssl rand -base64 32"
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 4. Push database schema

```bash
npm run db:generate
npm run db:push
```

### 5. Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

---

## 📁 Project Structure

```
linksnap/
├── app/
│   ├── page.tsx                  # Landing page
│   ├── auth/page.tsx             # Login / Register
│   ├── dashboard/
│   │   ├── page.tsx              # Link editor
│   │   └── analytics/page.tsx   # Analytics dashboard
│   ├── [username]/
│   │   ├── page.tsx              # Public profile page
│   │   └── TrackView.tsx         # Page view tracker (client)
│   └── api/
│       ├── auth/[...nextauth]/   # NextAuth handler
│       ├── register/             # User registration
│       ├── links/                # CRUD for links
│       ├── analytics/            # Analytics data
│       ├── track/                # Click/view tracking
│       └── redirect/             # Click-tracking redirect
├── prisma/
│   └── schema.prisma             # DB models: User, Link, Click, PageView
├── lib/
│   └── prisma.ts                 # Prisma client singleton
└── types/
    └── next-auth.d.ts            # Session type extensions
```

---

## 🌍 Deploying to Production

### Frontend — Vercel (free)

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com) → Import repo
3. Add your environment variables (same as `.env.local` but update `NEXTAUTH_URL` and `NEXT_PUBLIC_APP_URL` to your production URL)
4. Deploy ✅

### Database — Supabase / Railway (free tier)

Both have free tiers that work perfectly for an MVP.

---

## 🗺 Roadmap (after MVP)

- [ ] Custom bio and avatar upload
- [ ] Drag-and-drop link reordering
- [ ] Custom themes / color picker
- [ ] Email notifications (weekly stats summary)
- [ ] Custom domain support
- [ ] QR code for profile link

---

## 📝 License

MIT — build on it, ship it, make it yours.
