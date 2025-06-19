import React, { useState, useEffect } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  User as UserIcon,
  Smartphone,
  Moon,
  LogOut,
  Info,
  Shield,
  Palette,
  Vibrate,
  Volume2,
  Eye
} from "lucide-react";

export default function Settings() {
  const { user, logout, isDemoMode } = useAuth();
  const [settings, setSettings] = useState({
    dark_mode: false,
    auto_refresh: true,
    notifications_enabled: true,
    sound_enabled: true,
    vibration_enabled: true
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSettingChange = async (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    
    try {
      // For now, we'll just update local state
      // In the future, this would call an API to save settings
      console.log('Settings updated:', newSettings);
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await logout();
    } catch (error) {
      console.error('Error logging out:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pb-20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Signing out...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pb-20">
      {/* Demo Mode Banner */}
      {isDemoMode && (
        <div className="bg-yellow-500 text-white p-3 text-center">
          <div className="flex items-center justify-center gap-2">
            <Eye className="w-4 h-4" />
            <span className="font-medium">Demo Mode Active</span>
          </div>
          <p className="text-sm text-yellow-100 mt-1">
            You're viewing the app in demo mode. Some features may not work as expected.
          </p>
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900 to-purple-700 text-white p-6 pt-12">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">Settings</h1>
            <p className="text-purple-200 text-sm">Customize your experience</p>
          </div>
          <UserIcon className="w-8 h-8 text-purple-200" />
        </div>
        
        {/* User Profile Card */}
        <div className="bg-white/10 backdrop-blur rounded-2xl p-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">
                {user?.full_name?.[0]?.toUpperCase() || 'U'}
              </span>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-white text-lg">{user?.full_name || 'User'}</h3>
              <p className="text-purple-200 text-sm">{user?.email}</p>
              <p className="text-purple-300 text-xs capitalize mt-1">
                {user?.role || 'user'} account {isDemoMode && '(Demo)'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6 -mt-4">
        {/* App Preferences */}
        <Card className="glass-effect border-0 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Appearance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium text-gray-900">Dark Mode</Label>
                <p className="text-sm text-gray-600">Switch to dark theme</p>
              </div>
              <Switch
                checked={settings.dark_mode}
                onCheckedChange={(checked) => handleSettingChange('dark_mode', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium text-gray-900">Auto Refresh</Label>
                <p className="text-sm text-gray-600">Automatically update data</p>
              </div>
              <Switch
                checked={settings.auto_refresh}
                onCheckedChange={(checked) => handleSettingChange('auto_refresh', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="glass-effect border-0 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="w-5 h-5" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium text-gray-900">Push Notifications</Label>
                <p className="text-sm text-gray-600">Receive incident alerts</p>
              </div>
              <Switch
                checked={settings.notifications_enabled}
                onCheckedChange={(checked) => handleSettingChange('notifications_enabled', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium text-gray-900">Sound Alerts</Label>
                <p className="text-sm text-gray-600">Play sound for notifications</p>
              </div>
              <Switch
                checked={settings.sound_enabled}
                onCheckedChange={(checked) => handleSettingChange('sound_enabled', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium text-gray-900">Vibration</Label>
                <p className="text-sm text-gray-600">Vibrate for critical alerts</p>
              </div>
              <Switch
                checked={settings.vibration_enabled}
                onCheckedChange={(checked) => handleSettingChange('vibration_enabled', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Device Information */}
        <Card className="glass-effect border-0 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <Info className="w-5 h-5" />
              Device Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Device ID</span>
              <span className="font-mono text-sm text-gray-900">
                {user?.id?.slice(-8) || 'Unknown'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">App Version</span>
              <span className="text-gray-900">v1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Platform</span>
              <span className="text-gray-900">Web</span>
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card className="glass-effect border-0 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-green-50 p-4 rounded-xl">
              <div className="flex items-center gap-2 text-green-800 mb-2">
                <Shield className="w-5 h-5" />
                <span className="font-semibold">Secure Connection</span>
              </div>
              <p className="text-sm text-green-700">
                Your connection is encrypted and secure
              </p>
            </div>
            
            <Button
              onClick={handleLogout}
              variant="destructive"
              className="w-full bg-red-600 hover:bg-red-700"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </CardContent>
        </Card>

        {/* App Info */}
        <Card className="glass-effect border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Smartphone className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-1">NetOp AI Mobile</h3>
              <p className="text-sm text-gray-600 mb-4">
                Real-time network monitoring companion
              </p>
              <div className="text-xs text-gray-500">
                © 2024 NetOp.Cloud • All rights reserved
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
