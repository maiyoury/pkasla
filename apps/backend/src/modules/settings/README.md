# Settings Module

This module provides system-wide settings management with utilities and middleware for easy access and validation.

## Features

- **Cached Settings**: Settings are cached for 1 minute to reduce database queries
- **Type-Safe Access**: Get settings by key with full TypeScript support
- **Middleware**: Ready-to-use middleware for common checks
- **Auto Cache Invalidation**: Cache is cleared automatically when settings are updated

## Usage Examples

### Getting Settings by Key

```typescript
import { getSetting, getAllSettings, getSettings } from '@/modules/settings';

// Get a single setting
const maintenanceMode = await getSetting('maintenanceMode');
const sessionTimeout = await getSetting('sessionTimeout');

// Get multiple settings
const securitySettings = await getSettings([
  'sessionTimeout',
  'maxLoginAttempts',
  'passwordMinLength'
]);

// Get all settings
const allSettings = await getAllSettings();
```

### Using Helper Functions

```typescript
import {
  isMaintenanceMode,
  isRegistrationAllowed,
  getSessionTimeout,
  getStorageConfig,
  getEmailConfig,
} from '@/modules/settings';

// Check maintenance mode
if (await isMaintenanceMode()) {
  // Handle maintenance mode
}

// Check if registration is allowed
if (!await isRegistrationAllowed()) {
  throw new Error('Registration is disabled');
}

// Get session timeout
const timeout = await getSessionTimeout();

// Get storage configuration
const storage = await getStorageConfig();
// Returns: { provider, localPath, r2AccountId, r2BucketName, r2PublicUrl }

// Get email configuration
const email = await getEmailConfig();
// Returns: { enabled, from, host, port, user }
```

### Using Middleware

```typescript
import { Router } from 'express';
import {
  checkMaintenanceMode,
  checkRegistrationAllowed,
  checkSetting,
} from '@/common/middlewares/check-settings';

const router = Router();

// Check maintenance mode (admins can bypass)
router.use(checkMaintenanceMode);

// Check if registration is allowed
router.post('/register', checkRegistrationAllowed, registerHandler);

// Check any setting value
router.post('/action', checkSetting('allowRegistration', true), actionHandler);
```

### In Service Layer

```typescript
import {
  getPasswordMinLength,
  getMaxLoginAttempts,
  isEmailVerificationRequired,
} from '@/modules/settings';

export async function validatePassword(password: string) {
  const minLength = await getPasswordMinLength();
  if (password.length < minLength) {
    throw new Error(`Password must be at least ${minLength} characters`);
  }
}

export async function checkLoginAttempts(userId: string) {
  const maxAttempts = await getMaxLoginAttempts();
  // Check attempts against maxAttempts
}

export async function shouldVerifyEmail() {
  return await isEmailVerificationRequired();
}
```

### Manual Cache Invalidation

```typescript
import { clearSettingsCache } from '@/modules/settings';

// Clear cache manually (usually not needed as it's done automatically)
clearSettingsCache();
```

## Available Helper Functions

### Boolean Checks
- `isMaintenanceMode()` - Check if maintenance mode is enabled
- `isRegistrationAllowed()` - Check if registration is allowed
- `isEmailVerificationRequired()` - Check if email verification is required
- `is2FAEnabled()` - Check if 2FA is enabled
- `isEmailEnabled()` - Check if email is enabled
- `shouldNotifyOnUserRegistration()` - Check notification preference
- `shouldNotifyOnUserStatusChange()` - Check notification preference

### Value Getters
- `getSessionTimeout()` - Get session timeout in seconds
- `getMaxLoginAttempts()` - Get max login attempts
- `getPasswordMinLength()` - Get minimum password length
- `getStorageProvider()` - Get storage provider ('local' | 'r2')

### Configuration Getters
- `getStorageConfig()` - Get complete storage configuration
- `getEmailConfig()` - Get email configuration (without password)
- `getEmailConfigWithPassword()` - Get email configuration (with password, for internal use)

## Middleware

### `checkMaintenanceMode`
Checks if maintenance mode is enabled. Admins can bypass this check.

### `checkRegistrationAllowed`
Checks if registration is allowed. Returns 403 if disabled.

### `checkSetting(key, expectedValue, errorMessage?)`
Factory function to check any setting value.

### `checkEmailVerificationRequired`
Attaches `requireEmailVerification` to the request object for use in controllers/services.

## API Endpoints

```
GET    /admin/settings              - Get current settings
PUT    /admin/settings              - Update settings (full)
PATCH  /admin/settings              - Update settings (partial)
GET    /admin/settings/system-info  - Get system information
```

All endpoints require admin authentication.

