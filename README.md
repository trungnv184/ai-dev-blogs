# Personal Website

A modern personal website and blog platform built with React, NestJS, and PostgreSQL.

## Features

- **Blog System**: Create, edit, and publish blog posts with markdown support
- **CV/Resume Download**: Easily share your CV with recruiters
- **Skills Showcase**: Display your technical and leadership skills
- **Contact Form**: Allow visitors to get in touch
- **Admin Panel**: Manage content through a secure admin interface
- **Dark Mode**: Support for light and dark themes
- **SEO Optimized**: Meta tags, OpenGraph, and sitemap support
- **Responsive Design**: Works on all devices

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- React Query for data fetching
- Zustand for state management
- React Router for navigation
- React Hook Form + Zod for forms

### Backend
- NestJS with TypeScript
- PostgreSQL with TypeORM
- JWT Authentication
- Rate limiting with @nestjs/throttler

### Infrastructure
- Docker & Docker Compose
- GitHub Actions CI/CD
- Nginx for frontend serving

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+
- PostgreSQL 15+ (or use Docker)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/personal-website.git
cd personal-website
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:

**Backend** (`apps/backend/.env`):
```env
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=personal_website
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
CORS_ORIGINS=http://localhost:5173
```

**Frontend** (`apps/frontend/.env`):
```env
VITE_API_URL=http://localhost:3000/api
VITE_GA_TRACKING_ID=G-XXXXXXXXXX
```

4. Start the development servers:

**Using Docker (recommended):**
```bash
docker-compose up -d
```

**Or manually:**
```bash
# Start PostgreSQL
# Then run:
npm run dev
```

5. Open your browser:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000/api

## Project Structure

```
personal-website/
├── apps/
│   ├── frontend/          # React frontend
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── pages/
│   │   │   ├── services/
│   │   │   ├── store/
│   │   │   └── utils/
│   │   └── ...
│   └── backend/           # NestJS backend
│       ├── src/
│       │   ├── modules/
│       │   │   ├── auth/
│       │   │   ├── posts/
│       │   │   ├── contact/
│       │   │   ├── upload/
│       │   │   └── health/
│       │   ├── common/
│       │   └── config/
│       └── ...
├── packages/
│   └── shared/            # Shared types
├── .github/
│   └── workflows/         # CI/CD pipelines
├── docker-compose.yml
└── package.json
```

## Available Scripts

```bash
# Install all dependencies
npm install

# Start development servers
npm run dev

# Build all packages
npm run build

# Run tests
npm run test

# Run linting
npm run lint
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/login | Login |
| POST | /api/auth/refresh | Refresh token |
| POST | /api/auth/logout | Logout |
| GET | /api/posts | List posts |
| GET | /api/posts/:slug | Get post |
| POST | /api/posts | Create post |
| PUT | /api/posts/:id | Update post |
| DELETE | /api/posts/:id | Delete post |
| GET | /api/categories | List categories |
| POST | /api/contact | Submit contact |
| GET | /api/health | Health check |

## Deployment

### Using Docker

```bash
# Build images
docker build -t backend -f apps/backend/Dockerfile .
docker build -t frontend -f apps/frontend/Dockerfile .

# Run containers
docker run -p 3000:3000 backend
docker run -p 80:80 frontend
```

### Environment Variables (Production)

| Variable | Description |
|----------|-------------|
| DATABASE_URL | PostgreSQL connection string |
| JWT_SECRET | Secret for JWT tokens |
| JWT_REFRESH_SECRET | Secret for refresh tokens |
| CORS_ORIGINS | Allowed origins |
| VITE_API_URL | Backend API URL |

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see LICENSE file for details
