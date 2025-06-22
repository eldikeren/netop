import { useState, useEffect } from 'react'
import { getIncidents, updateIncident } from '../api/entities'
import { AlertTriangle, Clock, CheckCircle } from 'lucide-react'

const Incidents = () => {
  const [incidents, setIncidents] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    fetchIncidents()
  }, [])

  const fetchIncidents = async () => {
    try {
      const data = await getIncidents()
      setIncidents(data)
    } catch (error) {
      console.error('Error fetching incidents:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (incidentId, newStatus) => {
    try {
      await updateIncident(incidentId, { status: newStatus })
      fetchIncidents() // Refresh the list
    } catch (error) {
      console.error('Error updating incident:', error)
    }
  }

  const filteredIncidents = incidents.filter(incident => {
    if (statusFilter === 'all') return true
    return incident.status === statusFilter
  })

  const getStatusIcon = (status) => {
    switch (status) {
      case 'open':
        return <AlertTriangle className="w-4 h-4 text-red-500" />
      case 'in_progress':
        return <Clock className="w-4 h-4 text-blue-500" />
      case 'resolved':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-500" />
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Incidents</h1>
          <p className="text-gray-600">Manage and track network incidents</p>
        </div>
        <div className="flex space-x-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm"
          >
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="space-y-4">
            {filteredIncidents.map((incident) => (
              <div key={incident.id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      {getStatusIcon(incident.status)}
                      <h3 className="text-lg font-medium text-gray-900">
                        {incident.title}
                      </h3>
                    </div>
                    <p className="text-gray-600 mb-2">{incident.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>Site: {incident.site}</span>
                      <span>Device: {incident.device}</span>
                      <span>Created: {new Date(incident.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        incident.priority === 'critical' ? 'bg-red-100 text-red-800' :
                        incident.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {incident.priority}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        incident.status === 'open' ? 'bg-red-100 text-red-800' :
                        incident.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {incident.status}
                      </span>
                    </div>
                    {incident.status !== 'resolved' && (
                      <div className="flex space-x-2">
                        {incident.status === 'open' && (
                          <button
                            onClick={() => handleStatusUpdate(incident.id, 'in_progress')}
                            className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
                          >
                            Start Work
                          </button>
                        )}
                        {incident.status === 'in_progress' && (
                          <button
                            onClick={() => handleStatusUpdate(incident.id, 'resolved')}
                            className="px-3 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600"
                          >
                            Resolve
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Incidents 