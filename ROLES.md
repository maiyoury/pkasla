# User Roles & Permissions

## Overview

This application has two user roles with different access levels and capabilities.

---

## 👤 Normal User (role: 'user')

### Purpose
Regular users who register to create and manage their own wedding events.

### Access
- ✅ **Dashboard** (`/dashbord/*`)
- ❌ **Admin Panel** (`/admin/*` - except login/register)

### Capabilities

#### Events Management
- ✅ Create new events
- ✅ View own events only
- ✅ Edit own events
- ✅ Delete own events
- ✅ Manage guests for own events

#### Guest Management
- ✅ Add guests to own events
- ✅ View guests for own events
- ✅ Edit guest information
- ✅ Remove guests from own events
- ✅ Track RSVPs for own events

#### Billing
- ✅ View own subscription
- ✅ View own payment history
- ✅ Update payment methods
- ✅ Upgrade/downgrade own plan

#### Reports
- ✅ View reports for own events
- ✅ Export own event data
- ✅ View own analytics

#### Settings
- ✅ Update own profile
- ✅ Change own password
- ✅ Manage own security settings

### Limitations
- ❌ Cannot view other users' events
- ❌ Cannot manage other users
- ❌ Cannot access system settings
- ❌ Cannot view all events in system
- ❌ Cannot access admin panel

### Registration Flow
1. User registers at `/admin/register`
2. Default role: `user` (not admin)
3. Redirected to `/dashbord`
4. Can start creating events immediately

---

## 🔐 Admin (role: 'admin')

### Purpose
Super administrators who manage the entire system, all users, and all events.

### Access
- ✅ **Admin Panel** (`/admin/*`)
- ✅ **Dashboard** (`/dashbord/*`) - Can also access user dashboard

### Capabilities

#### User Management
- ✅ View all users in system
- ✅ Create new users
- ✅ Edit user information
- ✅ Delete users
- ✅ Change user roles
- ✅ Manage user permissions

#### Events Management
- ✅ View ALL events from ALL users
- ✅ Edit any event
- ✅ Delete any event
- ✅ Manage events for any user
- ✅ View event analytics across all users

#### System Management
- ✅ Configure system settings
- ✅ Manage permissions and roles
- ✅ View system-wide analytics
- ✅ Monitor all subscriptions
- ✅ Access billing overview for all users

#### Analytics & Reports
- ✅ View system-wide statistics
- ✅ Generate reports for all users
- ✅ Export system data
- ✅ Monitor platform usage

### Admin Panel Features
- User Management (`/admin/users`)
- All Events Management (`/admin/events`)
- System Settings (`/admin/settings`)
- Permissions Management (`/admin/permissions`)
- Analytics Dashboard (`/admin/analytics`)
- Billing Overview (`/admin/billing`)

### Login Flow
1. Admin logs in at `/admin/login`
2. Redirected to `/admin` (Admin Panel)
3. Can also access `/dashbord` if needed

---

## Sample Users

### Admin Users
```
Email: admin@pkasla.com
Password: admin123
Role: admin
Access: Admin Panel + Dashboard
```

```
Email: demo@pkasla.com
Password: demo123
Role: admin
Access: Admin Panel + Dashboard
```

### Normal Users
```
Email: sarah.smith@example.com
Password: password123
Role: user
Access: Dashboard only (can create events)
```

---

## Route Protection

### Public Routes (No Auth Required)
- `/` - Landing page
- `/admin/login` - Login page
- `/admin/register` - Registration page

### User Dashboard Routes (Auth Required)
- `/dashbord` - User dashboard
- `/dashbord/event` - My events
- `/dashbord/event/[id]` - Event details
- `/dashbord/guest` - My guests
- `/dashbord/billing` - My billing
- `/dashbord/report` - My reports
- `/dashbord/setting/*` - My settings

**Access:** All authenticated users (both admin and user roles)

### Admin Panel Routes (Admin Only)
- `/admin` - Admin dashboard
- `/admin/users` - User management
- `/admin/events` - All events management
- `/admin/settings` - System settings
- `/admin/permissions` - Permissions
- `/admin/analytics` - Analytics
- `/admin/billing` - Billing overview

**Access:** Only users with `role: 'admin'`

---

## Permission Matrix

| Feature | Normal User | Admin |
|---------|------------|-------|
| Create own events | ✅ | ✅ |
| View own events | ✅ | ✅ |
| Edit own events | ✅ | ✅ |
| Delete own events | ✅ | ✅ |
| View all users' events | ❌ | ✅ |
| Edit any event | ❌ | ✅ |
| Delete any event | ❌ | ✅ |
| Manage own guests | ✅ | ✅ |
| Manage all guests | ❌ | ✅ |
| View own billing | ✅ | ✅ |
| View all billing | ❌ | ✅ |
| Manage users | ❌ | ✅ |
| System settings | ❌ | ✅ |
| View analytics | Own only | All |

---

## Summary

**Normal User:**
- Registers → Creates account → Goes to Dashboard
- Can create and manage their own wedding events
- Limited to their own data only

**Admin:**
- Has full system access
- Can manage all users and events
- Can access both Admin Panel and Dashboard
- Controls system-wide settings

