# Forms
Form and survey builder based on the VK Mini Apps platform.

## Features
* Creating feedback forms, surveys, and participant registration with various question types (text or radio buttons).
* Filling out forms and submitting answers.
* Viewing answer statistics
* Managing forms (creating, editing, deleting)
* Responsive interface for mobile devices

## Technologies
### Frontend
* React 18 + TypeScript
* VKUI (component library)
* VK Bridge (platform integration)
* Redux Toolkit (state management)
* TanStack Query (network requests and data caching)
* Vite (project build)

### Backend
* Bun (JavaScript runtime)
* Hono (web framework)
* Prisma ORM
* PostgreSQL (database)
* Zod (validation)

## Quick Start

### Prerequisites
* [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/)
* [Node.js](https://nodejs.org/) (version 18 or higher)
* [Bun](https://bun.sh/) (for backend development)

### Option 1: Using Docker (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd forms-cloud
   ```

2. **Setup frontend & backend**
  ```bash
  cd backend && bun install && cd ../frontend && npm install
  ```

3. **Start all services**
   ```bash
   docker compose up --build
   ```

4. **Access the application**
   - Frontend: http://localhost (NGINX proxy)
   - Backend API: http://localhost/api/ (via NGINX)
   - Database: localhost:5432

### Environment Variables

The backend uses the following environment variables:
- `DATABASE_URL`: PostgreSQL connection string (default: `postgresql://postgres:postgres@localhost:5432/forms_cloud`)