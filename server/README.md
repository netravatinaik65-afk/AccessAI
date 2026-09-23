# AccessAI — Backend Foundation

The backend for **AccessAI — Personal AI Accessibility Copilot** is built using Express.js and Node.js.

---

## 1. How to Install Backend Dependencies

Navigate to the `server/` directory and install the packages:

```bash
cd server
npm install
```

---

## 2. Environment Variables

Create or configure a `.env` file in the `server/` directory based on `.env.example`:

```env
PORT=5000
CLIENT_URL=http://localhost:5173
```

- **`PORT`**: Port number for the Express server (default: `5000`).
- **`CLIENT_URL`**: Allowed origin for frontend CORS requests (default: `http://localhost:5173`).

> **Important Security Rule**: Real `.env` files are ignored by Git. Never commit production secrets, service role keys, or credentials to version control.

---

## 3. How to Start the Backend

### Development Mode (with auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

---

## 4. Backend Endpoints

- **Backend Base URL**: `http://localhost:5000`
- **API Root**: `http://localhost:5000/api`
- **Health Check URL**: `http://localhost:5000/api/health`

### Health Check Response Example
```json
{
  "success": true,
  "message": "AccessAI API is running"
}
```

---

## 5. Architectural Directory Layout

```text
server/
├── src/
│   ├── config/          # Environment & server config
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Centralized error handling & 404 router
│   ├── routes/          # Express route definitions
│   ├── services/        # Business logic & future service connectors
│   ├── utils/           # API response helpers
│   ├── validators/      # Zod validation schemas
│   ├── app.js           # App setup, CORS & middleware pipeline
│   └── server.js        # Server listener entry point
├── .env.example
├── package.json
└── README.md
```
