import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Filter, 
  AlertTriangle, 
  Clock, 
  CheckCircle,
  X
} from "lucide-react";

const severityOrder = ['critical', 'high', 'medium', 'low'];
const categoryLabels = {
  operational: 'Operational',
  network_utilization: 'Network',
  performance: 'Performance', 
  resource_utilization: 'Resources'
};

export default function IncidentFilters({ 
  filters, 
  onFilterChange, 
  incidents 
}) {
  const getStatusCount = (status) => {
    return incidents.filter(i => i.status === status).length;
  };

  const getSeverityCount = (severity) => {
    return incidents.filter(i => i.severity === severity).length;
  };

  const getCategoryCount = (category) => {
    return incidents.filter(i => i.category === category).length;
  };

  const hasActiveFilters = filters.severity || filters.category || filters.status !== 'all';

  const clearAllFilters = () => {
    onFilterChange({
      status: 'all',
      severity: null,
      category: null
    });
  };

  return (
    <div className="space-y-4 mb-6">
      {/* Active Filters Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-600" />
          <span className="font-semibold text-gray-900">Filters</span>
        </div>
        {hasActiveFilters && (
          <Button 
            variant="ghost" 
            size="sm"
            onClick={clearAllFilters}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-4 h-4 mr-1" />
            Clear all
          </Button>
        )}
      </div>

      {/* Status Filter */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Status</h4>
        <div className="flex flex-wrap gap-2">
          {[
            { key: 'all', label: 'All', icon: AlertTriangle, count: incidents.length },
            { key: 'open', label: 'Open', icon: AlertTriangle, count: getStatusCount('open') },
            { key: 'investigating', label: 'Investigating', icon: Clock, count: getStatusCount('investigating') },
            { key: 'resolved', label: 'Resolved', icon: CheckCircle, count: getStatusCount('resolved') }
          ].map((status) => (
            <Button
              key={status.key}
              variant={filters.status === status.key ? "default" : "outline"}
              size="sm"
              onClick={() => onFilterChange({...filters, status: status.key})}
              className={`transition-all duration-200 ${
                filters.status === status.key 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'hover:bg-blue-50 hover:border-blue-300'
              }`}
            >
              <status.icon className="w-4 h-4 mr-2" />
              {status.label} ({status.count})
            </Button>
          ))}
        </div>
      </div>

      {/* Severity Filter */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Severity</h4>
        <div className="flex flex-wrap gap-2">
          {severityOrder.map((severity) => (
            <Badge
              key={severity}
              variant={filters.severity === severity ? "default" : "outline"}
              className={`cursor-pointer transition-all duration-200 px-3 py-1 ${
                filters.severity === severity
                  ? severity === 'critical' ? 'bg-red-600 text-white' :
                    severity === 'high' ? 'bg-orange-600 text-white' :
                    severity === 'medium' ? 'bg-yellow-600 text-white' :
                    'bg-blue-600 text-white'
                  : severity === 'critical' ? 'border-red-300 text-red-700 hover:bg-red-50' :
                    severity === 'high' ? 'border-orange-300 text-orange-700 hover:bg-orange-50' :
                    severity === 'medium' ? 'border-yellow-300 text-yellow-700 hover:bg-yellow-50' :
                    'border-blue-300 text-blue-700 hover:bg-blue-50'
              }`}
              onClick={() => onFilterChange({
                ...filters, 
                severity: filters.severity === severity ? null : severity
              })}
            >
              {severity.toUpperCase()} ({getSeverityCount(severity)})
            </Badge>
          ))}
        </div>
      </div>

      {/* Category Filter */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Category</h4>
        <div className="flex flex-wrap gap-2">
          {Object.entries(categoryLabels).map(([key, label]) => (
            <Button
              key={key}
              variant={filters.category === key ? "default" : "outline"}
              size="sm"
              onClick={() => onFilterChange({
                ...filters, 
                category: filters.category === key ? null : key
              })}
              className={`transition-all duration-200 ${
                filters.category === key 
                  ? 'bg-purple-600 text-white shadow-md' 
                  : 'hover:bg-purple-50 hover:border-purple-300'
              }`}
            >
              {label} ({getCategoryCount(key)})
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}