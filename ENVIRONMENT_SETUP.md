# Environment Configuration Guide

## Port Configuration (Non-conflicting ranges)
```bash
FRONTEND_PORT=3000
BACKEND_PORT=3001
```

## Host Configuration
```bash
FRONTEND_HOST=localhost
BACKEND_HOST=localhost
```

## API Configuration
```bash
REACT_APP_API_BASE_URL=http://localhost:3001
```

## CORS Configuration
```bash
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

## Backend Logging Configuration
```bash
LOG_LEVEL=info
LOG_CONSOLE=true
LOG_FILE=false
LOG_FILE_PATH=./logs/app.log
LOG_JSON=false
```

## Frontend Logging Configuration
```bash
REACT_APP_LOG_LEVEL=info
REACT_APP_LOG_CONSOLE=true
REACT_APP_LOG_JSON=false
```

## Error Handling Configuration
```bash
SHOW_STACK_TRACE=true
ENABLE_REQUEST_LOGGING=true
```

## Development Commands

### Start with Docker Compose
```bash
docker-compose up --build
```

### Start Individual Services
```bash
# Frontend (Vite dev server)
cd frontend && npm run dev

# Backend (Express server)
cd backend && npm run dev
```

## API Routing Pattern
Browser → Frontend (port 3000) → Vite Proxy → Backend (port 3001)

- Frontend requests to `/api/*` are automatically proxied to backend
- Health checks available at `/health` 
- API status at `/api/status`