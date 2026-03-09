# Message API Backend

A Node.js/Express/TypeScript REST API backend migrated from a Spring Boot Thymeleaf MVC application. This project uses Prisma ORM with SQLite for data persistence and provides a complete REST API for managing messages.

## Table of Contents

- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Setup Instructions](#setup-instructions)
- [Available Scripts](#available-scripts)
- [API Endpoints](#api-endpoints)
- [Environment Variables](#environment-variables)
- [Database](#database)
- [Testing](#testing)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Migration from Spring Boot](#migration-from-spring-boot)

## Architecture

This application follows a **Controller-Service-Repository** pattern with Prisma ORM:

```
Client Request → Express Router (Controller) → Service Layer → Repository Layer → Prisma → SQLite
```

- **Controllers** (`src/controllers/`): Express routers that handle HTTP requests and responses
- **Services** (`src/services/`): Business logic layer with validation and error handling
- **Repositories** (`src/repositories/`): Data access layer using Prisma Client
- **Middleware** (`src/middleware/`): Cross-cutting concerns (auth, error handling, logging, validation)
- **Models** (`src/models/`): TypeScript interfaces for data types
- **Validators** (`src/validators/`): Request validation using express-validator

## Project Structure

```
backend/
├── prisma/
│   └── schema.prisma          # Prisma database schema
├── src/
│   ├── config/
│   │   ├── database.ts         # PrismaClient singleton
│   │   └── env.ts              # Environment variable validation
│   ├── controllers/
│   │   └── messageController.ts # Message REST API routes
│   ├── middleware/
│   │   ├── authMiddleware.ts    # JWT authentication middleware
│   │   ├── errorHandler.ts      # Global error handling
│   │   ├── loggingMiddleware.ts # Request logging
│   │   └── validationMiddleware.ts # Validation error handling
│   ├── models/
│   │   └── message.ts          # Message TypeScript interfaces
│   ├── repositories/
│   │   └── messageRepository.ts # Message data access layer
│   ├── services/
│   │   └── messageService.ts   # Message business logic
│   ├── utils/
│   │   └── errors.ts           # Custom error classes
│   ├── validators/
│   │   └── messageValidator.ts # Message validation rules
│   ├── app.ts                  # Express application configuration
│   └── server.ts               # Server entry point
├── tests/
│   ├── middleware/
│   │   ├── authMiddleware.test.ts
│   │   └── errorHandler.test.ts
│   ├── repositories/
│   │   └── messageRepository.test.ts
│   ├── services/
│   │   └── messageService.test.ts
│   └── validators/
│       └── messageValidator.test.ts
├── .env.example                # Environment variables template
├── jest.config.js              # Jest test configuration
├── package.json                # Node.js dependencies and scripts
├── swagger.json                # OpenAPI 3.0 API documentation
└── tsconfig.json               # TypeScript configuration
```

## Prerequisites

- **Node.js** >= 16.x
- **npm** >= 8.x
- **TypeScript** >= 5.x (installed as dev dependency)

## Setup Instructions

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Generate Prisma Client and run database migrations:**
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

The server will start on `http://localhost:3000` (or the PORT specified in `.env`).

## Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `ts-node src/server.ts` | Start development server with TypeScript |
| `build` | `tsc` | Compile TypeScript to JavaScript |
| `start` | `node dist/server.js` | Start production server (requires build first) |
| `test` | `jest` | Run all tests |
| `test:coverage` | `jest --coverage` | Run tests with coverage report |
| `lint` | `tsc --noEmit` | Type-check without emitting files |

## API Endpoints

### Messages

| Method | Path | Description | Status Codes |
|--------|------|-------------|-------------|
| `GET` | `/api/messages` | List all messages | 200 |
| `GET` | `/api/messages/:id` | Get message by ID | 200, 400, 404 |
| `POST` | `/api/messages` | Create new message | 201, 400 |
| `PUT` | `/api/messages/:id` | Update existing message | 200, 400, 404 |
| `DELETE` | `/api/messages/:id` | Delete message | 204, 400, 404 |

### System

| Method | Path | Description | Status Codes |
|--------|------|-------------|-------------|
| `GET` | `/api/health` | Health check endpoint | 200 |
| `GET` | `/api-docs` | Swagger UI API documentation | 200 |

### Request/Response Examples

**Create a message:**
```bash
curl -X POST http://localhost:3000/api/messages \
  -H "Content-Type: application/json" \
  -d '{"text": "Hello World", "summary": "A greeting"}'
```

Response (201):
```json
{
  "id": 1,
  "text": "Hello World",
  "summary": "A greeting",
  "created": "2024-01-15T10:30:00.000Z"
}
```

**List all messages:**
```bash
curl http://localhost:3000/api/messages
```

**Get a message by ID:**
```bash
curl http://localhost:3000/api/messages/1
```

**Update a message:**
```bash
curl -X PUT http://localhost:3000/api/messages/1 \
  -H "Content-Type: application/json" \
  -d '{"text": "Updated text", "summary": "Updated summary"}'
```

**Delete a message:**
```bash
curl -X DELETE http://localhost:3000/api/messages/1
```

### Error Response Format

All errors follow a consistent JSON format:
```json
{
  "error": "NotFoundError",
  "message": "Message with id 999 not found",
  "statusCode": 404
}
```

Validation errors include field-level details:
```json
{
  "error": "Validation Error",
  "message": "Validation failed",
  "statusCode": 400,
  "errors": [
    { "field": "text", "message": "Message is required." },
    { "field": "summary", "message": "Summary is required." }
  ]
}
```

## Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `DATABASE_URL` | Database connection string | `file:./dev.db` | Yes |
| `PORT` | Server port | `3000` | No |
| `JWT_SECRET` | Secret key for JWT tokens | - | Yes |
| `CORS_ORIGINS` | Comma-separated allowed origins | `http://localhost:3000,http://localhost:5173` | No |
| `NODE_ENV` | Environment (development/production/test) | `development` | No |

## Database

This project uses **Prisma ORM** with **SQLite** for development. The database can be switched to PostgreSQL, MySQL, or other databases supported by Prisma by updating the `datasource` in `prisma/schema.prisma`.

### Database Schema

The `Message` model:
```prisma
model Message {
  id      Int      @id @default(autoincrement())
  text    String
  summary String
  created DateTime @default(now())
}
```

### Database Commands

```bash
# Generate Prisma Client
npx prisma generate

# Create and apply migrations
npx prisma migrate dev --name init

# Open Prisma Studio (visual database browser)
npx prisma studio

# Reset database
npx prisma migrate reset
```

## Testing

Tests are written with **Jest** and **ts-jest**:

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run specific test file
npx jest tests/services/messageService.test.ts

# Run tests in watch mode
npx jest --watch
```

### Test Structure

- **Repository tests**: Mock PrismaClient to test data access layer
- **Service tests**: Mock repositories to test business logic
- **Middleware tests**: Test auth, error handling, and validation middleware
- **Validator tests**: Test express-validator rules

## API Documentation

Interactive API documentation is available via **Swagger UI** at:

```
http://localhost:3000/api-docs
```

The OpenAPI 3.0 specification is in `swagger.json`.


## Deployment

### Deployment Procedures

#### Prerequisites for Deployment

1. Node.js >= 16.x installed on the target server
2. A production-ready database (PostgreSQL/MySQL recommended for production; SQLite for dev/staging)
3. Environment variables configured for the target environment

#### Build for Production

```bash
# Install dependencies (production only)
npm ci --production=false

# Generate Prisma Client
npx prisma generate

# Compile TypeScript to JavaScript
npm run build

# The compiled output will be in the ./dist directory
```

#### Environment Configuration

Select and configure the appropriate environment file:

- **Development**: `.env.development`
- **Staging**: `.env.staging`
- **Production**: `.env.production`

```bash
# Copy the appropriate environment config
cp .env.production .env

# Edit with production values
# IMPORTANT: Set a strong JWT_SECRET and proper DATABASE_URL
```

#### Database Migration

```bash
# Apply migrations to the target database
npx prisma migrate deploy
```

> **Note**: Use `prisma migrate deploy` (not `migrate dev`) in staging/production environments. This applies pending migrations without generating new ones.

#### Start the Application

```bash
# Start the production server
npm start
```

The server runs on the port specified by the `PORT` environment variable (default: 3000).

#### Process Management (Recommended)

For production deployments, use a process manager like PM2 for automatic restarts and clustering:

```bash
# Install PM2 globally
npm install -g pm2

# Start with PM2
pm2 start dist/server.js --name message-api

# Enable startup script (auto-restart on system reboot)
pm2 startup
pm2 save

# Monitor the application
pm2 monit

# View logs
pm2 logs message-api
```

#### Docker Deployment (Optional)

Create a `Dockerfile` for containerized deployments:

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/swagger.json ./swagger.json
COPY --from=builder /app/package.json ./package.json
EXPOSE 3000
CMD ["npm", "start"]
```

```bash
# Build and run the Docker image
docker build -t message-api .
docker run -p 3000:3000 --env-file .env.production message-api
```

#### Health Check

After deployment, verify the application is running:

```bash
curl http://your-server:3000/api/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 5.123
}
```

#### Horizontal Scaling

The application is stateless (JWT-based auth, no server-side sessions) and supports horizontal scaling:

1. **Switch from SQLite to PostgreSQL/MySQL** by updating the `datasource` in `prisma/schema.prisma` and the `DATABASE_URL` environment variable
2. Deploy multiple instances behind a load balancer (e.g., Nginx, AWS ALB)
3. Each instance connects to the same shared database

#### Rollback Procedures

If a deployment fails:

1. **Application rollback**: Redeploy the previous version of the compiled `dist/` directory
2. **Database rollback**: Prisma doesn't natively support down migrations. Maintain manual rollback SQL scripts for each migration
3. **Quick rollback**: Keep the previous deployment artifacts for fast rollback

```bash
# Revert to previous deployment (if using PM2)
pm2 stop message-api
# Restore previous dist/ and node_modules/
pm2 start dist/server.js --name message-api
```


## Troubleshooting

### Common Issues

1. **`Cannot find module '@prisma/client'`**
   - Run `npx prisma generate` to generate the Prisma Client

2. **Database file not found**
   - Run `npx prisma migrate dev --name init` to create the database

3. **Port already in use**
   - Change the `PORT` in `.env` or stop the process using the port

4. **TypeScript compilation errors**
   - Run `npm run lint` to check for type errors
   - Ensure all dependencies are installed: `npm install`

5. **Tests failing**
   - Ensure dependencies are installed: `npm install`
   - Check that Prisma Client is generated: `npx prisma generate`

6. **CORS errors from frontend**
   - Add the frontend URL to `CORS_ORIGINS` in `.env`

## Migration from Spring Boot

This application was migrated from a Spring Boot 1.5.x Thymeleaf MVC application. Key changes:

### Endpoint Mapping

| Original (Spring Boot) | New (Express) | Notes |
|------------------------|---------------|-------|
| `GET /` | `GET /api/messages` | Thymeleaf list → JSON array |
| `GET /{id}` | `GET /api/messages/:id` | Thymeleaf view → JSON object |
| `POST /` | `POST /api/messages` | Form submit → JSON body |
| `GET /modify/{id}` | `PUT /api/messages/:id` | Form + POST → PUT with JSON |
| `GET /delete/{id}` | `DELETE /api/messages/:id` | GET → DELETE method |

### Technology Mapping

| Spring Boot | Node.js/Express |
|-------------|----------------|
| Java | TypeScript |
| Spring MVC | Express.js |
| Thymeleaf | JSON REST API |
| Spring Data (In-Memory) | Prisma ORM (SQLite) |
| Hibernate Validator | express-validator |
| Spring Security | JWT middleware (skeleton) |
| ConcurrentHashMap | SQLite database |
| `@Controller` | Express Router |
| `@Service` | TypeScript service class |
| `@Repository` | Repository class with Prisma |

### Migration Checklist

- [x] Message entity converted to TypeScript interface
- [x] In-memory repository replaced with Prisma + SQLite
- [x] MVC controllers converted to REST API endpoints
- [x] Form validation converted to express-validator
- [x] Error handling converted to Express middleware
- [x] CORS configuration added
- [x] JWT authentication skeleton added
- [x] Swagger/OpenAPI documentation generated
- [x] Unit tests created for all layers
- [x] Environment configuration externalized
