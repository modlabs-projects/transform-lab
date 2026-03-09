# Spring Boot to Node.js/Express/TypeScript Backend Migration

## Objective

Convert Spring Boot backend to Node.js/Express with TypeScript and Prisma ORM, preserving all business logic, API contracts, and data flow.

## Summary

This transformation converts Spring Boot backend into a Node.js/Express/TypeScript application with Prisma for database access. The process involves analyzing the Spring Boot structure, extracting and converting REST controllers to Express routers, transforming Spring services to async TypeScript services, migrating Spring Data repositories to Prisma schema and repository patterns, converting Java entities to TypeScript models with validation, migrating security and CORS configurations, converting exception handling to Express middleware, and generating comprehensive tests and documentation.

## Entry Criteria

1. Spring Boot web application (version 2.x or 3.x) with REST controllers for API endpoints
2. Spring Data JPA or JDBC for database access with entity models
3. Maven or Gradle as the build tool
4. Clearly defined service layers and business logic components
5. Spring configuration for CORS, security, or other cross-cutting concerns
6. Database schema information available through entity annotations
7. Standard Spring Boot project structure with separate packages for controllers, services, repositories, and models

## Implementation Steps

1. **Analyze Spring Boot Application Structure**: Scan the project to identify Spring Boot version, build tool (Maven/Gradle), package structure, and catalog all controllers, services, repositories, entities, and configuration classes.

2. **Extract Database Schema**: Parse JPA entity annotations (@Entity, @Table, @Column, @Id, @GeneratedValue, @OneToMany, @ManyToOne, @ManyToMany, @JoinColumn) to extract the complete database schema including tables, columns, data types, constraints, and relationships.

3. **Generate Prisma Schema**: Create a schema.prisma file by converting JPA entities to Prisma models, mapping Java types to Prisma types (String to String, Long/Integer to Int, LocalDateTime to DateTime, BigDecimal to Decimal, boolean to Boolean), converting JPA relationships to Prisma relations, and preserving indexes, unique constraints, and default values.

4. **Create Node.js/Express/TypeScript Backend Project Structure**: Initialize a new Node.js project with TypeScript configuration, install dependencies (express, @types/express, prisma, @prisma/client, cors, helmet, express-validator, dotenv, typescript, ts-node), create folder structure (src/controllers, src/services, src/repositories, src/models, src/middleware, src/config, src/utils, src/validators, tests), and configure tsconfig.json with strict type checking and ES2020 target.

5. **Convert Java Entities to TypeScript Models**: Transform each JPA entity to a TypeScript interface or type, mapping Java types to TypeScript types (String to string, Long/Integer to number, LocalDateTime to Date, BigDecimal to number or string for precision, List to Array, Set to Array or Set, Map to Map or Record), preserving field naming conventions or converting to camelCase, and adding JSDoc comments from Java documentation.

6. **Create Prisma Repository Layer**: For each Spring Data repository interface, create a corresponding TypeScript repository class that uses Prisma Client, implement standard CRUD operations (findAll, findById, create, update, delete), convert Spring Data query methods to Prisma queries, implement custom query methods using Prisma's query API, add proper error handling and transaction support, and maintain the same method signatures and return types where possible.

7. **Convert Spring Services to TypeScript Services**: Transform each Spring service class to a TypeScript service class, convert synchronous methods to async/await patterns, replace Spring dependency injection with constructor-based dependency injection using TypeScript, migrate business logic while preserving all validation and business rules, convert Java Streams to JavaScript array methods (map, filter, reduce, find), handle Optional types by converting to nullable types or using null checks, convert Java exceptions to TypeScript Error subclasses, and maintain service method signatures to ensure API compatibility.

8. **Convert REST Controllers to Express Routers**: For each Spring @RestController or @Controller with @ResponseBody, create an Express Router module, map @GetMapping, @PostMapping, @PutMapping, @DeleteMapping, @PatchMapping to corresponding Express route methods, preserve all path variables (@PathVariable) as Express route parameters (:id), convert query parameters (@RequestParam) to req.query access, convert request bodies (@RequestBody) to req.body with validation middleware, preserve all HTTP status codes from ResponseEntity, maintain the exact same endpoint paths and HTTP methods, implement async route handlers with proper error handling, and add express-validator rules based on Java validation annotations.

9. **Migrate Validation Logic**: Convert Spring validation annotations to express-validator chains (@NotNull to notEmpty(), @NotBlank to notEmpty().trim(), @Size to isLength(), @Email to isEmail(), @Min/@Max to isInt() with min/max options, @Pattern to matches(), @Valid for nested objects to custom validators), create reusable validation middleware functions, implement custom validators for complex business rules, and ensure validation error responses match the original format.

