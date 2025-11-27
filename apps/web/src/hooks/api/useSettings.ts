import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/axios-client';
import toast from 'react-hot-toast';

/**
 * Query keys for settings
 */
export const settingsKeys = {
  all: ['settings'] as const,
  settings: () => [...settingsKeys.all, 'settings'] as const,
  systemInfo: () => [...settingsKeys.all, 'system-info'] as const,
};

/**
 * Settings interface matching backend
 */
export interface Settings {
  // General Settings
  siteName: string;
  siteUrl: string;
  siteDescription: string;
  maintenanceMode: boolean;
  allowRegistration: boolean;
  
  // Security Settings
  sessionTimeout: number;
  maxLoginAttempts: number;
  requireEmailVerification: boolean;
  enable2FA: boolean;
  passwordMinLength: number;
  
  // Storage Settings
  storageProvider: 'local' | 'r2';
  storageLocalPath: string;
  r2AccountId?: string;
  r2BucketName?: string;
  r2PublicUrl?: string;
  
  // Notification Settings
  emailEnabled: boolean;
  emailFrom: string;
  emailHost: string;
  emailPort: number;
  emailUser?: string;
  notificationOnUserRegistration: boolean;
  notificationOnUserStatusChange: boolean;
  
  id?: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Update settings DTO
 */
export interface UpdateSettingsDto {
  // General Settings
  siteName?: string;
  siteUrl?: string;
  siteDescription?: string;
  maintenanceMode?: boolean;
  allowRegistration?: boolean;
  
  // Security Settings
  sessionTimeout?: number;
  maxLoginAttempts?: number;
  requireEmailVerification?: boolean;
  enable2FA?: boolean;
  passwordMinLength?: number;
  
  // Storage Settings
  storageProvider?: 'local' | 'r2';
  storageLocalPath?: string;
  r2AccountId?: string;
  r2BucketName?: string;
  r2PublicUrl?: string;
  
  // Notification Settings
  emailEnabled?: boolean;
  emailFrom?: string;
  emailHost?: string;
  emailPort?: number;
  emailUser?: string;
  emailPassword?: string;
  notificationOnUserRegistration?: boolean;
  notificationOnUserStatusChange?: boolean;
}

/**
 * System information interface
 */
export interface SystemInfo {
  nodeEnv: string;
  version: string;
  uptime: number;
  maintenanceMode: boolean;
}

/**
 * Get current settings
 */
export function useSettings(includeSensitive: boolean = false) {
  return useQuery<Settings, Error>({
    queryKey: settingsKeys.settings(),
    queryFn: async (): Promise<Settings> => {
      const params = includeSensitive ? '?includeSensitive=true' : '';
      const response = await api.get<Settings>(`/admin/settings${params}`);
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch settings');
      }
      if (!response.data) {
        throw new Error('Settings data not found');
      }
      return response.data;
    },
    retry: false,
    staleTime: 1000 * 60, // 1 minute
  });
}

/**
 * Update settings mutation
 */
export function useUpdateSettings() {
  const queryClient = useQueryClient();

  return useMutation<Settings, Error, UpdateSettingsDto>({
    mutationFn: async (updateData: UpdateSettingsDto): Promise<Settings> => {
      const response = await api.patch<Settings>('/admin/settings', updateData);
      if (!response.success) {
        throw new Error(response.error || 'Failed to update settings');
      }
      if (!response.data) {
        throw new Error('Settings data not found');
      }
      return response.data;
    },
    onSuccess: () => {
      // Invalidate settings queries to refetch
      queryClient.invalidateQueries({ queryKey: settingsKeys.settings() });
      queryClient.invalidateQueries({ queryKey: settingsKeys.systemInfo() });
      toast.success('Settings updated successfully');
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to update settings');
    },
  });
}

/**
 * Get system information
 */
export function useSystemInfo() {
  return useQuery<SystemInfo, Error>({
    queryKey: settingsKeys.systemInfo(),
    queryFn: async (): Promise<SystemInfo> => {
      const response = await api.get<SystemInfo>('/admin/settings/system-info');
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch system information');
      }
      if (!response.data) {
        throw new Error('System information not found');
      }
      return response.data;
    },
    retry: false,
    staleTime: 1000 * 30, // 30 seconds
    refetchInterval: 1000 * 60, // Refetch every minute for uptime
  });
}

