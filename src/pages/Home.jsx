import React, { useState, useEffect } from "react";
import { Incident, Site, NetworkDevice } from "@/api/entities";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  AlertTriangle, 
  AlertCircle, 
  Activity,
  Clock,
  MapPin,
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { format } from "date-fns";

const severityData = [
  { 
    key: 'critical', 
    label: 'Critical', 
    icon: AlertTriangle, 
    color: 'bg-red-500',
    textColor: 'text-red-600',
    bgColor: 'bg-red-50',
    description: 'Immediate action required'
  },
  { 
    key: 'high', 
    label: 'High', 
    icon: AlertCircle, 
    color: 'bg-orange-500',
    textColor: 'text-orange-600',
    bgColor: 'bg-orange-50',
    description: 'Urgent attention needed'
  },
  { 
    key: 'medium', 
    label: 'Medium', 
    icon: Activity, 
    color: 'bg-yellow-500',
    textColor: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    description: 'Monitor closely'
  },
  { 
    key: 'low', 
    label: 'Low', 
    icon: Clock, 
    color: 'bg-blue-500',
    textColor: 'text-blue-600',
    bgColor: 'bg-blue-50',
    description: 'Standard monitoring'
  }
];

export default function Home() {
  const [incidents, setIncidents] = useState([]);
  const [severityCounts, setSeverityCounts] = useState({});
  const [recentIncidents, setRecentIncidents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sites, setSites] = useState([]);
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    setIsLoading(true);
    try {
      // Load all data in parallel
      const [allIncidents, allSites, allDevices] = await Promise.all([
        Incident.list(),
        Site.list(),
        NetworkDevice.list()
      ]);

      // Filter active incidents
      const activeIncidents = allIncidents.filter(i => i.status !== 'resolved' && i.status !== 'closed');
      
      setIncidents(activeIncidents);
      setSites(allSites);
      setDevices(allDevices);
      
      // Enrich incidents with site and device names
      const enrichedIncidents = allIncidents.map(incident => {
        const site = allSites.find(s => s.id === incident.site_id);
        const device = allDevices.find(d => d.id === incident.device_id);
        return {
          ...incident,
          site_name: site?.name || 'Unknown Site',
          device_name: device?.name || 'Unknown Device'
        };
      });
      
      setRecentIncidents(enrichedIncidents.slice(0, 5));
      
      // Calculate severity counts
      const counts = activeIncidents.reduce((acc, incident) => {
        acc[incident.severity] = (acc[incident.severity] || 0) + 1;
        return acc;
      }, {});
      setSeverityCounts(counts);
      
    } catch (error) {
      console.error('Error loading home data:', error);
      // Set empty arrays to prevent further errors
      setIncidents([]);
      setRecentIncidents([]);
      setSeverityCounts({});
    }
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50 pb-20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900 to-purple-700 text-white p-6 pt-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">NetOp AI</h1>
            <p className="text-purple-200 text-sm">Network Monitoring</p>
          </div>
          <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
            <Activity className="w-5 h-5" />
          </div>
        </div>
        
        {/* Overall Status */}
        <div className="bg-white/10 backdrop-blur rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">{incidents.length}</div>
              <div className="text-purple-200 text-sm">Active Incidents</div>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold">
                {incidents.length === 0 ? '100%' : Math.round(((incidents.filter(i => i.severity !== 'critical').length) / incidents.length) * 100)}%
              </div>
              <div className="text-purple-200 text-sm">System Health</div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6 -mt-4">
        {/* Severity Summary Grid */}
        <Card className="glass-effect border-0 shadow-xl">
          <CardContent className="p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Incident Severity</h2>
            <div className="grid grid-cols-2 gap-4">
              {severityData.map((severity) => (
                <Link 
                  key={severity.key}
                  to={`${createPageUrl('Incidents')}?severity=${severity.key}`}
                  className="block"
                >
                  <Card className={`${severity.bgColor} border-0 hover:shadow-lg transition-all duration-300 transform hover:scale-105`}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <severity.icon className={`w-6 h-6 ${severity.textColor}`} />
                        <div className={`text-2xl font-bold ${severity.textColor}`}>
                          {severityCounts[severity.key] || 0}
                        </div>
                      </div>
                      <div className="text-sm font-semibold text-gray-900">{severity.label}</div>
                      <div className="text-xs text-gray-600 mt-1">{severity.description}</div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Incidents */}
        <Card className="glass-effect border-0 shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Recent Activity</h2>
              <Link to={createPageUrl('Incidents')}>
                <Button variant="ghost" size="sm" className="text-purple-600">
                  View All <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
            
            {recentIncidents.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Activity className="w-8 h-8 text-green-600" />
                </div>
                <p className="text-gray-600 font-medium">No incidents found</p>
                <p className="text-sm text-gray-500">All systems running smoothly</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentIncidents.map((incident) => (
                  <div 
                    key={incident.id}
                    className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100"
                  >
                    <div className={`w-3 h-3 rounded-full ${
                      incident.severity === 'critical' ? 'bg-red-500' :
                      incident.severity === 'high' ? 'bg-orange-500' :
                      incident.severity === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                    }`}></div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 text-sm truncate">
                        {incident.title}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <MapPin className="w-3 h-3" />
                        <span>{incident.site_name}</span>
                        <span>•</span>
                        <span>{incident.device_name}</span>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <Badge className={`text-xs ${
                        incident.severity === 'critical' ? 'bg-red-100 text-red-800' :
                        incident.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                        incident.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {incident.severity}
                      </Badge>
                      <div className="text-xs text-gray-500 mt-1">
                        {format(new Date(incident.created_at), 'HH:mm')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Navigation */}
        <div className="grid grid-cols-2 gap-4">
          <Link to={createPageUrl('Sites')}>
            <Card className="glass-effect border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6 text-center">
                <MapPin className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <div className="font-semibold text-gray-900">Sites</div>
                <div className="text-xs text-gray-500">View by location</div>
              </CardContent>
            </Card>
          </Link>
          
          <Link to={createPageUrl('Notifications')}>
            <Card className="glass-effect border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6 text-center">
                <AlertTriangle className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                <div className="font-semibold text-gray-900">Alerts</div>
                <div className="text-xs text-gray-500">Configure notifications</div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}