10. **Convert Exception Handling**: Transform Spring @ExceptionHandler methods to Express error middleware, create custom error classes extending Error for different error types (ValidationError, NotFoundError, UnauthorizedError, BusinessLogicError), implement a global error handler middleware that catches all errors and formats responses consistently, map Spring exception types to appropriate HTTP status codes, preserve error message formats and error response structures, and add logging for error tracking.

11. **Migrate CORS Configuration**: Extract Spring CORS configuration from @CrossOrigin annotations and WebMvcConfigurer, convert to Express CORS middleware configuration, preserve allowed origins, methods, headers, and credentials settings, and apply globally or per-route as needed.

12. **Migrate Security Configuration**: Analyze Spring Security configuration for authentication and authorization patterns, implement JWT-based authentication middleware if using Spring Security JWT, convert authentication filters to Express middleware, implement authorization checks as route middleware based on @PreAuthorize or role checks, preserve password hashing strategies (BCrypt), and create authentication routes for login/logout/register.

13. **Create Express Application Configuration**: Set up the main Express application file (app.ts or server.ts), configure middleware stack (helmet for security headers, cors, express.json(), express.urlencoded(), custom logging middleware), register all routers with appropriate base paths matching Spring @RequestMapping at class level, configure error handling middleware as the last middleware, set up Prisma Client connection and graceful shutdown, configure environment variables using dotenv, and implement health check endpoints.

