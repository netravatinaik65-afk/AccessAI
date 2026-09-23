# AccessAI — Personal AI Accessibility Copilot

> Empowering people with diverse cognitive, visual, language, and physical needs to access, understand, and navigate digital information independently.

---

## 📌 Problem Statement

Many people face significant challenges accessing digital content due to language barriers, dense and complex vocabulary, visual impairments, reading difficulties, or temporary situational limitations. Traditional accessibility tools are often fragmented, rigid, or unable to understand context. **AccessAI** bridges this gap by making digital information easy to comprehend, interactive, and universally accessible.

---

## 💡 Solution

**AccessAI** is an AI-powered accessibility platform that unifies five core intelligent assistive modules with native browser accessibility capabilities:

1. **Text Simplifier**: Translates complex, jargon-heavy documents, legal notices, and technical texts into plain, easily readable language.
2. **Ask AccessAI**: Answers targeted questions strictly based on user-provided documents or context without hallucination.
3. **Voice Assistant**: Interactive conversational voice copilot tailored for speech input and text-to-speech listening.
4. **Translation**: Multilingual accessibility translation supporting English, Kannada, Hindi, and auto-detection.
5. **Image Assistant**: Extracts visual descriptions, scene layouts, and OCR text from uploaded images (JPEG, PNG, WebP, GIF).

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React.js 19 with Vite
- **Routing**: React Router DOM v7
- **Styling**: Tailwind CSS v4 (Design tokens, high-contrast, WCAG AAA compliant palettes)
- **Icons**: Lucide React
- **Browser APIs**: Web Speech API (SpeechRecognition, SpeechSynthesis)

### Backend
- **Runtime**: Node.js (ES Modules)
- **Server**: Express.js
- **Validation**: Zod Schemas
- **Security**: JSON Web Tokens (JWT), bcrypt password hashing, CORS whitelist, security headers
- **File Handling**: Multer for memory-safe multipart image processing

### AI & Database
- **AI Engine**: Google Gemini API via official `@google/genai` SDK
- **Database**: Supabase PostgreSQL (with automatic local persistent fallback for offline/development environments)

---

## 📁 Project Structure

```
├── .env.example              # Frontend environment template
├── index.html                # HTML entry point with accessibility meta tags
├── package.json              # Frontend package configuration
├── vite.config.js            # Vite configuration
├── src/
│   ├── components/           # Accessible UI components (Button, Input, Navbar, etc.)
│   ├── hooks/                # Custom React hooks (useSpeechRecognition, useTextToSpeech, etc.)
│   ├── layouts/              # Main layout wrappers
│   ├── pages/                # Application routes (LandingPage, LoginPage, RegisterPage, DashboardPage)
│   ├── services/             # API clients (apiClient, authService, aiService)
│   └── utils/                # Design constants and helpers
│
└── server/                   # Backend Express Service
    ├── .env.example          # Backend environment template
    ├── package.json          # Backend package configuration
    ├── src/
    │   ├── config/           # Environment and Supabase configurations
    │   ├── controllers/      # Route controllers (auth, ai, voice, translation, profile, health)
    │   ├── middleware/       # Auth guard, Zod validation, error handler, multer upload
    │   ├── repositories/     # Database data access layer (Supabase + local store fallback)
    │   ├── routes/           # Express API route definitions
    │   ├── services/         # Gemini AI and user store business logic
    │   └── utils/            # JWT helpers, response formatters
    └── test_*.js             # Automated end-to-end test suites
```

---

## ⚙️ Environment Setup

### 1. Frontend Configuration (`.env`)
Create a `.env` file in the project root:
```env
# Backend API base URL (with /api path)
VITE_API_URL=http://localhost:5000/api
```

### 2. Backend Configuration (`server/.env`)
Create a `server/.env` file in the `server/` directory:
```env
PORT=5000
CLIENT_URL=http://localhost:5173

# Database (Supabase)
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Authentication
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=24h

# Google Gemini API
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-3.6-flash
```

---

## 🚀 Local Installation & Setup

### Prerequisites
- Node.js (v18.0.0 or later)
- npm or yarn

### Step 1: Install Dependencies
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### Step 2: Start Backend Server
```bash
cd server
npm run dev
# Backend starts at http://localhost:5000
```

### Step 3: Start Frontend Dev Server
```bash
# In the root directory
npm run dev
# Frontend starts at http://localhost:5173
```

---

## 📡 API Endpoints

### Health Check
- `GET /api/health` — System status and health check

### Authentication
- `POST /api/auth/register` — Register a new account (`{ name, email, password }`)
- `POST /api/auth/login` — Sign in (`{ email, password }`)
- `GET /api/auth/me` — Retrieve current authenticated user (`Bearer <token>`)

### User Profile
- `GET /api/profile` — Get user accessibility preferences
- `PATCH /api/profile` — Update accessibility preferences (`fontSize`, `highContrast`, `preferredLanguage`, etc.)

### AI Accessibility Modules (Protected)
- `POST /api/ai/simplify` — Simplify text for cognitive accessibility
- `POST /api/ai/ask` — Question answering strictly from document context
- `POST /api/ai/voice` — Process spoken/typed voice query in user's language
- `POST /api/ai/translate` — Translate content (English, Kannada, Hindi, Auto Detect)
- `POST /api/ai/image` — Multimodal visual scene description and OCR extraction

---

## 🧪 Testing

Run backend test suites:
```bash
# Authentication test suite (30 tests)
node server/test_auth.js

# Profile & Supabase test suite (45 tests)
node server/test_phase4.js

# Gemini AI Modules test suite (17 tests)
node server/test_phase5.js
```

Verify frontend build:
```bash
npm run build
```

---

## 🔒 Security & Privacy

- **Zero Secret Exposure**: Server API keys (`GEMINI_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `JWT_SECRET`) are strictly isolated to the Node.js backend.
- **Client-Side Safety**: No private API keys or database tokens are bundled into the client JavaScript build.
- **Credential Storage**: Passwords are encrypted with `bcrypt` (12 salt rounds) and stripped from all API responses.
- **CORS Protection**: Restricted to designated origins (`CLIENT_URL` and production domains).
- **Rate & Payload Guards**: Request size limits (up to 25k/35k characters) and file size limits (5MB for images).

---

## 🌐 Deployment Guidelines

### Frontend (Vercel)
1. Import repository into Vercel.
2. Set Environment Variable: `VITE_API_URL=https://<your-backend-url>/api`.
3. Deploy.

### Backend (Render / Railway / Fly.io)
1. Set Root Directory to `server`.
2. Add environment variables: `PORT`, `CLIENT_URL`, `JWT_SECRET`, `GEMINI_API_KEY`, `GEMINI_MODEL`, and Supabase credentials.
3. Build command: `npm install`.
4. Start command: `node src/server.js`.

---

## 📄 License
This project is developed for accessibility and inclusion under the ISC License.
