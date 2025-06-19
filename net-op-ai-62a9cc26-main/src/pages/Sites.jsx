import React, { useState, useEffect } from "react";
import { Site, Incident } from "@/api/entities";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  MapPin, 
  Activity, 
  AlertTriangle,
  ArrowRight,
  RefreshCw
} from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function Sites() {
  const [sites, setSites] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSitesData();
  }, []);

  const loadSitesData = async () => {
    setIsLoading(true);
    try {
      const [sitesData, incidentsData] = await Promise.all([
        Site.list(),
        Incident.list()
      ]);
      
      setSites(sitesData);
      setIncidents(incidentsData);
    } catch (error) {
      console.error('Error loading sites data:', error);
    }
    setIsLoading(false);
  };

  const getSiteIncidentCounts = (siteName) => {
    const siteIncidents = incidents.filter(i => 
      i.site === siteName && i.status !== 'resolved'
    );
    
    return {
      total: siteIncidents.length,
      critical: siteIncidents.filter(i => i.severity === 'critical').length,
      high: siteIncidents.filter(i => i.severity === 'high').length
    };
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'operational': return 'bg-green-100 text-green-800 border-green-200';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'degraded': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900 to-purple-700 text-white p-6 pt-12">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">Sites</h1>
            <p className="text-purple-200 text-sm">Monitor by location</p>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={loadSitesData}
            disabled={isLoading}
            className="text-white hover:bg-white/10"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
        
        <div className="bg-white/10 backdrop-blur rounded-2xl p-4">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-xl font-bold">{sites.length}</div>
              <div className="text-purple-200 text-xs">Total Sites</div>
            </div>
            <div>
              <div className="text-xl font-bold">
                {sites.filter(s => s.status === 'operational').length}
              </div>
              <div className="text-purple-200 text-xs">Operational</div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4 -mt-4">
        {isLoading ? (
          <div className="text-center py-12">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-blue-600 mb-4" />
            <p className="text-gray-600">Loading sites...</p>
          </div>
        ) : sites.length === 0 ? (
          <Card className="glass-effect border-0 shadow-xl">
            <CardContent className="text-center py-12">
              <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Sites Found</h3>
              <p className="text-gray-600">Sites will appear here once configured</p>
            </CardContent>
          </Card>
        ) : (
          sites.map((site) => {
            const incidentCounts = getSiteIncidentCounts(site.name);
            
            return (
              <Link 
                key={site.id}
                to={`${createPageUrl('Incidents')}?site=${encodeURIComponent(site.name)}`}
              >
                <Card className="glass-effect border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                          <MapPin className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 text-lg">{site.name}</h3>
                          <p className="text-sm text-gray-600">{site.location}</p>
                          <p className="text-xs text-gray-500">{site.address}</p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <Badge className={`${getStatusColor(site.status)} border font-medium mb-2`}>
                          {site.status}
                        </Badge>
                        <div className="text-xs text-gray-500">
                          {site.devices_count} devices
                        </div>
                      </div>
                    </div>
                    
                    {incidentCounts.total > 0 ? (
                      <div className="bg-orange-50 rounded-xl p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-orange-600" />
                            <span className="font-semibold text-orange-900">
                              {incidentCounts.total} Active Incident{incidentCounts.total > 1 ? 's' : ''}
                            </span>
                          </div>
                          <ArrowRight className="w-4 h-4 text-orange-600" />
                        </div>
                        
                        {(incidentCounts.critical > 0 || incidentCounts.high > 0) && (
                          <div className="flex gap-3 mt-2">
                            {incidentCounts.critical > 0 && (
                              <Badge className="bg-red-100 text-red-800 text-xs">
                                {incidentCounts.critical} Critical
                              </Badge>
                            )}
                            {incidentCounts.high > 0 && (
                              <Badge className="bg-orange-100 text-orange-800 text-xs">
                                {incidentCounts.high} High
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="bg-green-50 rounded-xl p-4">
                        <div className="flex items-center gap-2">
                          <Activity className="w-5 h-5 text-green-600" />
                          <span className="font-semibold text-green-900">All systems operational</span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
