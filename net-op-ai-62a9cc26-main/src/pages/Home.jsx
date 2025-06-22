import { useState, useEffect } from 'react'
import { getIncidents, getSites, getDevices } from '../api/entities'
import { AlertTriangle, MapPin, Server, Activity } from 'lucide-react'

const Home = () => {
  const [incidents, setIncidents] = useState([])
  const [sites, setSites] = useState([])
  const [devices, setDevices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [incidentsData, sitesData, devicesData] = await Promise.all([
          getIncidents(),
          getSites(),
          getDevices()
        ])
        setIncidents(incidentsData)
        setSites(sitesData)
        setDevices(devicesData)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>
  }

  const openIncidents = incidents.filter(incident => incident.status === 'open')
  const onlineSites = sites.filter(site => site.status === 'online')
  const onlineDevices = devices.filter(device => device.status === 'online')

  const stats = [
    {
      name: 'Open Incidents',
      value: openIncidents.length,
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    },
    {
      name: 'Online Sites',
      value: onlineSites.length,
      icon: MapPin,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      name: 'Online Devices',
      value: onlineDevices.length,
      icon: Server,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      name: 'Total Sites',
      value: sites.length,
      icon: Activity,
      color: 'text-gray-600',
      bgColor: 'bg-gray-100'
    }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Network operations overview</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className={`flex-shrink-0 ${stat.bgColor} rounded-md p-3`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {stat.name}
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {stat.value}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Recent Incidents */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Recent Incidents
          </h3>
          <div className="space-y-4">
            {incidents.slice(0, 5).map((incident) => (
              <div key={incident.id} className="border-l-4 border-red-400 pl-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">
                      {incident.title}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {incident.site} • {incident.device}
                    </p>
                  </div>
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
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home 