14. **Implement Backend Tests**: Create comprehensive test coverage for all backend components with the following structure:
   
   a. **Service Layer Unit Tests**: Create unit tests for each service class using Jest with mocked dependencies. Mock all repository dependencies using jest.mock() or manual mocks. Test each service method in isolation including success cases with valid data, edge cases with boundary values, error cases when repositories throw errors, business logic validation and rule enforcement, data transformation and mapping logic, transaction handling and rollback scenarios, and async/await error propagation. Organize tests in describe blocks by service class and nested describe blocks by method. Example structure:
   ```typescript
   // tests/services/userService.test.ts
   describe('UserService', () => {
     let userService: UserService;
     let mockUserRepository: jest.Mocked<UserRepository>;
     
     beforeEach(() => {
       mockUserRepository = {
         findById: jest.fn(),
         create: jest.fn(),
         update: jest.fn(),
         delete: jest.fn(),
       } as any;
       userService = new UserService(mockUserRepository);
     });
     
     describe('getUserById', () => {
       it('should return user when found', async () => {
         const mockUser = { id: 1, name: 'John', email: 'john@example.com' };
         mockUserRepository.findById.mockResolvedValue(mockUser);
         
         const result = await userService.getUserById(1);
         
         expect(result).toEqual(mockUser);
         expect(mockUserRepository.findById).toHaveBeenCalledWith(1);
       });
       
       it('should throw NotFoundError when user not found', async () => {
         mockUserRepository.findById.mockResolvedValue(null);
         
         await expect(userService.getUserById(999))
           .rejects.toThrow(NotFoundError);
       });
     });
   });
   ```
   
   b. **Repository Layer Unit Tests**: Create unit tests for each repository class with mocked Prisma Client. Mock the Prisma Client using jest.mock('@prisma/client') or create a mock instance. Test all CRUD operations (create, findById, findAll, update, delete), custom query methods with where clauses, pagination and sorting logic, relationship loading (include and select), transaction handling, unique constraint violations, foreign key constraint handling, and error cases for database failures. Example structure:
   ```typescript
   // tests/repositories/userRepository.test.ts
   import { PrismaClient } from '@prisma/client';
   
   jest.mock('@prisma/client');
   
   describe('UserRepository', () => {
     let userRepository: UserRepository;
     let mockPrisma: jest.Mocked<PrismaClient>;
     
     beforeEach(() => {
       mockPrisma = {
         user: {
           findUnique: jest.fn(),
           findMany: jest.fn(),
           create: jest.fn(),
           update: jest.fn(),
           delete: jest.fn(),
         },
       } as any;
       userRepository = new UserRepository(mockPrisma);
     });
     
     describe('findById', () => {
       it('should return user with relations', async () => {
         const mockUser = { id: 1, name: 'John', posts: [] };
         mockPrisma.user.findUnique.mockResolvedValue(mockUser);
         
         const result = await userRepository.findById(1);
         
         expect(result).toEqual(mockUser);
         expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
           where: { id: 1 },
           include: { posts: true }
         });
       });
     });
   });
   ```
   
   c. **Middleware Unit Tests**: Create unit tests for all middleware functions including authentication middleware (valid token, expired token, missing token, invalid token signature, token with insufficient permissions), authorization middleware (user with required role, user without required role, missing user context), error handling middleware (different error types mapped to correct status codes, error response format, stack trace inclusion based on environment), validation middleware (valid input, invalid input with specific validation errors, missing required fields), and logging middleware. Mock Express request, response, and next function. Example structure:
   ```typescript
   // tests/middleware/authMiddleware.test.ts
   describe('authMiddleware', () => {
     let mockReq: Partial<Request>;
     let mockRes: Partial<Response>;
     let nextFunction: NextFunction;
     
     beforeEach(() => {
       mockReq = {
         headers: {},
         user: undefined
       };
       mockRes = {
         status: jest.fn().mockReturnThis(),
         json: jest.fn()
       };
       nextFunction = jest.fn();
     });
     
     it('should authenticate valid token', async () => {
       mockReq.headers = { authorization: 'Bearer valid-token' };
       jest.spyOn(jwt, 'verify').mockReturnValue({ userId: 1, role: 'user' });
       
       await authMiddleware(mockReq as Request, mockRes as Response, nextFunction);
       
       expect(mockReq.user).toEqual({ userId: 1, role: 'user' });
       expect(nextFunction).toHaveBeenCalled();
     });
     
     it('should reject missing token', async () => {
       await authMiddleware(mockReq as Request, mockRes as Response, nextFunction);
       
       expect(mockRes.status).toHaveBeenCalledWith(401);
       expect(mockRes.json).toHaveBeenCalledWith({ error: 'No token provided' });
       expect(nextFunction).not.toHaveBeenCalled();
     });
   });
   ```
   
   d. **Validator and Utility Unit Tests**: Create unit tests for all validation functions, data transformation utilities, date/time utilities, string manipulation helpers, business logic helpers, and custom validators. Test with valid inputs, invalid inputs, edge cases, null/undefined handling, and type conversions.
   
   e. **API Integration Tests**: Create comprehensive API integration tests using supertest for every REST endpoint. Set up test database with migrations before tests and clean up after tests. Test each endpoint for success cases with valid data and correct status codes (200, 201, 204), error cases with invalid data and correct error status codes (400, 404, 500), validation errors with detailed error messages (422), authentication scenarios (missing token, invalid token, expired token), authorization scenarios (insufficient permissions, correct role access), pagination and filtering parameters, sorting parameters, request body validation, path parameter validation, query parameter validation, and response body structure and data types. Organize tests by resource/controller with nested describe blocks by endpoint and HTTP method. Example structure:
   ```typescript
   // tests/integration/userRoutes.test.ts
   import request from 'supertest';
   import app from '../../src/app';
   import { PrismaClient } from '@prisma/client';
   
   const prisma = new PrismaClient();
   
   describe('User API Integration Tests', () => {
     beforeAll(async () => {
       await prisma.$connect();
       await prisma.user.deleteMany(); // Clean database
     });
     
     afterAll(async () => {
       await prisma.$disconnect();
     });
     
     describe('POST /api/users', () => {
       it('should create user with valid data', async () => {
         const userData = {
           name: 'John Doe',
           email: 'john@example.com',
           password: 'SecurePass123!'
         };
         
         const response = await request(app)
           .post('/api/users')
           .send(userData)
           .expect(201);
         
         expect(response.body).toHaveProperty('id');
         expect(response.body.name).toBe(userData.name);
         expect(response.body.email).toBe(userData.email);
         expect(response.body).not.toHaveProperty('password');
       });
       
       it('should return 400 for invalid email', async () => {
         const response = await request(app)
           .post('/api/users')
           .send({ name: 'John', email: 'invalid-email', password: 'pass' })
           .expect(400);
         
         expect(response.body.errors).toContainEqual(
           expect.objectContaining({ field: 'email', message: expect.any(String) })
         );
       });
       
       it('should return 401 without authentication token', async () => {
         await request(app)
           .post('/api/users')
           .send({ name: 'John', email: 'john@example.com' })
           .expect(401);
       });
     });
     
     describe('GET /api/users/:id', () => {
       let createdUserId: number;
       
       beforeEach(async () => {
         const user = await prisma.user.create({
           data: { name: 'Test User', email: 'test@example.com', password: 'hashed' }
         });
         createdUserId = user.id;
       });
       
       it('should return user by id', async () => {
         const response = await request(app)
           .get(`/api/users/${createdUserId}`)
           .set('Authorization', 'Bearer valid-token')
           .expect(200);
         
         expect(response.body.id).toBe(createdUserId);
         expect(response.body.name).toBe('Test User');
       });
       
       it('should return 404 for non-existent user', async () => {
         await request(app)
           .get('/api/users/99999')
           .set('Authorization', 'Bearer valid-token')
           .expect(404);
       });
     });
   });
   ```
   
   f. **Test Fixtures and Factories**: Create test data factories using libraries like fishery or custom factory functions to generate consistent test data. Create fixtures for common test scenarios (valid user data, invalid user data, admin user, regular user, expired entities). Implement database seeding functions for integration tests that create related entities and complex data scenarios. Example structure:
   ```typescript
   // tests/factories/userFactory.ts
   import { Factory } from 'fishery';
   import { User } from '@prisma/client';
   
   export const userFactory = Factory.define<User>(({ sequence }) => ({
     id: sequence,
     name: `User ${sequence}`,
     email: `user${sequence}@example.com`,
     password: 'hashed-password',
     role: 'USER',
     createdAt: new Date(),
     updatedAt: new Date()
   }));
   
   // tests/fixtures/databaseSeed.ts
   export async function seedTestDatabase(prisma: PrismaClient) {
     const admin = await prisma.user.create({
       data: userFactory.build({ role: 'ADMIN' })
     });
     
     const users = await Promise.all([
       prisma.user.create({ data: userFactory.build() }),
       prisma.user.create({ data: userFactory.build() })
     ]);
     
     return { admin, users };
   }
   ```
   
   g. **Test Coverage Requirements**: Configure Jest to enforce minimum coverage thresholds in jest.config.js with minimum 80% coverage for service classes, minimum 75% coverage for repositories, minimum 70% coverage for controllers/routers, minimum 70% overall code coverage, and 100% coverage for critical business logic functions. Generate coverage reports in HTML and JSON formats. Add coverage scripts to package.json and fail CI builds if coverage thresholds are not met.

