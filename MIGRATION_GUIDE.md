# Migration Guide: Client-Side Auth → API/Database

This guide will help you migrate from the current client-side authentication to a proper API/database setup.

## Current Setup (Client-Side Only)

- Authentication is handled client-side using `localStorage`
- Sample users are stored in `/src/lib/sampleUsers.ts`
- No API calls are made
- User data is stored in browser localStorage

## Migration Steps

### 1. Set Up Database

Choose your database (PostgreSQL, MongoDB, etc.) and set up:
- User table/model
- Password hashing (bcrypt)
- Session management

### 2. Update API Routes

The API routes are already created but need implementation:

#### `/src/app/api/auth/route.ts`
- ✅ Already has structure
- ⚠️ Currently uses sample users
- 🔄 Replace with database queries
- 🔄 Add JWT token generation
- 🔄 Use httpOnly cookies for tokens

#### `/src/app/api/auth/register/route.ts`
- ✅ Already has structure
- ⚠️ Currently returns mock data
- 🔄 Replace with database insert
- 🔄 Hash passwords with bcrypt
- 🔄 Validate email uniqueness

### 3. Update `useAuth` Hook

File: `/src/hooks/useAuth.ts`

**Current (Client-Side):**
```typescript
const login = async (credentials: LoginDto) => {
  // Client-side validation
  const user = findUserByEmail(credentials.email)
  // ...
}
```

**After Migration (API):**
```typescript
const login = async (credentials: LoginDto) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  })
  const data = await response.json()
  // Handle response
}
```

### 4. Update Authentication Storage

**Current:**
- User object stored in `localStorage`

**After Migration:**
- JWT token stored in httpOnly cookie (server-side)
- User data fetched from `/api/auth/me` on app load
- Remove localStorage usage

### 5. Update Middleware

File: `/src/middleware.ts`

**Current:**
- Basic route protection (commented out)

**After Migration:**
- Verify JWT token from cookies
- Check user permissions
- Redirect unauthenticated users

### 6. Environment Variables

Add to `.env.local`:
```env
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret
NEXTAUTH_SECRET=your_nextauth_secret (if using NextAuth)
```

## Files to Update

1. ✅ `/src/hooks/useAuth.ts` - Add TODO comments (already done)
2. ⚠️ `/src/app/api/auth/route.ts` - Implement database queries
3. ⚠️ `/src/app/api/auth/register/route.ts` - Implement database insert
4. ⚠️ `/src/middleware.ts` - Add JWT verification
5. ⚠️ `/src/lib/sampleUsers.ts` - Can be removed after migration

## Testing Checklist

After migration:
- [ ] Login works with database users
- [ ] Registration creates users in database
- [ ] JWT tokens are properly set in cookies
- [ ] Protected routes redirect unauthenticated users
- [ ] Logout clears session
- [ ] User data persists across page refreshes

## Sample Code Snippets

### Database Query Example (Prisma)
```typescript
// In /api/auth/login
const user = await prisma.user.findUnique({
  where: { email }
})

const isValid = await bcrypt.compare(password, user.password)
```

### JWT Token Example
```typescript
import jwt from 'jsonwebtoken'

const token = jwt.sign(
  { userId: user.id, email: user.email },
  process.env.JWT_SECRET!,
  { expiresIn: '7d' }
)

// Set in httpOnly cookie
response.cookies.set('auth_token', token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 60 * 60 * 24 * 7 // 7 days
})
```

## Notes

- Keep the current client-side setup working until API is ready
- All TODO comments mark where API integration is needed
- The structure is already in place for easy migration
- Test thoroughly after migration

