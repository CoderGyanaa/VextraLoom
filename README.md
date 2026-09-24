# VEXTRALOOM — Career Operating System for Students

VEXTRALOOM is a premium, futuristic career operating system engineered to empower students with intelligent opportunity tracking, career readiness metrics, roadmap studios, and full-stack application lifecycle management.

---

## 1. MERN Architecture

The system is architected as a clean, decoupled **MERN monorepo** with strict TypeScript across both tiers:

- **Frontend**: React 18 + Vite 6 + TypeScript + React Router v6
- **Backend**: Node.js + Express + TypeScript (Layered service architecture)
- **Database**: MongoDB Atlas via Mongoose ODM (Target database: `vextraloom`)
- **API Standard**: RESTful JSON API with versioned endpoints (`/api/v1`)

---

## 2. Project Directory Structure

```
VextraLoom/
├── client/                 # Frontend client application (React + Vite + TypeScript)
│   ├── public/             # Static public assets
│   ├── src/
│   │   ├── pages/          # High-level route views (HomePage, NotFoundPage)
│   │   ├── routes/         # Declarative React Router setup
│   │   ├── services/       # Typed API client services
│   │   ├── App.tsx         # Root application component
│   │   ├── main.tsx        # DOM mount entrypoint
│   │   └── index.css       # Obsidian futuristic design token styling
│   ├── index.html
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── package.json
│   └── .env.example
├── server/                 # Backend REST API (Node.js + Express + TypeScript)
│   ├── src/
│   │   ├── config/         # Environment variables & MongoDB Atlas connection
│   │   ├── routes/         # Express API routes (health checks, v1 endpoints)
│   │   ├── app.ts          # Express application initialization & middleware
│   │   └── index.ts        # HTTP server entrypoint & graceful shutdown
│   ├── tsconfig.json
│   ├── package.json
│   └── .env.example
├── docs/                   # System and architectural documentation
├── .gitignore              # Repository security and exclusion rules
├── .env.example            # Root environment variable template
├── README.md               # Getting started and setup guide
└── package.json            # Monorepo script orchestrator
```

---

## 3. GitHub Repository

- **Repository**: [https://github.com/CoderGyanaa/VextraLoom.git](https://github.com/CoderGyanaa/VextraLoom.git)
- **Origin**: Configured as Git remote `origin` on branch `main`.

---

## 4. Environment Configuration

### MongoDB Atlas Setup
1. Copy `.env.example` in `server/` to `server/.env`:
   ```bash
   cp server/.env.example server/.env
   ```
2. Set your MongoDB Atlas connection string in `server/.env`:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/vextraloom?retryWrites=true&w=majority
   CORS_ORIGIN=http://localhost:5173
   ```
3. *Note*: Never commit `.env` or credentials to source control. `.env` is strictly gitignored.

---

## 5. Installation Guide

Install dependencies for both client and server:

```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

---

## 6. Running the Application

### Running Backend Server
```bash
cd server
npm run dev
```
- API Base URL: `http://localhost:5000`
- Health Endpoint: `http://localhost:5000/api/v1/health`

### Running Frontend Client
```bash
cd client
npm run dev
```
- Frontend Web App: `http://localhost:5173`

### Orchestrated Scripts (From Root Directory)
```bash
# Run server
npm run dev:server

# Run client
npm run dev:client

# Build both client and server for production
npm run build
```

---

## 7. Development & Verification Workflow

1. **Verify Health**: Visit `http://localhost:5173` or run `curl http://localhost:5000/api/v1/health`.
2. **Type Checking**:
   - Client: `cd client && npm run build`
   - Server: `cd server && npm run build`
3. **Branching & Commits**: Develop cleanly on modular feature branches before merging into `main`.
