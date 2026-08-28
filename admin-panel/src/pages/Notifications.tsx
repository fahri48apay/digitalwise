import React from 'react';

export default function Notifications() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Notifikasi</h2>

      <div className="bg-white shadow rounded-lg">
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Setting Notifikasi</h3>
          
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                id="email-notifications"
                type="checkbox"
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                defaultChecked
              />
              <label htmlFor="email-notifications" className="ml-2 block text-sm text-gray-900">
                Notifikasi Email
              </label>
            </div>

            <div className="flex items-center">
              <input
                id="push-notifications"
                type="checkbox"
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                defaultChecked
              />
              <label htmlFor="push-notifications" className="ml-2 block text-sm text-gray-900">
                Notifikasi Push
              </label>
            </div>

            <div className="flex items-center">
              <input
                id="in-app-notifications"
                type="checkbox"
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                default
              />
              <label htmlFor="in-app-notifications" className="ml-2 block text-sm text-gray-900">
                Notifikasi Dalam Aplikasi
              </label>
            </div>
          </div>

          <div className="mt-6">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Simpan Notifikasi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}