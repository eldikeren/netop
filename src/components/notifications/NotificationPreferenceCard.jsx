import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Bell, Mail, Clock } from "lucide-react";

const severityColors = {
  critical: "bg-red-100 text-red-800 border-red-200",
  high: "bg-orange-100 text-orange-800 border-orange-200", 
  medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
  low: "bg-blue-100 text-blue-800 border-blue-200"
};

const categoryColors = {
  operational: "bg-purple-100 text-purple-800 border-purple-200",
  network_utilization: "bg-cyan-100 text-cyan-800 border-cyan-200",
  performance: "bg-green-100 text-green-800 border-green-200",
  resource_utilization: "bg-indigo-100 text-indigo-800 border-indigo-200"
};

export default function NotificationPreferenceCard({ 
  preference, 
  onUpdate 
}) {
  const handleToggle = (field, value) => {
    onUpdate(preference.id, { ...preference, [field]: value });
  };

  const categoryLabel = preference.category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  return (
    <Card className="glass-effect border-0 shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold text-gray-900">
            {categoryLabel}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge className={categoryColors[preference.category]}>
              {categoryLabel}
            </Badge>
            <Badge className={severityColors[preference.severity]}>
              {preference.severity.toUpperCase()}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Master Toggle */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-gray-600" />
            <div>
              <Label className="font-semibold text-gray-900">
                Enable Notifications
              </Label>
              <p className="text-sm text-gray-600">
                Receive alerts for this category and severity
              </p>
            </div>
          </div>
          <Switch
            checked={preference.enabled}
            onCheckedChange={(checked) => handleToggle('enabled', checked)}
          />
        </div>

        {preference.enabled && (
          <>
            {/* Notification Types */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Notification Methods</h4>
              
              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <Bell className="w-4 h-4 text-blue-600" />
                  <div>
                    <Label className="font-medium text-gray-900">
                      Push Notifications
                    </Label>
                    <p className="text-sm text-gray-600">
                      Instant alerts on your mobile device
                    </p>
                  </div>
                </div>
                <Switch
                  checked={preference.push_notifications}
                  onCheckedChange={(checked) => handleToggle('push_notifications', checked)}
                />
              </div>

              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-purple-600" />
                  <div>
                    <Label className="font-medium text-gray-900">
                      Email Notifications
                    </Label>
                    <p className="text-sm text-gray-600">
                      Detailed reports via email
                    </p>
                  </div>
                </div>
                <Switch
                  checked={preference.email_notifications}
                  onCheckedChange={(checked) => handleToggle('email_notifications', checked)}
                />
              </div>
            </div>

            {/* Quiet Hours */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-600" />
                <h4 className="font-semibold text-gray-900">Quiet Hours</h4>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Start Time</Label>
                  <Input
                    type="time"
                    value={preference.quiet_hours_start || ''}
                    onChange={(e) => handleToggle('quiet_hours_start', e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">End Time</Label>
                  <Input
                    type="time"
                    value={preference.quiet_hours_end || ''}
                    onChange={(e) => handleToggle('quiet_hours_end', e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
              
              <p className="text-xs text-gray-500">
                Critical alerts will still be sent during quiet hours
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}