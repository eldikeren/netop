import React from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  AlertTriangle, 
  Clock, 
  CheckCircle, 
  XCircle,
  Eye,
  Activity
} from "lucide-react";
import { format } from "date-fns";

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

const statusIcons = {
  open: AlertTriangle,
  investigating: Clock,
  resolved: CheckCircle,
  closed: XCircle
};

export default function IncidentCard({ incident, onViewDetails }) {
  const StatusIcon = statusIcons[incident.status] || AlertTriangle;
  
  return (
    <Card className="glass-effect border-0 shadow-lg hover:shadow-xl transition-all duration-300 mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${
              incident.severity === 'critical' ? 'bg-red-100' :
              incident.severity === 'high' ? 'bg-orange-100' :
              incident.severity === 'medium' ? 'bg-yellow-100' : 'bg-blue-100'
            }`}>
              <StatusIcon className={`w-5 h-5 ${
                incident.severity === 'critical' ? 'text-red-600' :
                incident.severity === 'high' ? 'text-orange-600' :
                incident.severity === 'medium' ? 'text-yellow-600' : 'text-blue-600'
              }`} />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 text-lg leading-tight">
                {incident.title}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {incident.affected_device_name || 'Multiple devices'}
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-2 items-end">
            <Badge className={`${severityColors[incident.severity]} border font-semibold`}>
              {incident.severity.toUpperCase()}
            </Badge>
            <Badge variant="outline" className={categoryColors[incident.category]}>
              {incident.category.replace(/_/g, ' ')}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="text-gray-700 mb-4 leading-relaxed">
          {incident.description}
        </p>
        
        {incident.metrics && Object.keys(incident.metrics).length > 0 && (
          <div className="bg-gray-50 rounded-lg p-3 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-semibold text-gray-700">Metrics</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {Object.entries(incident.metrics).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="text-gray-600 capitalize">{key.replace(/_/g, ' ')}:</span>
                  <span className="font-medium text-gray-900">{value}%</span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {format(new Date(incident.detected_at), "MMM d, yyyy 'at' h:mm a")}
            </div>
            {incident.resolved_at && (
              <div className="mt-1 text-green-600 font-medium">
                Resolved {format(new Date(incident.resolved_at), "MMM d 'at' h:mm a")}
              </div>
            )}
          </div>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onViewDetails(incident)}
            className="hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 transition-all duration-200"
          >
            <Eye className="w-4 h-4 mr-2" />
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}