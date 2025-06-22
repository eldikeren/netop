import { useState, useEffect } from 'react'
import { getSites } from '../api/entities'
import { MapPin, Wifi, WifiOff } from 'lucide-react'

const Sites = () => {
  const [sites, setSites] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSites()
  }, [])

  const fetchSites = async () => {
    try {
      const data = await getSites()
      setSites(data)
    } catch (error) {
      console.error('Error fetching sites:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Sites</h1>
        <p className="text-gray-600">Network sites and their status</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {sites.map((site) => (
          <div key={site.id} className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                {site.status === 'online' ? (
                  <Wifi className="w-5 h-5 text-green-500 mr-2" />
                ) : (
                  <WifiOff className="w-5 h-5 text-red-500 mr-2" />
                )}
                <h3 className="text-lg font-medium text-gray-900">{site.name}</h3>
              </div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                site.status === 'online' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {site.status}
              </span>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-500">
                <MapPin className="w-4 h-4 mr-1" />
                {site.location}
              </div>
              <div className="text-sm text-gray-500">
                Devices: {site.device_count}
              </div>
              <div className="text-sm text-gray-500">
                Last updated: {new Date(site.last_updated).toLocaleString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Sites 