15. **Create Environment Configuration**: Set up environment variables for backend (.env files with DATABASE_URL, PORT, JWT_SECRET, CORS_ORIGINS), create separate configurations for development, staging, and production, document all required environment variables, implement configuration validation on application startup, and provide example .env.example files.

16. **Generate API Documentation (Swagger/OpenAPI)**: 
   - Create a comprehensive OpenAPI 3.0 specification (swagger.json) for all backend endpoints
   - Document all request/response schemas with detailed field descriptions and data types
   - Include authentication requirements (JWT bearer tokens, API keys) for each endpoint
   - Document all possible HTTP status codes and error responses with example payloads
   - Provide example requests and responses for each endpoint
   - Include parameter descriptions for path variables, query parameters, and request bodies
   - Document all validation rules and constraints
   - Generate the swagger.json file in the project root directory
   - Ensure the Swagger specification is complete, valid, and matches the actual API implementation
   - Add Swagger UI integration to serve interactive API documentation at /api-docs endpoint

17. **Clean Up Empty Directories**: 
   - After generating all code and configuration files, scan the project structure for any empty directories that were pre-created but not populated
   - Remove all empty folders to maintain a clean output structure
   - Only keep directories that contain files or are required by the framework (e.g., node_modules will be created by npm install)
   - This ensures the final project structure only includes necessary directories

18. **Generate Migration Documentation**: Create comprehensive README file for backend project, document the architecture and folder structure, provide setup instructions including database setup and Prisma migrations, document all available scripts (dev, build, test, lint), create developer onboarding guide, document API endpoints and integration points, include troubleshooting guide for common issues, and provide rollback procedures and migration checklist.

19. **Create Database Migration Plan**: Generate Prisma migration files from schema, create data migration scripts if data transformations are needed, document database backup and restore procedures, test migrations on non-production environments, and provide rollback scripts for each migration.

## Validation / Exit Criteria

1. The Node.js/Express/TypeScript backend application successfully builds without TypeScript errors and all dependencies are resolved
2. The Prisma schema accurately represents the original database structure with all tables, columns, relationships, and constraints
3. All original REST API endpoints are implemented in Express with identical paths, HTTP methods, request parameters, and response formats
4. All API endpoints return correct responses with appropriate HTTP status codes for success and error cases
5. All business logic from Spring services is preserved and produces identical results in TypeScript services
6. Database operations through Prisma repositories produce identical results to original Spring Data repositories
7. All validation rules are enforced in backend (express-validator) with appropriate error messages
8. Authentication and authorization mechanisms work correctly with proper token handling and role-based access control
9. CORS configuration is properly implemented
10. Error handling middleware catches all errors and returns consistent error response formats
11. Environment configurations work correctly for development, staging, and production environments
12. Database migrations run successfully and recreate the original schema
13. All automated tests pass with adequate coverage (minimum 70% for critical business logic)
14. A complete and valid swagger.json file is generated in the project root with comprehensive API documentation for all endpoints
15. Swagger UI is accessible at /api-docs endpoint and displays all API documentation correctly
16. All empty directories have been removed from the project structure, leaving only populated folders
17. Application performance meets or exceeds original application performance metrics
18. Documentation is complete with setup instructions, architecture diagrams, and deployment procedures
19. Security best practices are followed including secure headers, input sanitization, SQL injection prevention
20. Logging and monitoring are implemented for debugging and production support
21. The backend application can be deployed independently and scale horizontally
