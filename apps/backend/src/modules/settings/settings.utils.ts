import { settingsRepository } from './settings.repository';
import type { SettingsDocument } from './settings.model';

// Cache settings to avoid repeated database queries
let settingsCache: SettingsDocument | null = null;
let cacheTimestamp: number = 0;
const CACHE_TTL = 60000; // 1 minute cache

/**
 * Get settings with caching
 */
async function getCachedSettings(): Promise<SettingsDocument> {
  const now = Date.now();
  
  // Return cached settings if still valid
  if (settingsCache && (now - cacheTimestamp) < CACHE_TTL) {
    return settingsCache;
  }
  
  // Fetch fresh settings
  const settings = await settingsRepository.getOrCreate();
  settingsCache = settings as SettingsDocument;
  cacheTimestamp = now;
  
  return settingsCache;
}

/**
 * Clear settings cache (call after updating settings)
 */
export function clearSettingsCache() {
  settingsCache = null;
  cacheTimestamp = 0;
}

/**
 * Get a specific setting value by key
 */
export async function getSetting<K extends keyof SettingsDocument>(
  key: K
): Promise<SettingsDocument[K]> {
  const settings = await getCachedSettings();
  return settings[key];
}

/**
 * Get multiple setting values by keys
 */
export async function getSettings<K extends keyof SettingsDocument>(
  keys: K[]
): Promise<Pick<SettingsDocument, K>> {
  const settings = await getCachedSettings();
  const result = {} as Pick<SettingsDocument, K>;
  
  for (const key of keys) {
    result[key] = settings[key];
  }
  
  return result;
}

/**
 * Get all settings
 */
export async function getAllSettings(): Promise<SettingsDocument> {
  return await getCachedSettings();
}

/**
 * Check if maintenance mode is enabled
 */
export async function isMaintenanceMode(): Promise<boolean> {
  return await getSetting('maintenanceMode');
}

/**
 * Check if registration is allowed
 */
export async function isRegistrationAllowed(): Promise<boolean> {
  return await getSetting('allowRegistration');
}

/**
 * Check if email verification is required
 */
export async function isEmailVerificationRequired(): Promise<boolean> {
  return await getSetting('requireEmailVerification');
}

/**
 * Check if 2FA is enabled
 */
export async function is2FAEnabled(): Promise<boolean> {
  return await getSetting('enable2FA');
}

/**
 * Get session timeout in seconds
 */
export async function getSessionTimeout(): Promise<number> {
  return await getSetting('sessionTimeout');
}

/**
 * Get max login attempts
 */
export async function getMaxLoginAttempts(): Promise<number> {
  return await getSetting('maxLoginAttempts');
}

/**
 * Get minimum password length
 */
export async function getPasswordMinLength(): Promise<number> {
  return await getSetting('passwordMinLength');
}

/**
 * Get storage provider
 */
export async function getStorageProvider(): Promise<'local' | 'r2'> {
  return await getSetting('storageProvider');
}

/**
 * Get storage configuration
 */
export async function getStorageConfig() {
  const settings = await getCachedSettings();
  return {
    provider: settings.storageProvider,
    localPath: settings.storageLocalPath,
    r2AccountId: settings.r2AccountId,
    r2BucketName: settings.r2BucketName,
    r2PublicUrl: settings.r2PublicUrl,
  };
}

/**
 * Get email configuration
 */
export async function getEmailConfig() {
  const settings = await getCachedSettings();
  return {
    enabled: settings.emailEnabled,
    from: settings.emailFrom,
    host: settings.emailHost,
    port: settings.emailPort,
    user: settings.emailUser,
    // Note: password is sensitive and should be retrieved separately if needed
  };
}

/**
 * Get email configuration with password (for internal use)
 */
export async function getEmailConfigWithPassword() {
  const settings = await settingsRepository.getWithSensitive();
  if (!settings) {
    const defaultSettings = await settingsRepository.getOrCreate();
    return {
      enabled: defaultSettings.emailEnabled || false,
      from: defaultSettings.emailFrom || 'noreply@pkasla.com',
      host: defaultSettings.emailHost || 'smtp.example.com',
      port: defaultSettings.emailPort || 587,
      user: defaultSettings.emailUser,
      password: defaultSettings.emailPassword,
    };
  }
  return {
    enabled: settings.emailEnabled,
    from: settings.emailFrom,
    host: settings.emailHost,
    port: settings.emailPort,
    user: settings.emailUser,
    password: settings.emailPassword,
  };
}

/**
 * Check if email notifications are enabled
 */
export async function isEmailEnabled(): Promise<boolean> {
  return await getSetting('emailEnabled');
}

/**
 * Check if notification on user registration is enabled
 */
export async function shouldNotifyOnUserRegistration(): Promise<boolean> {
  return await getSetting('notificationOnUserRegistration');
}

/**
 * Check if notification on user status change is enabled
 */
export async function shouldNotifyOnUserStatusChange(): Promise<boolean> {
  return await getSetting('notificationOnUserStatusChange');
}

