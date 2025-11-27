'use client'

import React, { useState, useEffect } from 'react'
import {
  Settings,
  Shield,
  Database,
  Bell,
  Info,
  Save,
  Loader2,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { useSettings, useUpdateSettings, useSystemInfo, type Settings as SettingsType } from '@/hooks/api/useSettings'

// Helper to format uptime
const formatUptime = (seconds: number): string => {
  const days = Math.floor(seconds / 86400)
  const hours = Math.floor((seconds % 86400) / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  
  if (days > 0) {
    return `${days} day${days !== 1 ? 's' : ''} ${hours} hour${hours !== 1 ? 's' : ''}`
  }
  if (hours > 0) {
    return `${hours} hour${hours !== 1 ? 's' : ''} ${minutes} minute${minutes !== 1 ? 's' : ''}`
  }
  return `${minutes} minute${minutes !== 1 ? 's' : ''}`
}

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState('general')
  
  // Fetch settings from API
  const { data: settings, isLoading: isLoadingSettings, error: settingsError } = useSettings()
  const { data: systemInfo } = useSystemInfo()
  const updateSettingsMutation = useUpdateSettings()

  // Local state for form (will be synced with API data)
  const [formData, setFormData] = useState<Partial<SettingsType>>({})

  // Sync form data when settings are loaded
  useEffect(() => {
    if (settings) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData(settings)
    }
  }, [settings])

  const handleInputChange = (
    field: keyof SettingsType,
    value: string | number | boolean | undefined
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSave = async () => {
    try {
      await updateSettingsMutation.mutateAsync(formData)
    } catch (error) {
      // Error is handled by the mutation's onError callback
      console.error('Failed to save settings:', error)
    }
  }

  const handleReset = () => {
    if (settings) {
      setFormData(settings)
    }
  }

  // Show loading state
  if (isLoadingSettings) {
    return (
      <div>
        <div className="mb-6 md:mb-8">
          <h1 className="text-xl md:text-2xl font-semibold text-black">
            System Settings
          </h1>
          <p className="text-xs text-gray-600 mt-1">
            Configure system-wide settings and preferences
          </p>
        </div>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          <span className="ml-2 text-xs text-gray-600">Loading settings...</span>
        </div>
      </div>
    )
  }

  // Show error state
  if (settingsError) {
    return (
      <div>
        <div className="mb-6 md:mb-8">
          <h1 className="text-xl md:text-2xl font-semibold text-black">
            System Settings
          </h1>
          <p className="text-xs text-gray-600 mt-1">
            Configure system-wide settings and preferences
          </p>
        </div>
        <Card className="border border-gray-200">
          <CardContent className="py-12">
            <div className="text-center">
              <p className="text-xs text-red-600 mb-4">
                {settingsError instanceof Error
                  ? settingsError.message
                  : 'Failed to load settings'}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.reload()}
                className="text-xs h-8"
              >
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Use formData with fallback to empty values
  const currentSettings = formData || {}

  return (
    <div>
      <div className="mb-6 md:mb-8">
        <h1 className="text-xl md:text-2xl font-semibold text-black">
          System Settings
        </h1>
        <p className="text-xs text-gray-600 mt-1">
          Configure system-wide settings and preferences
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general" className="text-xs">
            <Settings className="h-3 w-3 mr-1" />
            General
          </TabsTrigger>
          <TabsTrigger value="security" className="text-xs">
            <Shield className="h-3 w-3 mr-1" />
            Security
          </TabsTrigger>
          <TabsTrigger value="storage" className="text-xs">
            <Database className="h-3 w-3 mr-1" />
            Storage
          </TabsTrigger>
          <TabsTrigger value="notifications" className="text-xs">
            <Bell className="h-3 w-3 mr-1" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="system" className="text-xs">
            <Info className="h-3 w-3 mr-1" />
            System
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-4">
          <Card className="border border-gray-200">
            <CardHeader>
              <CardTitle className="text-sm font-semibold text-black">
                General Settings
              </CardTitle>
              <CardDescription className="text-xs">
                Configure basic site information and general preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="siteName" className="text-xs font-medium">
                  Site Name
                </Label>
                <Input
                  id="siteName"
                  value={currentSettings.siteName || ''}
                  onChange={(e) => handleInputChange('siteName', e.target.value)}
                  className="text-xs"
                  placeholder="Enter site name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="siteUrl" className="text-xs font-medium">
                  Site URL
                </Label>
                <Input
                  id="siteUrl"
                  type="url"
                  value={currentSettings.siteUrl || ''}
                  onChange={(e) => handleInputChange('siteUrl', e.target.value)}
                  className="text-xs"
                  placeholder="https://example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="siteDescription" className="text-xs font-medium">
                  Site Description
                </Label>
                <Input
                  id="siteDescription"
                  value={currentSettings.siteDescription || ''}
                  onChange={(e) =>
                    handleInputChange('siteDescription', e.target.value)
                  }
                  className="text-xs"
                  placeholder="Enter site description"
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="maintenanceMode" className="text-xs font-medium">
                    Maintenance Mode
                  </Label>
                  <p className="text-xs text-gray-500">
                    Enable to put the site in maintenance mode
                  </p>
                </div>
                <Switch
                  id="maintenanceMode"
                  checked={currentSettings.maintenanceMode}
                  onCheckedChange={(checked) =>
                    handleInputChange('maintenanceMode', checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="allowRegistration" className="text-xs font-medium">
                    Allow Registration
                  </Label>
                  <p className="text-xs text-gray-500">
                    Allow new users to register
                  </p>
                </div>
                <Switch
                  id="allowRegistration"
                  checked={currentSettings.allowRegistration}
                  onCheckedChange={(checked) =>
                    handleInputChange('allowRegistration', checked)
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-4">
          <Card className="border border-gray-200">
            <CardHeader>
              <CardTitle className="text-sm font-semibold text-black">
                Security Settings
              </CardTitle>
              <CardDescription className="text-xs">
                Configure security and authentication settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="sessionTimeout" className="text-xs font-medium">
                  Session Timeout (seconds)
                </Label>
                <Input
                  id="sessionTimeout"
                  type="number"
                  value={currentSettings.sessionTimeout?.toString() || ''}
                  onChange={(e) =>
                    handleInputChange('sessionTimeout', parseInt(e.target.value) || 0)
                  }
                  className="text-xs"
                  min={300}
                  max={86400}
                />
                <p className="text-xs text-gray-500">
                  Session will expire after this many seconds of inactivity
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxLoginAttempts" className="text-xs font-medium">
                  Max Login Attempts
                </Label>
                <Input
                  id="maxLoginAttempts"
                  type="number"
                  value={currentSettings.maxLoginAttempts?.toString() || ''}
                  onChange={(e) =>
                    handleInputChange('maxLoginAttempts', parseInt(e.target.value) || 0)
                  }
                  className="text-xs"
                  min={3}
                  max={10}
                />
                <p className="text-xs text-gray-500">
                  Maximum failed login attempts before account lockout
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="passwordMinLength" className="text-xs font-medium">
                  Minimum Password Length
                </Label>
                <Input
                  id="passwordMinLength"
                  type="number"
                  value={currentSettings.passwordMinLength?.toString() || ''}
                  onChange={(e) =>
                    handleInputChange('passwordMinLength', parseInt(e.target.value) || 0)
                  }
                  className="text-xs"
                  min={6}
                  max={32}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="requireEmailVerification" className="text-xs font-medium">
                    Require Email Verification
                  </Label>
                  <p className="text-xs text-gray-500">
                    Require users to verify their email before accessing the system
                  </p>
                </div>
                <Switch
                  id="requireEmailVerification"
                  checked={currentSettings.requireEmailVerification}
                  onCheckedChange={(checked) =>
                    handleInputChange('requireEmailVerification', checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="enable2FA" className="text-xs font-medium">
                    Enable Two-Factor Authentication
                  </Label>
                  <p className="text-xs text-gray-500">
                    Allow users to enable 2FA for additional security
                  </p>
                </div>
                <Switch
                  id="enable2FA"
                  checked={currentSettings.enable2FA}
                  onCheckedChange={(checked) =>
                    handleInputChange('enable2FA', checked)
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Storage Settings */}
        <TabsContent value="storage" className="space-y-4">
          <Card className="border border-gray-200">
            <CardHeader>
              <CardTitle className="text-sm font-semibold text-black">
                Storage Settings
              </CardTitle>
              <CardDescription className="text-xs">
                Configure file storage provider and settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="storageProvider" className="text-xs font-medium">
                  Storage Provider
                </Label>
                <Select
                  value={currentSettings.storageProvider || 'local'}
                  onValueChange={(value) =>
                    handleInputChange('storageProvider', value as 'local' | 'r2')
                  }
                >
                  <SelectTrigger className="text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="local">Local Storage</SelectItem>
                    <SelectItem value="r2">Cloudflare R2</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {currentSettings.storageProvider === 'local' && (
                <div className="space-y-2">
                  <Label htmlFor="storageLocalPath" className="text-xs font-medium">
                    Local Storage Path
                  </Label>
                  <Input
                    id="storageLocalPath"
                    value={currentSettings.storageLocalPath || ''}
                    onChange={(e) =>
                      handleInputChange('storageLocalPath', e.target.value)
                    }
                    className="text-xs"
                    placeholder="uploads"
                  />
                </div>
              )}

              {currentSettings.storageProvider === 'r2' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="r2AccountId" className="text-xs font-medium">
                      R2 Account ID
                    </Label>
                    <Input
                      id="r2AccountId"
                      value={currentSettings.r2AccountId || ''}
                      onChange={(e) =>
                        handleInputChange('r2AccountId', e.target.value)
                      }
                      className="text-xs"
                      placeholder="Enter R2 account ID"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="r2BucketName" className="text-xs font-medium">
                      R2 Bucket Name
                    </Label>
                    <Input
                      id="r2BucketName"
                      value={currentSettings.r2BucketName || ''}
                      onChange={(e) =>
                        handleInputChange('r2BucketName', e.target.value)
                      }
                      className="text-xs"
                      placeholder="Enter bucket name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="r2PublicUrl" className="text-xs font-medium">
                      R2 Public URL (Optional)
                    </Label>
                    <Input
                      id="r2PublicUrl"
                      type="url"
                      value={currentSettings.r2PublicUrl || ''}
                      onChange={(e) =>
                        handleInputChange('r2PublicUrl', e.target.value)
                      }
                      className="text-xs"
                      placeholder="https://your-bucket.your-domain.com"
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications" className="space-y-4">
          <Card className="border border-gray-200">
            <CardHeader>
              <CardTitle className="text-sm font-semibold text-black">
                Email & Notification Settings
              </CardTitle>
              <CardDescription className="text-xs">
                Configure email server and notification preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="emailEnabled" className="text-xs font-medium">
                    Enable Email
                  </Label>
                  <p className="text-xs text-gray-500">
                    Enable email notifications
                  </p>
                </div>
                <Switch
                  id="emailEnabled"
                  checked={currentSettings.emailEnabled}
                  onCheckedChange={(checked) =>
                    handleInputChange('emailEnabled', checked)
                  }
                />
              </div>

              {currentSettings.emailEnabled && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <Label htmlFor="emailFrom" className="text-xs font-medium">
                      From Email Address
                    </Label>
                    <Input
                      id="emailFrom"
                      type="email"
                      value={currentSettings.emailFrom || ''}
                      onChange={(e) =>
                        handleInputChange('emailFrom', e.target.value)
                      }
                      className="text-xs"
                      placeholder="noreply@example.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="emailHost" className="text-xs font-medium">
                      SMTP Host
                    </Label>
                    <Input
                      id="emailHost"
                      value={currentSettings.emailHost || ''}
                      onChange={(e) =>
                        handleInputChange('emailHost', e.target.value)
                      }
                      className="text-xs"
                      placeholder="smtp.example.com"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="emailPort" className="text-xs font-medium">
                        SMTP Port
                      </Label>
                      <Input
                        id="emailPort"
                        type="number"
                        value={currentSettings.emailPort?.toString() || ''}
                        onChange={(e) =>
                          handleInputChange('emailPort', parseInt(e.target.value) || 587)
                        }
                        className="text-xs"
                        placeholder="587"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="emailUser" className="text-xs font-medium">
                        SMTP Username
                      </Label>
                      <Input
                        id="emailUser"
                        value={currentSettings.emailUser || ''}
                        onChange={(e) =>
                          handleInputChange('emailUser', e.target.value)
                        }
                        className="text-xs"
                        placeholder="smtp username"
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label
                        htmlFor="notificationOnUserRegistration"
                        className="text-xs font-medium"
                      >
                        Notify on User Registration
                      </Label>
                      <p className="text-xs text-gray-500">
                        Send email when a new user registers
                      </p>
                    </div>
                    <Switch
                      id="notificationOnUserRegistration"
                      checked={currentSettings.notificationOnUserRegistration}
                      onCheckedChange={(checked) =>
                        handleInputChange('notificationOnUserRegistration', checked)
                      }
                    />
        </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label
                        htmlFor="notificationOnUserStatusChange"
                        className="text-xs font-medium"
                      >
                        Notify on User Status Change
                      </Label>
                      <p className="text-xs text-gray-500">
                        Send email when user status changes
                      </p>
                    </div>
                    <Switch
                      id="notificationOnUserStatusChange"
                      checked={currentSettings.notificationOnUserStatusChange}
                      onCheckedChange={(checked) =>
                        handleInputChange('notificationOnUserStatusChange', checked)
                      }
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Info */}
        <TabsContent value="system" className="space-y-4">
        <Card className="border border-gray-200">
          <CardHeader>
              <CardTitle className="text-sm font-semibold text-black">
                System Information
              </CardTitle>
              <CardDescription className="text-xs">
                View system information and status
              </CardDescription>
          </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-gray-500">
                    Environment
                  </Label>
                  <p className="text-xs text-black font-medium">
                    {systemInfo?.nodeEnv || 'N/A'}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-medium text-gray-500">
                    Version
                  </Label>
                  <p className="text-xs text-black font-medium">
                    {systemInfo?.version || 'N/A'}
                  </p>
                </div>

                <div className="space-y-2 col-span-2">
                  <Label className="text-xs font-medium text-gray-500">
                    Uptime
                  </Label>
                  <p className="text-xs text-black font-medium">
                    {systemInfo?.uptime ? formatUptime(systemInfo.uptime) : 'N/A'}
                  </p>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label className="text-xs font-medium text-gray-500">
                  System Status
                </Label>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <p className="text-xs text-black font-medium">All systems operational</p>
                </div>
              </div>
          </CardContent>
        </Card>
        </TabsContent>

        {/* Save Button */}
        <div className="flex justify-end gap-2 pt-4 border-t border-gray-200">
          <Button
            variant="outline"
            onClick={handleReset}
            className="text-xs h-8"
            disabled={updateSettingsMutation.isPending}
          >
            Reset
          </Button>
          <Button
            onClick={handleSave}
            disabled={updateSettingsMutation.isPending}
            className="text-xs h-8"
          >
            {updateSettingsMutation.isPending ? (
              <>
                <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-3 w-3 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </Tabs>
    </div>
  )
}
