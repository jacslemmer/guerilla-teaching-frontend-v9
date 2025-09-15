# Guerilla Teaching Website V9

A modern, responsive website for Guerilla Teaching built with React TypeScript frontend and Node.js TypeScript backend.

## Project Structure

```
guerilla-teaching-website/
├── frontend/          # React TypeScript frontend
├── backend/           # Node.js TypeScript backend
├── shared/            # Shared types and utilities
└── README.md          # This file
```

## Prerequisites

Before running this project, you need to install:

1. **Node.js** (v18 or higher)
   - Download from: https://nodejs.org/
   - Choose the LTS version

2. **npm** (comes with Node.js)

## Installation Steps

### 1. Install Node.js
- Go to https://nodejs.org/
- Download and install the LTS version
- Restart your terminal/PowerShell after installation

### 2. Verify Installation
```bash
node --version
npm --version
```

### 3. Install Dependencies

#### Frontend
```bash
cd frontend
npm install
```

#### Backend
```bash
cd backend
npm install
```

## Development

### Start Frontend (Development Mode)
```bash
cd frontend
npm start
```
Frontend will run on: http://localhost:3000

### Start Backend (Development Mode)
```bash
cd backend
npm run dev
```
Backend will run on: http://localhost:5000

## Production Build

### Frontend Build
```bash
cd frontend
npm run build
```

### Backend Build
```bash
cd backend
npm run build
```

## Deployment

This project is designed to be deployed using:
- **Frontend**: Apache web server (static files)
- **Backend**: Node.js with PM2 process manager
- **Environment**: WSL2 (Windows Subsystem for Linux)

See deployment instructions in the deployment folder.

## Features

- Modern, responsive design
- TypeScript for type safety
- RESTful API backend
- Component-based architecture
- SEO optimized
- Mobile-first approach

## Tech Stack

### Frontend
- React 18
- TypeScript
- React Router
- Axios for API calls
- CSS Modules / Styled Components

### Backend
- Node.js
- Express.js
- TypeScript
- MongoDB (optional)
- JWT Authentication

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is proprietary to Guerilla Teaching. 