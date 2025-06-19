import React, { useState, useEffect } from "react";
import { NotificationPreference, Site } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { 
  Bell, 
  Smartphone, 
  Mail,
  Shield,
  Volume2,
  Save,
  CheckCircle
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const severityData = [
  { key: 'critical', label: 'Critical', color: 'bg-red-100 text-red-800', icon: Shield },
  { key: 'high', label: 'High', color: 'bg-orange-100 text-orange-800', icon: Bell },
  { key: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800', icon: Volume2 },
  { key: 'low', label: 'Low', color: 'bg-blue-100 text-blue-800', icon: Smartphone }
];

export default function Notifications() {
  const [preferences, setPreferences] = useState([]);
  const [sites, setSites] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [globalSettings, setGlobalSettings] = useState({
    push_enabled: true,
    email_enabled: false,
    sound_enabled: true,
    vibration_enabled: true
  });

  useEffect(() => {
    loadNotificationData();
  }, []);

  const loadNotificationData = async () => {
    try {
      const [prefsData, sitesData] = await Promise.all([
        NotificationPreference.list(),
        Site.list()
      ]);
      
      setPreferences(prefsData);
      setSites(sitesData);
    } catch (error) {
      console.error('Error loading notification data:', error);
    }
  };

  const toggleSeverity = async (severity, enabled) => {
    setIsSaving(true);
    try {
      const severityPrefs = preferences.filter(p => p.severity === severity);
      
      await Promise.all(
        severityPrefs.map(pref => 
          NotificationPreference.update(pref.id, { ...pref, enabled })
        )
      );
      
      setPreferences(prev => 
        prev.map(p => p.severity === severity ? { ...p, enabled } : p)
      );
      
      showSaveSuccess();
    } catch (error) {
      console.error('Error updating preferences:', error);
    }
    setIsSaving(false);
  };

  const toggleGlobalSetting = (setting, value) => {
    setGlobalSettings(prev => ({ ...prev, [setting]: value }));
  };

  const showSaveSuccess = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const getSeverityCount = (severity) => {
    return preferences.filter(p => p.severity === severity && p.enabled).length;
  };

  const isSeverityEnabled = (severity) => {
    const severityPrefs = preferences.filter(p => p.severity === severity);
    return severityPrefs.some(p => p.enabled);
  };

  const enableAllCritical = async () => {
    setIsSaving(true);
    try {
      const criticalPrefs = preferences.filter(p => p.severity === 'critical');
      
      await Promise.all(
        criticalPrefs.map(pref => 
          NotificationPreference.update(pref.id, {
            ...pref,
            enabled: true,
            push_notifications: true,
            email_notifications: true
          })
        )
      );
      
      await loadNotificationData();
      showSaveSuccess();
    } catch (error) {
      console.error('Error enabling critical notifications:', error);
    }
    setIsSaving(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900 to-purple-700 text-white p-6 pt-12">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">Notifications</h1>
            <p className="text-purple-200 text-sm">Configure alert preferences</p>
          </div>
          <Bell className="w-8 h-8 text-purple-200" />
        </div>
        
        <div className="bg-white/10 backdrop-blur rounded-2xl p-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-bold">
                {preferences.filter(p => p.enabled).length}
              </div>
              <div className="text-purple-200 text-xs">Active</div>
            </div>
            <div>
              <div className="text-lg font-bold">
                {preferences.filter(p => p.enabled && p.push_notifications).length}
              </div>
              <div className="text-purple-200 text-xs">Push</div>
            </div>
            <div>
              <div className="text-lg font-bold">
                {preferences.filter(p => p.enabled && p.email_notifications).length}
              </div>
              <div className="text-purple-200 text-xs">Email</div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6 -mt-4">
        {/* Success Message */}
        {saveSuccess && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Notification preferences saved successfully!
            </AlertDescription>
          </Alert>
        )}

        {/* Quick Actions */}
        <Card className="glass-effect border-0 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-bold text-gray-900">Quick Setup</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              <Button
                onClick={enableAllCritical}
                disabled={isSaving}
                className="bg-red-600 hover:bg-red-700 text-white justify-start"
              >
                <Shield className="w-4 h-4 mr-3" />
                Enable All Critical Alerts
              </Button>
              
              <div className="bg-blue-50 p-4 rounded-xl">
                <h4 className="font-semibold text-blue-900 mb-2">Recommended Settings</h4>
                <div className="text-sm text-blue-700 space-y-1">
                  <div>✓ Critical incidents: Push + Email</div>
                  <div>✓ High incidents: Push notifications</div>
                  <div>✓ Medium/Low incidents: Disabled</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Global Notification Settings */}
        <Card className="glass-effect border-0 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="w-5 h-5" />
              Device Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium text-gray-900">Push Notifications</Label>
                <p className="text-sm text-gray-600">Receive alerts on this device</p>
              </div>
              <Switch
                checked={globalSettings.push_enabled}
                onCheckedChange={(checked) => toggleGlobalSetting('push_enabled', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium text-gray-900">Email Notifications</Label>
                <p className="text-sm text-gray-600">Receive detailed reports via email</p>
              </div>
              <Switch
                checked={globalSettings.email_enabled}
                onCheckedChange={(checked) => toggleGlobalSetting('email_enabled', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium text-gray-900">Sound & Vibration</Label>
                <p className="text-sm text-gray-600">Audio alerts for urgent incidents</p>
              </div>
              <Switch
                checked={globalSettings.sound_enabled}
                onCheckedChange={(checked) => toggleGlobalSetting('sound_enabled', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Severity Level Controls */}
        <Card className="glass-effect border-0 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Alert Levels
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {severityData.map((severity) => (
              <div key={severity.key} className="border border-gray-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <severity.icon className={`w-6 h-6 ${
                      severity.key === 'critical' ? 'text-red-600' :
                      severity.key === 'high' ? 'text-orange-600' :
                      severity.key === 'medium' ? 'text-yellow-600' : 'text-blue-600'
                    }`} />
                    <div>
                      <div className="font-semibold text-gray-900">{severity.label} Incidents</div>
                      <div className="text-sm text-gray-600">
                        {getSeverityCount(severity.key)} of {preferences.filter(p => p.severity === severity.key).length} enabled
                      </div>
                    </div>
                  </div>
                  
                  <Switch
                    checked={isSeverityEnabled(severity.key)}
                    onCheckedChange={(checked) => toggleSeverity(severity.key, checked)}
                    disabled={isSaving}
                  />
                </div>
                
                <div className="flex gap-2">
                  <Badge className={severity.color}>
                    {severity.label.toUpperCase()}
                  </Badge>
                  {isSeverityEnabled(severity.key) && (
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      Active
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Site-specific Settings */}
        {sites.length > 0 && (
          <Card className="glass-effect border-0 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Site Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {sites.slice(0, 3).map((site) => (
                <div key={site.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">{site.name}</div>
                    <div className="text-sm text-gray-600">{site.location}</div>
                  </div>
                  <Switch defaultChecked />
                </div>
              ))}
              {sites.length > 3 && (
                <div className="text-center pt-2">
                  <Button variant="ghost" size="sm" className="text-blue-600">
                    View All Sites ({sites.length})
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
