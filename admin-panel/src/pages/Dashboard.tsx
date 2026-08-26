import React from 'react';
import { 
  AcademicCapIcon, 
  UsersIcon, 
  ChatBubbleLeftIcon, 
  ExclamationTriangleIcon 
} from '@heroicons/react/24/outline';

const stats = [
  { name: 'Total Pengguna', value: '1,234', icon: UsersIcon, change: '+12%', changeType: 'increase' },
  { name: 'Kuis Diselesaikan', value: '456', icon: AcademicCapIcon, change: '+8%', changeType: 'increase' },
  { name: 'Forum Aktif', value: '78', icon: ChatBubbleLeftIcon, change: '+5%', changeType: 'increase' },
  { name: 'Laporan Pending', value: '12', icon: ExclamationTriangleIcon, change: '-3%', changeType: 'decrease' },
];

export default function Dashboard() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h2>
      
      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((item) => (
          <div
            key={item.name}
            className="bg-white overflow-hidden shadow rounded-lg"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <item.icon
                    className="h-6 w-6 text-gray-400"
                    aria-hidden="true"
                  />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {item.name}
                    </dt>
                    <dd className="text-lg font-semibold text-gray-900">
                      {item.value}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm">
                <span
                  className={`font-medium ${
                    item.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {item.change}
                </span>{' '}
                <span className="text-gray-500">dari bulan lalu</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white shadow rounded-lg">
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Aktivitas Terbaru</h3>
          <div className="space-y-4">
            {[
              { user: 'Raka Pratama', action: 'menyelesaikan kuis Phishing 101', time: '2 menit lalu' },
              { user: 'Kirana Putri', action: 'mengirim pesan di Forum', time: '5 menit lalu' },
              { user: 'Budi Santoso', action: 'mencapai Level 3', time: '10 menit lalu' },
              { user: 'Sari Dewi', action: 'melaporkan konten mencurigakan', time: '15 menit lalu' },
            ].map((activity, index) => (
              <div key={index} className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-medium">
                      {activity.user.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">{activity.user}</span>{' '}
                    {activity.action}
                  </p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
