# Docker Configuration

This folder contains all Docker-related files for the Tshimbiluni Blog Web App.

## Files

- `docker-compose.yml` - Development environment configuration
- `docker-compose.prod.yml` - Production environment configuration  
- `dockerfile` - Backend (Django) container configuration
- `frontend.dockerfile` - Frontend (React) container configuration
- `docker-setup.sh` - Automated setup script
- `.env.docker` - Environment variables template
- `.dockerignore` - Backend Docker ignore file
- `frontend.dockerignore` - Frontend Docker ignore file

## Quick Start

```bash
# Run the setup script
./docker/docker-setup.sh

# Or manually with docker-compose
docker-compose -f docker/docker-compose.yml up --build
```

## Access

- Frontend: http://localhost:5173
- Backend API: http://localhost:8000/api/
- Admin Panel: http://localhost:8000/admin/
