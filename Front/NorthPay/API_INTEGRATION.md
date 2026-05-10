# API Integration Guide - NorthPay Frontend

## Backend Response Structure

The backend uses a standardized response format for all API calls:

### Success Response
```json
{
  "ok": true,
  "code": 200,
  "message": "Operation successful",
  "data": { /* response data */ }
}
```

### Error Response
```json
{
  "ok": false,
  "code": 500,
  "message": "Error message",
  "error": true,
  "details": "Additional error details"
}
```

## Available Endpoints

### 1. Health Check
**Endpoint:** `GET /api/health`

**Purpose:** Verifies server status and database connection

**Response:**
```json
{
  "ok": true,
  "code": 200,
  "message": "Database connected",
  "data": {
    "database": {
      "now": "2026-05-10T05:30:00.000Z"
    }
  }
}
```

### 2. Admin Check
**Endpoint:** `GET /api/admin-check`

**Purpose:** Checks if the default admin user exists

**Success Response:**
```json
{
  "ok": true,
  "code": 200,
  "message": "Admin user found",
  "data": {
    "id": 1,
    "email": "admin@admin",
    "role": "admin",
    "firstname": "Admin"
  }
}
```

**Error Response (404):**
```json
{
  "ok": false,
  "code": 404,
  "message": "Admin user not found",
  "error": true,
  "details": null
}
```

## Frontend Implementation

### 1. API Service (`src/services/test.service.js`)

```javascript
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Accept': 'application/json',
  },
})

export const testService = {
  async healthCheck() {
    const response = await api.get('/health')
    return response.data
  },

  async adminCheck() {
    const response = await api.get('/admin-check')
    return response.data
  },
}
```

### 2. Custom Hooks (`src/hooks/useTestQueries.js`)

```javascript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { testService } from '../services/test.service'

// Query keys for cache management
export const testQueryKeys = {
  health: ['health'],
  adminCheck: ['adminCheck'],
}

// Health check query (auto-fetches on mount)
export function useHealthCheck() {
  return useQuery({
    queryKey: testQueryKeys.health,
    queryFn: testService.healthCheck,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Admin check mutation (triggered by button click)
export function useAdminCheck() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: testService.adminCheck,
    onSuccess: (data) => {
      queryClient.setQueryData(testQueryKeys.adminCheck, data)
    },
  })
}
```

### 3. Component Usage (`src/pages/TestPage.jsx`)

```javascript
import { useHealthCheck, useAdminCheck, testQueryKeys } from '../hooks/useTestQueries'
import { useQueryClient } from '@tanstack/react-query'

export default function TestPage() {
  const queryClient = useQueryClient()
  
  // Health check - automatically fetches
  const { data: healthData, isLoading, error } = useHealthCheck()
  
  // Admin check - manual trigger
  const { mutate: checkAdmin, isPending, data: adminData } = useAdminCheck()

  const handleAdminCheck = () => {
    queryClient.invalidateQueries({ queryKey: testQueryKeys.adminCheck })
    checkAdmin()
  }

  return (
    // Your component JSX
  )
}
```

## Environment Configuration

Create a `.env` file in the `Front/NorthPay` directory:

```env
VITE_API_URL=http://localhost:3000/api
```

## Running the Application

### 1. Start the Backend Server
```bash
cd server
npm install
npm start
```

Server will run on: `http://localhost:3000`

### 2. Start the Frontend Development Server
```bash
cd Front/NorthPay
npm install
npm run dev
```

Frontend will run on: `http://localhost:5173`

## Testing the Integration

1. Navigate to `http://localhost:5173/test`
2. The Health Check will automatically run and display the server status
3. Click "Verificar Admin" to test the admin check endpoint
4. The response will display:
   - Status (Success/Error)
   - Message from the backend
   - HTTP status code
   - Data returned by the backend
   - Any error details if applicable

## Key Features

✅ **Standardized Response Handling**: All API responses follow the same structure
✅ **TanStack Query Integration**: Automatic caching, loading states, and error handling
✅ **Type Safety**: Proper data handling with TypeScript support
✅ **Error Boundaries**: Graceful error handling with user-friendly messages
✅ **Loading States**: Visual feedback during API calls
✅ **Cache Management**: Efficient query invalidation and refetching

## Troubleshooting

### CORS Issues
If you encounter CORS errors, ensure your backend has CORS enabled. You may need to install and configure the `cors` package in the Express server.

### Connection Refused
Make sure both the backend (port 3000) and frontend (port 5173) servers are running.

### Environment Variables
Verify that the `.env` file exists and contains the correct `VITE_API_URL`.

## Next Steps

This integration pattern can be extended to other API endpoints:

1. Create service functions in `src/services/`
2. Create custom hooks in `src/hooks/`
3. Use the hooks in your components
4. Follow the same response structure handling

For authentication endpoints, you'll need to add token handling and request interceptors.