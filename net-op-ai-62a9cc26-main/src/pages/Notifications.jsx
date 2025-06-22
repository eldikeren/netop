import { Bell, AlertTriangle, Info, CheckCircle } from 'lucide-react'

const Notifications = () => {
  const notifications = [
    {
      id: 1,
      type: 'alert',
      title: 'High CPU Usage Detected',
      message: 'Server CPU usage has exceeded 90% for the last 5 minutes',
      timestamp: '2024-01-15T12:30:00Z',
      read: false
    },
    {
      id: 2,
      type: 'info',
      title: 'Backup Completed Successfully',
      message: 'Daily backup process completed at 02:00 AM',
      timestamp: '2024-01-15T02:00:00Z',
      read: true
    },
    {
      id: 3,
      type: 'success',
      title: 'Incident Resolved',
      message: 'Network connectivity issue has been resolved',
      timestamp: '2024-01-14T16:45:00Z',
      read: true
    },
    {
      id: 4,
      type: 'alert',
      title: 'New Device Detected',
      message: 'Unknown device connected to network at 10:15 AM',
      timestamp: '2024-01-14T10:15:00Z',
      read: false
    }
  ]

  const getIcon = (type) => {
    switch (type) {
      case 'alert':
        return <AlertTriangle className="w-5 h-5 text-red-500" />
      case 'info':
        return <Info className="w-5 h-5 text-blue-500" />
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      default:
        return <Bell className="w-5 h-5 text-gray-500" />
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
        <p className="text-gray-600">System alerts and notifications</p>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`flex items-start space-x-3 p-4 rounded-lg border ${
                  notification.read ? 'bg-gray-50' : 'bg-white'
                }`}
              >
                <div className="flex-shrink-0 mt-1">
                  {getIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className={`text-sm font-medium ${
                      notification.read ? 'text-gray-500' : 'text-gray-900'
                    }`}>
                      {notification.title}
                    </h3>
                    {!notification.read && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        New
                      </span>
                    )}
                  </div>
                  <p className={`text-sm ${
                    notification.read ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(notification.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Notifications 