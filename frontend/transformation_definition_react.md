# Spring Boot to React/Redux Frontend Migration

## Objective

Extract the frontend from Spring Boot monolithic application into a React application with Redux state management, while preserving all UI functionality and user workflows.

## Summary

This transformation extracts the frontend from Spring Boot monolithic applications into an independent React application with Redux for state management. The process involves transforming server-side templates (Thymeleaf/JSP) to React functional components with Redux integration, migrating Spring MVC routing to React Router, converting forms to React controlled components, implementing API service layers with Axios, migrating authentication and authorization to client-side, and generating comprehensive tests and documentation.

## Entry Criteria

1. Spring Boot web application with a view layer using Thymeleaf, JSP, or static HTML/JavaScript
2. Spring MVC with REST controllers for API endpoints
3. Clearly defined UI components and user workflows
4. Static resources (images, CSS, JavaScript) in Spring Boot static folder
5. Authentication and authorization patterns defined in Spring Security
6. Standard Spring Boot project structure with templates and static resources

## Implementation Steps

1. **Analyze Spring Boot Frontend Structure**: Scan the project to identify view technology (Thymeleaf/JSP/static), template files, static resources, Spring MVC routing patterns, form structures, and authentication/authorization requirements.

2. **Create React Frontend Project Structure**: Initialize a new React project with TypeScript using Create React App or Vite, install dependencies (react, react-dom, react-router-dom, redux, react-redux, @reduxjs/toolkit, axios, formik or react-hook-form, yup for validation, @types packages), create folder structure (src/components, src/pages, src/store, src/services, src/models, src/utils, src/hooks, src/styles), and configure TypeScript with strict mode.

3. **Set Up Redux Store**: Create Redux store configuration using Redux Toolkit, define slice structure mirroring application domains (user, products, orders, etc.), create slices with reducers and actions for each domain, implement async thunks for API calls using createAsyncThunk, configure store with slices and middleware, set up Redux DevTools integration, and create typed hooks (useAppDispatch, useAppSelector) for type-safe Redux usage.

4. **Convert Server-Side Templates to React Components**: For each Thymeleaf or JSP template, create a corresponding React functional component, extract HTML structure and convert to JSX (th:text to {variable}, th:if to {condition && <element>}, th:each to {array.map()}, th:href to href with template literals, JSP scriptlets to JavaScript logic, JSTL tags to equivalent JSX patterns), identify dynamic data requirements and add to component props or Redux state, convert inline event handlers to React event handlers (onclick to onClick), extract CSS classes and styles to separate CSS modules or styled-components, and add TypeScript interfaces for component props.

5. **Implement React Router**: Create routing configuration using React Router v6, map Spring MVC request mappings to React routes, implement route structure (/users/:id matching original paths), create layout components for shared UI elements (header, footer, navigation), implement nested routes for complex page hierarchies, add route guards for protected routes based on authentication state, implement 404 Not Found page, and preserve all query parameters and navigation flows.

6. **Convert Forms to React Controlled Components**: For each form in Thymeleaf/JSP, create a React form component using Formik or React Hook Form, convert form fields to controlled inputs with state management, implement client-side validation using Yup schemas matching backend validation, convert Spring form binding to form state management, implement form submission handlers that call API services, handle loading states and error messages, preserve form structure and field names to match API expectations, and implement file upload handling if needed.

7. **Create API Service Layer**: Create an Axios instance with base configuration (base URL, timeout, default headers), for each backend endpoint, create a corresponding service function in organized service files (userService.ts, productService.ts), implement proper TypeScript return types for all API calls, add request/response interceptors for authentication tokens, implement error handling with proper error types, add retry logic for failed requests where appropriate, and organize services by domain matching backend controllers.

8. **Integrate Redux with API Services**: Connect Redux async thunks to API service functions, implement loading, success, and error states for each async operation, update Redux state based on API responses, implement optimistic updates where appropriate for better UX, handle pagination, filtering, and sorting state in Redux, cache API responses in Redux state to minimize redundant calls, and implement data normalization for complex nested data structures.

