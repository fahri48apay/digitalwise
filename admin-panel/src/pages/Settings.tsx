import React from 'react';

export default function Settings() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Pengaturan</h2>

      <div className="bg-white shadow rounded-lg">
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Pengaturan Umum</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nama Aplikasi</label>
              <input
                type="text"
                defaultValue="DigitalWise"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Deskripsi</label>
              <textarea
                rows={3}
                defaultValue="Gamifikasi literasi digital untuk remaja Indonesia"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              />
            </div>

            <div className="flex items-center">
              <input
                id="dark-mode"
                type="checkbox"
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label htmlFor="dark-mode" className="ml-2 block text-sm text-gray-900">
                Aktifkan Dark Mode
              </label>
            </div>

            <div className="flex items-center">
              <input
                id="notifications"
                type="checkbox"
                defaultChecked
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label htmlFor="notifications" className="ml-2 block text-sm text-gray-900">
                Aktifkan Notifikasi Push
              </label>
            </div>
          </div>

          <div className="mt-6">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Simpan Pengaturan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
