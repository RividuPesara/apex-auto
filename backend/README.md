# Apex Auto Mods - Backend

Node.js + Express + MongoDB API

## Setup

```bash
npm install
```

Create `.env`:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/apex-auto-mods
JWT_SECRET=secret_key
JWT_EXPIRES_IN=7d
```

## Run

```bash
# Seed database
npm run seed

# Development
npm run dev

# Production
npm start
```

## Endpoints

**Auth:** `/api/auth/register`, `/api/auth/login`, `/api/auth/profile`  
**Builds:** `/api/builds` (POST, GET, PUT, DELETE)  
**Car Models:** `/api/car-models`  
**Services:** `/api/services`

```

```
