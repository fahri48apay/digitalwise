import React from 'react';

const threads = [
  { id: 1, title: 'Tips Menghindari Phishing Email', author: 'Raka Pratama', category: 'Keamanan', replies: 12, views: 234, lastActivity: '2 menit lalu' },
  { id: 2, title: 'Pengalaman Diganggu di Media Sosial', author: 'Kirana Putri', category: 'Privasi', replies: 8, views: 156, lastActivity: '10 menit lalu' },
  { id: 3, title: 'Rekomendasi VPN Gratis', author: 'Budi Santoso', category: 'Alat', replies: 15, views: 312, lastActivity: '1 jam lalu' },
  { id: 4, title: 'Cara Verifikasi Berita', author: 'Sari Dewi', category: 'Literasi', replies: 6, views: 89, lastActivity: '2 jam lalu' },
];

export default function Forum() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Forum Diskusi</h2>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Judul
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Penulis
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kategori
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Balasan
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Dilihat
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aktivitas Terakhir
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Aksi</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {threads.map((thread) => (
              <tr key={thread.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{thread.title}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{thread.author}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{thread.category}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{thread.replies}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{thread.views}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{thread.lastActivity}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-primary hover:text-primary-600 mr-4">Lihat</button>
                  <button className="text-red-600 hover:text-red-900">Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
