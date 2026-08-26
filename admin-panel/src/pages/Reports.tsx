import React from 'react';

const reports = [
  { id: 1, type: 'Konten Mencurigakan', reporter: 'Raka Pratama', target: 'Thread #123', status: 'pending', date: '2024-03-15' },
  { id: 2, type: 'Penyalahgunaan Akun', reporter: 'Kirana Putri', target: 'User #456', status: 'investigating', date: '2024-03-14' },
  { id: 3, type: 'Spam', reporter: 'Budi Santoso', target: 'Post #789', status: 'resolved', date: '2024-03-13' },
  { id: 4, type: 'Konten Tidak Pantas', reporter: 'Sari Dewi', target: 'Thread #321', status: 'pending', date: '2024-03-12' },
];

export default function Reports() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Laporan & Moderasi</h2>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tipe
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pelapor
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Target
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tanggal
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Aksi</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reports.map((report) => (
              <tr key={report.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{report.type}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{report.reporter}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{report.target}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    report.status === 'pending' 
                      ? 'bg-yellow-100 text-yellow-800'
                      : report.status === 'investigating'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {report.status === 'pending' ? 'Pending' : report.status === 'investigating' ? 'Investigasi' : 'Selesai'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{report.date}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-primary hover:text-primary-600 mr-4">Investigasi</button>
                  <button className="text-green-600 hover:text-green-900">Selesai</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