9. **Migrate Authentication and Authorization**: Implement authentication flow in React (login form, token storage, automatic token refresh), store JWT tokens in httpOnly cookies or secure localStorage, add authentication status to Redux state, implement protected route components that check authentication, add Axios request interceptor to attach authentication tokens, implement logout functionality that clears tokens and Redux state, and display user information and role-based UI elements.

10. **Convert Spring MVC Models to Component State**: Identify data passed via Spring Model and ModelAndView, determine which data should be in Redux global state vs. component local state, fetch global data in Redux thunks dispatched from App component or route components, fetch component-specific data in useEffect hooks, and implement loading and error states for all data fetching.

11. **Migrate Static Resources**: Copy static assets (images, fonts, icons) from Spring Boot static folder to React public folder, update all asset references to use React public URL or imports, convert CSS files to CSS modules or styled-components, migrate JavaScript utility files to TypeScript, and preserve all asset paths and references.

12. **Implement Frontend Tests**: Create comprehensive test coverage for all frontend components with the following structure:
   
   a. **Redux Slice Unit Tests**: Create unit tests for each Redux slice including all reducers and async thunks. Test reducer logic for each action type (initial state, state updates, nested state updates, array operations), async thunk lifecycle (pending state, fulfilled state with data, rejected state with error), state selectors, and edge cases (empty state, maximum values, boundary conditions). Mock API calls in thunks using jest.mock(). Example structure:
   ```typescript
   // tests/store/userSlice.test.ts
   import userReducer, { 
     fetchUsers, 
     addUser, 
     selectAllUsers, 
     selectUserById 
   } from '../../src/store/userSlice';
   import * as userService from '../../src/services/userService';
   
   jest.mock('../../src/services/userService');
   
   describe('userSlice', () => {
     describe('reducers', () => {
       it('should handle initial state', () => {
         expect(userReducer(undefined, { type: 'unknown' })).toEqual({
           users: [],
           loading: false,
           error: null,
           selectedUser: null
         });
       });
       
       it('should handle addUser', () => {
         const initialState = { users: [], loading: false, error: null };
         const newUser = { id: 1, name: 'John', email: 'john@example.com' };
         
         const state = userReducer(initialState, addUser(newUser));
         
         expect(state.users).toHaveLength(1);
         expect(state.users[0]).toEqual(newUser);
       });
     });
     
     describe('async thunks', () => {
       describe('fetchUsers', () => {
         it('should set loading true on pending', () => {
           const action = { type: fetchUsers.pending.type };
           const state = userReducer({ users: [], loading: false, error: null }, action);
           
           expect(state.loading).toBe(true);
           expect(state.error).toBe(null);
         });
         
         it('should store users on fulfilled', () => {
           const users = [
             { id: 1, name: 'John', email: 'john@example.com' },
             { id: 2, name: 'Jane', email: 'jane@example.com' }
           ];
           const action = { type: fetchUsers.fulfilled.type, payload: users };
           const state = userReducer({ users: [], loading: true, error: null }, action);
           
           expect(state.loading).toBe(false);
           expect(state.users).toEqual(users);
           expect(state.error).toBe(null);
         });
         
         it('should set error on rejected', () => {
           const error = 'Failed to fetch users';
           const action = { type: fetchUsers.rejected.type, error: { message: error } };
           const state = userReducer({ users: [], loading: true, error: null }, action);
           
           expect(state.loading).toBe(false);
           expect(state.error).toBe(error);
         });
       });
     });
     
     describe('selectors', () => {
       it('should select all users', () => {
         const users = [{ id: 1, name: 'John' }];
         const state = { user: { users, loading: false, error: null } };
         
         expect(selectAllUsers(state)).toEqual(users);
       });
       
       it('should select user by id', () => {
         const users = [
           { id: 1, name: 'John' },
           { id: 2, name: 'Jane' }
         ];
         const state = { user: { users, loading: false, error: null } };
         
         expect(selectUserById(state, 2)).toEqual({ id: 2, name: 'Jane' });
       });
     });
   });
   ```
   
   b. **API Service Unit Tests**: Create unit tests for all API service functions with mocked Axios. Mock axios using jest.mock('axios') or create axios mock instance. Test successful API calls with correct parameters and return values, error handling for network errors, error handling for API errors (4xx, 5xx), request configuration (headers, query parameters, body), response data transformation, authentication token inclusion, and retry logic if implemented. Example structure:
   ```typescript
   // tests/services/userService.test.ts
   import axios from 'axios';
   import { getUsers, getUserById, createUser, updateUser, deleteUser } from '../../src/services/userService';
   
   jest.mock('axios');
   const mockedAxios = axios as jest.Mocked<typeof axios>;
   
   describe('userService', () => {
     beforeEach(() => {
       jest.clearAllMocks();
     });
     
     describe('getUsers', () => {
       it('should fetch users successfully', async () => {
         const mockUsers = [
           { id: 1, name: 'John', email: 'john@example.com' },
           { id: 2, name: 'Jane', email: 'jane@example.com' }
         ];
         mockedAxios.get.mockResolvedValue({ data: mockUsers });
         
         const result = await getUsers();
         
         expect(result).toEqual(mockUsers);
         expect(mockedAxios.get).toHaveBeenCalledWith('/api/users');
       });
       
       it('should handle API errors', async () => {
         const errorMessage = 'Network Error';
         mockedAxios.get.mockRejectedValue(new Error(errorMessage));
         
         await expect(getUsers()).rejects.toThrow(errorMessage);
       });
     });
     
     describe('createUser', () => {
       it('should create user with correct data', async () => {
         const newUser = { name: 'John', email: 'john@example.com', password: 'pass123' };
         const createdUser = { id: 1, ...newUser };
         mockedAxios.post.mockResolvedValue({ data: createdUser });
         
         const result = await createUser(newUser);
         
         expect(result).toEqual(createdUser);
         expect(mockedAxios.post).toHaveBeenCalledWith('/api/users', newUser);
       });
     });
   });
   ```
   
   c. **Component Unit Tests**: Create unit tests for all React components using React Testing Library and Jest. Test component rendering with different props, conditional rendering based on props or state, user interactions (clicks, typing, form submissions), event handler calls, error states and error boundaries, loading states, empty states, accessibility (ARIA attributes, keyboard navigation), and component cleanup. Use screen queries (getByRole, getByLabelText, getByText) and user-event library for interactions. Example structure:
   ```typescript
   // tests/components/UserList.test.tsx
   import { render, screen, waitFor } from '@testing-library/react';
   import userEvent from '@testing-library/user-event';
   import { Provider } from 'react-redux';
   import { configureStore } from '@reduxjs/toolkit';
   import UserList from '../../src/components/UserList';
   import userReducer from '../../src/store/userSlice';
   
   describe('UserList', () => {
     let store: any;
     
     beforeEach(() => {
       store = configureStore({
         reducer: { user: userReducer }
       });
     });
     
     it('should render loading state', () => {
       store = configureStore({
         reducer: { user: userReducer },
         preloadedState: { user: { users: [], loading: true, error: null } }
       });
       
       render(
         <Provider store={store}>
           <UserList />
         </Provider>
       );
       
       expect(screen.getByText(/loading/i)).toBeInTheDocument();
     });
     
     it('should render user list', () => {
       const users = [
         { id: 1, name: 'John', email: 'john@example.com' },
         { id: 2, name: 'Jane', email: 'jane@example.com' }
       ];
       store = configureStore({
         reducer: { user: userReducer },
         preloadedState: { user: { users, loading: false, error: null } }
       });
       
       render(
         <Provider store={store}>
           <UserList />
         </Provider>
       );
       
       expect(screen.getByText('John')).toBeInTheDocument();
       expect(screen.getByText('Jane')).toBeInTheDocument();
       expect(screen.getByText('john@example.com')).toBeInTheDocument();
     });
     
     it('should handle user click', async () => {
       const handleUserClick = jest.fn();
       const users = [{ id: 1, name: 'John', email: 'john@example.com' }];
       store = configureStore({
         reducer: { user: userReducer },
         preloadedState: { user: { users, loading: false, error: null } }
       });
       
       render(
         <Provider store={store}>
           <UserList onUserClick={handleUserClick} />
         </Provider>
       );
       
       await userEvent.click(screen.getByText('John'));
       
       expect(handleUserClick).toHaveBeenCalledWith(1);
     });
     
     it('should render error state', () => {
       const errorMessage = 'Failed to load users';
       store = configureStore({
         reducer: { user: userReducer },
         preloadedState: { user: { users: [], loading: false, error: errorMessage } }
       });
       
       render(
         <Provider store={store}>
           <UserList />
         </Provider>
       );
       
       expect(screen.getByText(errorMessage)).toBeInTheDocument();
     });
   });
   ```
   
   d. **Form Validation Tests**: Create comprehensive tests for all form components and validation logic. Test form field rendering, input value changes, form submission with valid data, validation errors for invalid data (required fields, email format, password strength, minimum/maximum length, custom validators), error message display, field-level validation triggers, form-level validation on submit, disabled submit button during validation, form reset functionality, and initial values population for edit forms. Example structure:
   ```typescript
   // tests/components/UserForm.test.tsx
   import { render, screen, waitFor } from '@testing-library/react';
   import userEvent from '@testing-library/user-event';
   import UserForm from '../../src/components/UserForm';
   
   describe('UserForm', () => {
     it('should render all form fields', () => {
       render(<UserForm onSubmit={jest.fn()} />);
       
       expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
       expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
       expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
       expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
     });
     
     it('should show validation errors for empty fields', async () => {
       render(<UserForm onSubmit={jest.fn()} />);
       
       await userEvent.click(screen.getByRole('button', { name: /submit/i }));
       
       expect(await screen.findByText(/name is required/i)).toBeInTheDocument();
       expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
     });
     
     it('should show error for invalid email', async () => {
       render(<UserForm onSubmit={jest.fn()} />);
       
       await userEvent.type(screen.getByLabelText(/email/i), 'invalid-email');
       await userEvent.click(screen.getByRole('button', { name: /submit/i }));
       
       expect(await screen.findByText(/invalid email/i)).toBeInTheDocument();
     });
     
     it('should submit form with valid data', async () => {
       const handleSubmit = jest.fn();
       render(<UserForm onSubmit={handleSubmit} />);
       
       await userEvent.type(screen.getByLabelText(/name/i), 'John Doe');
       await userEvent.type(screen.getByLabelText(/email/i), 'john@example.com');
       await userEvent.type(screen.getByLabelText(/password/i), 'SecurePass123!');
       await userEvent.click(screen.getByRole('button', { name: /submit/i }));
       
       await waitFor(() => {
         expect(handleSubmit).toHaveBeenCalledWith({
           name: 'John Doe',
           email: 'john@example.com',
           password: 'SecurePass123!'
         });
       });
     });
     
     it('should disable submit button during submission', async () => {
       const handleSubmit = jest.fn().mockResolvedValue(new Promise(resolve => setTimeout(resolve, 100)));
       render(<UserForm onSubmit={handleSubmit} />);
       
       await userEvent.type(screen.getByLabelText(/name/i), 'John');
       await userEvent.type(screen.getByLabelText(/email/i), 'john@example.com');
       await userEvent.click(screen.getByRole('button', { name: /submit/i }));
       
       expect(screen.getByRole('button', { name: /submit/i })).toBeDisabled();
     });
   });
   ```
   
   e. **Custom Hooks Tests**: Create unit tests for all custom React hooks using @testing-library/react-hooks or by creating test components. Test hook return values, state updates, effect triggers, cleanup functions, dependency changes, error handling, and edge cases. Example structure:
   ```typescript
   // tests/hooks/useUser.test.ts
   import { renderHook, waitFor } from '@testing-library/react';
   import { Provider } from 'react-redux';
   import { configureStore } from '@reduxjs/toolkit';
   import useUser from '../../src/hooks/useUser';
   import userReducer from '../../src/store/userSlice';
   import * as userService from '../../src/services/userService';
   
   jest.mock('../../src/services/userService');
   
   describe('useUser', () => {
     let store: any;
     
     beforeEach(() => {
       store = configureStore({
         reducer: { user: userReducer }
       });
     });
     
     it('should fetch user on mount', async () => {
       const mockUser = { id: 1, name: 'John', email: 'john@example.com' };
       (userService.getUserById as jest.Mock).mockResolvedValue(mockUser);
       
       const wrapper = ({ children }: any) => <Provider store={store}>{children}</Provider>;
       const { result } = renderHook(() => useUser(1), { wrapper });
       
       expect(result.current.loading).toBe(true);
       
       await waitFor(() => {
         expect(result.current.loading).toBe(false);
         expect(result.current.user).toEqual(mockUser);
       });
     });
     
     it('should handle fetch error', async () => {
       (userService.getUserById as jest.Mock).mockRejectedValue(new Error('Not found'));
       
       const wrapper = ({ children }: any) => <Provider store={store}>{children}</Provider>;
       const { result } = renderHook(() => useUser(999), { wrapper });
       
       await waitFor(() => {
         expect(result.current.loading).toBe(false);
         expect(result.current.error).toBe('Not found');
       });
     });
   });
   ```
   
   f. **Integration Tests for User Workflows**: Create end-to-end integration tests for complete user workflows using React Testing Library. Test multi-step processes (registration, login, profile update, checkout), navigation between pages, data persistence across navigation, authentication flows, form submission with API calls, error handling in workflows, success notifications, and state management throughout the workflow. Mock API responses using MSW (Mock Service Worker) for realistic testing. Example structure:
   ```typescript
   // tests/integration/userRegistration.test.tsx
   import { render, screen, waitFor } from '@testing-library/react';
   import userEvent from '@testing-library/user-event';
   import { Provider } from 'react-redux';
   import { BrowserRouter } from 'react-router-dom';
   import { setupServer } from 'msw/node';
   import { rest } from 'msw';
   import App from '../../src/App';
   import store from '../../src/store';
   
   const server = setupServer(
     rest.post('/api/users', (req, res, ctx) => {
       return res(ctx.json({ id: 1, name: 'John Doe', email: 'john@example.com' }));
     })
   );
   
   beforeAll(() => server.listen());
   afterEach(() => server.resetHandlers());
   afterAll(() => server.close());
   
   describe('User Registration Flow', () => {
     it('should complete registration workflow', async () => {
       render(
         <Provider store={store}>
           <BrowserRouter>
             <App />
           </BrowserRouter>
         </Provider>
       );
       
       // Navigate to registration page
       await userEvent.click(screen.getByRole('link', { name: /register/i }));
       expect(screen.getByRole('heading', { name: /register/i })).toBeInTheDocument();
       
       // Fill out registration form
       await userEvent.type(screen.getByLabelText(/name/i), 'John Doe');
       await userEvent.type(screen.getByLabelText(/email/i), 'john@example.com');
       await userEvent.type(screen.getByLabelText(/password/i), 'SecurePass123!');
       
       // Submit form
       await userEvent.click(screen.getByRole('button', { name: /register/i }));
       
       // Verify success message and redirect
       await waitFor(() => {
         expect(screen.getByText(/registration successful/i)).toBeInTheDocument();
       });
       
       // Should redirect to dashboard
       await waitFor(() => {
         expect(screen.getByRole('heading', { name: /dashboard/i })).toBeInTheDocument();
       });
     });
   });
   ```
   
   g. **Router and Navigation Tests**: Create tests for React Router configuration and navigation logic. Test route rendering for all paths, protected routes redirect to login, 404 page for invalid routes, nested route rendering, route parameters extraction, navigation using links and programmatic navigation, browser back/forward buttons, and query parameters handling. Example structure:
   ```typescript
   // tests/routing/AppRouter.test.tsx
   import { render, screen } from '@testing-library/react';
   import userEvent from '@testing-library/user-event';
   import { Provider } from 'react-redux';
   import { MemoryRouter } from 'react-router-dom';
   import { configureStore } from '@reduxjs/toolkit';
   import AppRouter from '../../src/routing/AppRouter';
   import authReducer from '../../src/store/authSlice';
   
   describe('AppRouter', () => {
     it('should render home page on root path', () => {
       const store = configureStore({ reducer: { auth: authReducer } });
       
       render(
         <Provider store={store}>
           <MemoryRouter initialEntries={['/']}>
             <AppRouter />
           </MemoryRouter>
         </Provider>
       );
       
       expect(screen.getByRole('heading', { name: /home/i })).toBeInTheDocument();
     });
     
     it('should redirect to login for protected routes', () => {
       const store = configureStore({
         reducer: { auth: authReducer },
         preloadedState: { auth: { isAuthenticated: false, user: null } }
       });
       
       render(
         <Provider store={store}>
           <MemoryRouter initialEntries={['/dashboard']}>
             <AppRouter />
           </MemoryRouter>
         </Provider>
       );
       
       expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
     });
     
     it('should render 404 page for invalid routes', () => {
       const store = configureStore({ reducer: { auth: authReducer } });
       
       render(
         <Provider store={store}>
           <MemoryRouter initialEntries={['/invalid-route']}>
             <AppRouter />
           </MemoryRouter>
         </Provider>
       );
       
       expect(screen.getByText(/404/i)).toBeInTheDocument();
       expect(screen.getByText(/page not found/i)).toBeInTheDocument();
     });
   });
   ```
   
   h. **Test Coverage Requirements**: Configure Jest to enforce minimum coverage thresholds in jest.config.js with minimum 70% coverage for React components, minimum 75% coverage for Redux slices, minimum 80% coverage for custom hooks, minimum 70% coverage for utility functions, minimum 65% overall frontend code coverage, and 100% coverage for critical user workflows. Generate coverage reports in HTML and lcov formats. Add coverage scripts to package.json and fail CI builds if coverage thresholds are not met. Configure coverage collection to exclude test files, configuration files, and type definition files.

