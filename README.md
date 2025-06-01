
# 🧠 saas-app-nextjs

An interactive learning platform powered by an AI Assistant, built with Next.js App Router. This project was created to explore and learn how to integrate AI into a modern web application.

![Next.js](https://img.shields.io/badge/Next.js-15-blue?logo=nextdotjs)
![Vapi](https://img.shields.io/badge/AI-Vapi-orange?logo=openai)
![Supabase](https://img.shields.io/badge/Database-Supabase-green?logo=supabase)
![Clerk](https://img.shields.io/badge/Auth-Clerk-purple?logo=clerk)
![Sentry](https://img.shields.io/badge/Monitoring-Sentry-red?logo=sentry)

---

## ✨ Key Features

- 💬 Interactive chat with AI
- 🤖 AI Assistant powered by Vapi Agent
- 🔐 User authentication using Clerk
- 💾 Session data storage via Supabase
- 📌 Bookmark sessions for easy access
- 📜 View completed session history
- 💳 Subscription system using Clerk
- ⚡ Built with Next.js 15 App Router

---

## 🧪 Tech Stack

| Layer     | Technology |
|-----------|------------|
| Frontend  | Next.js 15 (App Router) |
| Backend   | Next.js API Routes |
| Auth & Subscription | [Clerk](https://clerk.dev) |
| Database  | [Supabase](https://supabase.com) |
| AI Engine | [Vapi](https://www.vapi.ai) |
| Monitoring | [Sentry](https://www.sentry.io) |

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- Yarn or npm
- Supabase, Clerk, Vapi & Sentry accounts
- Vapi API key

### Installation

```bash
git clone https://github.com/your-username/saas-app-nextjs.git
cd saas-app-nextjs
npm install
# or
yarn install
```

Create a `.env.local` file and add the following environment variables:

```
# .env.local

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_VAPI_WEB_TOKEN=
SENTRY_AUTH_TOKEN=
...
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
```

---

## 🙌 Acknowledgements

- [Next.js](https://nextjs.org/)
- [Clerk](https://clerk.dev)
- [Supabase](https://supabase.com)
- [Vapi AI](https://www.vapi.ai)
- [Sentry](https://www.sentry.io)
