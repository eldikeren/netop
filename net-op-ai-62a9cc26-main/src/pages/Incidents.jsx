import React, { useState, useEffect } from "react";
import { Incident } from "@/api/entities";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Filter, 
  RefreshCw,
  AlertTriangle,
  Clock,
  CheckCircle,
  MapPin,
  Monitor,
  Eye,
  X
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { format } from "date-fns";

const severityColors = {
  critical: "bg-red-100 text-red-800 border-red-200",
  high: "bg-orange-100 text-orange-800 border-orange-200",
  medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
  low: "bg-blue-100 text-blue-800 border-blue-200"
};

const categoryColors = {
  "Network Utilization": "bg-cyan-100 text-cyan-800",
  "Network Performance": "bg-purple-100 text-purple-800", 
  "Service Performance": "bg-green-100 text-green-800",
  "Operational": "bg-indigo-100 text-indigo-800"
};

export default function Incidents() {
  const [incidents, setIncidents] = useState([]);
  const [filteredIncidents, setFilteredIncidents] = useState([]);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    severity: '',
    site: '',
    status: 'all'
  });

  // Check URL params for initial filters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const severity = urlParams.get('severity');
    const site = urlParams.get('site');
    
    if (severity || site) {
      setFilters(prev => ({
        ...prev,
        severity: severity || '',
        site: site || ''
      }));
    }
  }, []);

  useEffect(() => {
    loadIncidents();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [incidents, filters, searchTerm]);

  const loadIncidents = async () => {
    setIsLoading(true);
    try {
      const data = await Incident.list();
      setIncidents(data);
    } catch (error) {
      console.error('Error loading incidents:', error);
    }
    setIsLoading(false);
  };

  const applyFilters = () => {
    let filtered = [...incidents];

    if (filters.severity) {
      filtered = filtered.filter(i => i.severity === filters.severity);
    }

    if (filters.site) {
      filtered = filtered.filter(i => i.site === filters.site);
    }

    if (filters.status !== 'all') {
      filtered = filtered.filter(i => i.status === filters.status);
    }

    if (searchTerm) {
      filtered = filtered.filter(i => 
        i.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        i.site.toLowerCase().includes(searchTerm.toLowerCase()) ||
        i.device.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredIncidents(filtered);
  };

  const markAsReviewed = async (incident) => {
    try {
      await Incident.update(incident.id, { reviewed: true });
      setIncidents(prev => 
        prev.map(i => i.id === incident.id ? { ...i, reviewed: true } : i)
      );
      setSelectedIncident(prev => prev ? { ...prev, reviewed: true } : null);
    } catch (error) {
      console.error('Error marking as reviewed:', error);
    }
  };

  const clearFilters = () => {
    setFilters({ severity: '', site: '', status: 'all' });
    setSearchTerm('');
  };

  const activeFilterCount = Object.values(filters).filter(f => f && f !== 'all').length + (searchTerm ? 1 : 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900 to-purple-700 text-white p-6 pt-12">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">Incidents</h1>
            <p className="text-purple-200 text-sm">Real-time monitoring</p>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={loadIncidents}
            disabled={isLoading}
            className="text-white hover:bg-white/10"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
        
        <div className="bg-white/10 backdrop-blur rounded-2xl p-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-bold">{filteredIncidents.length}</div>
              <div className="text-purple-200 text-xs">Showing</div>
            </div>
            <div>
              <div className="text-lg font-bold">
                {filteredIncidents.filter(i => i.severity === 'critical').length}
              </div>
              <div className="text-purple-200 text-xs">Critical</div>
            </div>
            <div>
              <div className="text-lg font-bold">
                {filteredIncidents.filter(i => i.status === 'active').length}
              </div>
              <div className="text-purple-200 text-xs">Active</div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4 -mt-4">
        {/* Search and Filter Bar */}
        <Card className="glass-effect border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search incidents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className={`relative ${activeFilterCount > 0 ? 'bg-blue-50 border-blue-300 text-blue-700' : ''}`}
              >
                <Filter className="w-4 h-4" />
                {activeFilterCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </Button>
            </div>

            {/* Filter Panel */}
            {showFilters && (
              <div className="mt-4 p-4 bg-gray-50 rounded-xl space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">Filters</h3>
                  {activeFilterCount > 0 && (
                    <Button variant="ghost" size="sm" onClick={clearFilters}>
                      <X className="w-4 h-4 mr-1" />
                      Clear
                    </Button>
                  )}
                </div>
                
                {/* Severity Filter */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Severity</label>
                  <div className="flex gap-2 flex-wrap">
                    {['critical', 'high', 'medium', 'low'].map(severity => (
                      <Button
                        key={severity}
                        variant={filters.severity === severity ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFilters(prev => ({
                          ...prev,
                          severity: prev.severity === severity ? '' : severity
                        }))}
                        className={`${filters.severity === severity ? 
                          severity === 'critical' ? 'bg-red-600' :
                          severity === 'high' ? 'bg-orange-600' :
                          severity === 'medium' ? 'bg-yellow-600' : 'bg-blue-600'
                          : ''}`}
                      >
                        {severity}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Status Filter */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Status</label>
                  <div className="flex gap-2 flex-wrap">
                    {[
                      { key: 'all', label: 'All' },
                      { key: 'active', label: 'Active' },
                      { key: 'investigating', label: 'Investigating' },
                      { key: 'resolved', label: 'Resolved' }
                    ].map(status => (
                      <Button
                        key={status.key}
                        variant={filters.status === status.key ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFilters(prev => ({ ...prev, status: status.key }))}
                      >
                        {status.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Incidents List */}
        {isLoading ? (
          <div className="text-center py-12">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-blue-600 mb-4" />
            <p className="text-gray-600">Loading incidents...</p>
          </div>
        ) : filteredIncidents.length === 0 ? (
          <Card className="glass-effect border-0 shadow-lg">
            <CardContent className="text-center py-12">
              <AlertTriangle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No incidents found</h3>
              <p className="text-gray-600">
                {activeFilterCount > 0 ? 'Try adjusting your filters' : 'All systems running smoothly'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredIncidents.map((incident) => (
              <Card 
                key={incident.id} 
                className={`glass-effect border-0 shadow-lg hover:shadow-xl transition-all duration-300 ${
                  !incident.reviewed ? 'ring-2 ring-blue-200' : ''
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`w-3 h-3 rounded-full mt-2 ${
                      incident.severity === 'critical' ? 'bg-red-500' :
                      incident.severity === 'high' ? 'bg-orange-500' :
                      incident.severity === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                    }`}></div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-gray-900 text-sm leading-tight">
                          {incident.title}
                        </h3>
                        <Badge className={`${severityColors[incident.severity]} text-xs ml-2`}>
                          {incident.severity}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          <span>{incident.site}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Monitor className="w-3 h-3" />
                          <span>{incident.device}</span>
                        </div>
                      </div>
                      
                      {incident.category && (
                        <Badge className={`${categoryColors[incident.category]} text-xs mb-2`}>
                          {incident.category}
                        </Badge>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-gray-500">
                          {format(new Date(incident.detected_at), 'MMM d, HH:mm')}
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedIncident(incident)}
                          className="text-blue-600 hover:bg-blue-50"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Incident Detail Modal */}
        <Dialog open={!!selectedIncident} onOpenChange={() => setSelectedIncident(null)}>
          <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold">Incident Details</DialogTitle>
            </DialogHeader>
            
            {selectedIncident && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-bold text-gray-900 text-lg mb-2">
                    {selectedIncident.title}
                  </h3>
                  
                  <div className="flex gap-2 mb-4">
                    <Badge className={severityColors[selectedIncident.severity]}>
                      {selectedIncident.severity.toUpperCase()}
                    </Badge>
                    {selectedIncident.category && (
                      <Badge className={categoryColors[selectedIncident.category]}>
                        {selectedIncident.category}
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <label className="font-semibold text-gray-600">Site</label>
                    <p className="text-gray-900">{selectedIncident.site}</p>
                  </div>
                  <div>
                    <label className="font-semibold text-gray-600">Device</label>
                    <p className="text-gray-900">{selectedIncident.device}</p>
                  </div>
                  <div>
                    <label className="font-semibold text-gray-600">Status</label>
                    <p className="text-gray-900 capitalize">{selectedIncident.status}</p>
                  </div>
                  <div>
                    <label className="font-semibold text-gray-600">Detected</label>
                    <p className="text-gray-900">
                      {format(new Date(selectedIncident.detected_at), 'MMM d, yyyy HH:mm')}
                    </p>
                  </div>
                </div>

                {selectedIncident.description && (
                  <div>
                    <label className="font-semibold text-gray-600 block mb-2">Description</label>
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                      {selectedIncident.description}
                    </p>
                  </div>
                )}

                {selectedIncident.insight && (
                  <div>
                    <label className="font-semibold text-gray-600 block mb-2">AI Insight</label>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-blue-900">{selectedIncident.insight}</p>
                    </div>
                  </div>
                )}

                {!selectedIncident.reviewed && (
                  <Button
                    onClick={() => markAsReviewed(selectedIncident)}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Mark as Reviewed
                  </Button>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
