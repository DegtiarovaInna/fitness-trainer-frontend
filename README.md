🧘‍♀️ Fitness Trainer — Frontend (Next.js 15)

Localized frontend (ru/uk/de) for a personal fitness trainer booking service with Stripe payments.
Backend: Spring Boot + PostgreSQL. API docs live on the backend; the frontend generates TypeScript types from the backend’s OpenAPI JSON.

🚀 Features

✅ App Router (Next.js 15) + React 19
✅ i18n routing with required locale prefix (/ru, /uk, /de) and redirect /ua → /uk
✅ Auth flow:
POST /auth/login?email&password → accessToken in JSON body, refreshToken in HttpOnly cookie
POST /auth/refresh → silent refresh via cookie (frontend sends credentials: "include")
✅ Pages: Home / About / Services / Blog (localized statics)
✅ Booking: studio → available time slots → Stripe Payment Element (WIP)
✅ Profile: upcoming & history (WIP)
✅ Admin: Users / Bookings / Studios / basic analytics (WIP)
✅ OpenAPI → TypeScript types with openapi-typescript
✅ Tailwind CSS v4 styling

🧰 Tech Stack
Layer	Technology
Framework	Next.js 15 (App Router)
Language	TypeScript, React 19
Styles	Tailwind CSS v4
i18n	next-intl
Payments	Stripe @stripe/react-stripe-js
API Types	openapi-typescript


📦 Getting Started (local)
Prereq: Node.js 18+ (или LTS, совместимый с Next 15), pnpm/yarn/npm — на ваш выбор.
1) Run the backend
Fill backend .env (DB, JWT, Stripe, SendGrid, S3).
In backend application.properties make sure you have:
springdoc.api-docs.path=/v1/api-docs
springdoc.swagger-ui.path=/swagger-ui.html
Start Spring Boot at http://localhost:8080.
Health checks:
Swagger UI → http://localhost:8080/swagger-ui.html
OpenAPI JSON → http://localhost:8080/v1/api-docs
2) Set up the frontend
# from the frontend folder
pnpm install            # or npm/yarn
cp .env.example .env.local
Edit .env.local (пример):
# API base URL (backend)
NEXT_PUBLIC_API_BASE=http://localhost:8080
# Stripe publishable key (for Payment Element)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
# Default locale (one of: ru|uk|de)
NEXT_PUBLIC_DEFAULT_LOCALE=de
# Optional branding
NEXT_PUBLIC_OG_IMAGE=/og.jpg
3) Generate API types from OpenAPI 
pnpm openapi
4) Run
   pnpm dev       # next dev
# pnpm build && pnpm start  # production build
