import React from 'react';

export default function Appearance() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Tampilan</h2>

      <div className="bg-white shadow rounded-lg">
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Tema</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Mode Terang</label>
              <button
                type="button"
                className="w-full flex items-center justify-between px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:bg-dark-800 dark:text-dark-200 dark:hover:text-primary"
              >
                <span>Aktifkan</span>
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Mode Gelap</label>
              <button
                type="button"
                className="w-full flex items-center justify-between px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:bg-dark-800 dark:text-dark-200 dark:hover:text-primary"
              >
                <span>Aktifkan</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}