13. **Create Environment Configuration**: Set up environment variables for frontend (.env files with REACT_APP_API_URL or VITE_API_URL), create separate configurations for development, staging, and production, document all required environment variables, implement configuration validation on application startup, and provide example .env.example files.

14. **Create Deployment Configuration**: Create Dockerfile for frontend React application with nginx serving, create docker-compose.yml for local development with frontend service, create Kubernetes manifests or cloud provider configurations if needed, document deployment process and infrastructure requirements, and create CI/CD pipeline configurations for automated testing and deployment.

15. **Generate Migration Documentation**: Create comprehensive README file for frontend project, document the architecture and folder structure, provide setup instructions including environment setup and dependencies, document all available scripts (dev, build, test, lint), create developer onboarding guide, document component structure and state management patterns, include troubleshooting guide for common issues, and provide rollback procedures and migration checklist.

## Validation / Exit Criteria

1. The React frontend application successfully builds without TypeScript errors and all dependencies are resolved
2. All React components render correctly with proper data binding and no console errors
3. React Router navigation matches original application routing with all paths and parameters preserved
4. Redux state management correctly handles all application state with proper loading and error states
5. All forms submit successfully to backend APIs with proper validation and error handling
6. Frontend successfully retrieves and displays all data from backend APIs with proper loading states
7. Authentication and authorization mechanisms work correctly with proper token handling
8. All file uploads, downloads, and binary data operations work correctly if present in original application
9. Environment configurations work correctly for development, staging, and production environments
10. All automated tests pass with adequate coverage (minimum 65% overall frontend code coverage)
11. Docker containers build and run successfully for frontend
12. Application performance meets or exceeds original application performance metrics
13. All static resources (images, CSS, fonts) are accessible and display correctly
14. Documentation is complete with setup instructions, architecture diagrams, and deployment procedures
15. Security best practices are followed including XSS protection and secure token storage
16. The frontend application can be deployed independently and scale horizontally
17. All user workflows from the original application function correctly in the new architecture
18. Stakeholders have reviewed and accepted the migrated frontend as functionally equivalent to the original
