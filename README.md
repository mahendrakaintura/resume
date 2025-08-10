# Japanese Resume Builder (Rirekisho)

Build, edit, save, and export Japanese resumes as fixed two‑page A4 PDFs.

- Frontend: Next.js (App Router), TypeScript
- Backend: Next.js API routes
- ORM/DB: Prisma + MySQL
- PDF: Puppeteer (server‑side render)

## Setup

1) Configure database URL in `.env` (schema name is `pdf`):

```
DATABASE_URL="mysql://<USER>:<PASSWORD>@localhost:3306/pdf"
```

2) Create tables (if your schema is empty):

```
npx prisma db push
npx prisma generate
```

If you already have tables, pull instead:

```
npx prisma db pull
npx prisma generate
```

3) Run dev server:

```
npm run dev
```

Open http://localhost:3000

- Left: form to edit all fields
- Right: live preview in Japanese Rirekisho layout
- Save: persists to MySQL
- Export PDF: two‑page A4 (server route `/api/resumes/[id]/pdf`)

Notes:
- Puppeteer may download Chromium on first run.
- If MySQL auth fails, adjust `.env` credentials. Ensure user has access to `pdf` schema.

