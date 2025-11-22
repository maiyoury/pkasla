# Application Architecture

## Overview

This application has two main access levels:

### 1. Admin Panel (`/admin/*`)
**Purpose:** Super admin controls everything in the system

**Access:** Only users with `role: 'admin'`

**Features:**
- User Management (view, edit, delete all users)
- All Events Management (view and manage events from all users)
- System Settings (configure system-wide settings)
- Permissions Management (manage roles and access control)
- Analytics (system-wide reports and statistics)
- Billing Overview (monitor all subscriptions)

**Routes:**
- `/admin` - Admin dashboard
- `/admin/login` - Login page (shared with users)
- `/admin/register` - Registration page
- `/admin/users` - User management
- `/admin/events` - All events management
- `/admin/settings` - System settings
- `/admin/permissions` - Permissions management
- `/admin/analytics` - Analytics dashboard
- `/admin/billing` - Billing overview

### 2. User Dashboard (`/dashbord/*`)
**Purpose:** Regular users manage their own events

**Access:** All authenticated users (both `admin` and `user` roles)

**Features:**
- My Events (create, update, delete own events)
- My Guests (manage guests for own events)
- My Billing (personal subscription and payments)
- My Reports (reports for own events)
- Settings (personal profile and security)

**Routes:**
- `/dashbord` - User dashboard
- `/dashbord/event` - My events list
- `/dashbord/event/[id]` - Event detail (own events only)
- `/dashbord/guest` - My guests
- `/dashbord/billing` - My billing
- `/dashbord/report` - My reports
- `/dashbord/setting/profile` - Profile settings
- `/dashbord/setting/security` - Security settings

## Authentication Flow

1. **Login** (`/admin/login`)
   - All users (admin and regular) login here
   - After login, redirects based on role:
     - `admin` → `/admin`
     - `user` → `/dashbord`

2. **Registration** (`/admin/register`)
   - New users register here
   - Default role: `user` (not admin)
   - After registration → `/dashbord`

3. **Route Protection**
   - `/admin/*` - Only accessible by `admin` role
   - `/dashbord/*` - Accessible by all authenticated users

## User Roles

### Admin (`role: 'admin'`)
- Full system access
- Can manage all users
- Can view/edit all events
- Can access admin panel
- Can also access user dashboard

### User (`role: 'user'`)
- Can only manage own events
- Can only view own data
- Can access user dashboard
- Cannot access admin panel

## Sample Users

### Admin Users
- `admin@pkasla.com` / `admin123` → Admin Panel
- `demo@pkasla.com` / `demo123` → Admin Panel
- `john.doe@example.com` / `password123` → Admin Panel

### Regular Users
- `sarah.smith@example.com` / `password123` → User Dashboard

## Future API Integration

When database/API is ready:
- Admin can manage users via API
- Users can only access their own events via API
- Role-based access control enforced server-side
- Events filtered by `userId` for regular users
- Admin can query all events without user filter

