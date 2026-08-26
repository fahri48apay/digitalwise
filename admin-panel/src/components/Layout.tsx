import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  HomeIcon, 
  AcademicCapIcon, 
  UsersIcon, 
  BookOpenIcon, 
  ChatBubbleLeftIcon, 
  ExclamationTriangleIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', href: '/', icon: HomeIcon },
  { name: 'Kuis', href: '/quizzes', icon: AcademicCapIcon },
  { name: 'Pengguna', href: '/users', icon: UsersIcon },
  { name: 'Materi', href: '/materials', icon: BookOpenIcon },
  { name: 'Forum', href: '/forum', icon: ChatBubbleLeftIcon },
  { name: 'Laporan', href: '/reports', icon: ExclamationTriangleIcon },
  { name: 'Pengaturan', href: '/settings', icon: Cog6ToothIcon },
];

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-dark-900">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 bg-dark-800">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">DW</span>
              </div>
              <span className="ml-2 text-white font-semibold">DigitalWise Admin</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    isActive
                      ? 'bg-primary text-white'
                      : 'text-gray-300 hover:bg-dark-700 hover:text-white'
                  }`}
                >
                  <item.icon
                    className={`mr-3 flex-shrink-0 h-6 w-6 ${
                      isActive ? 'text-white' : 'text-gray-400'
                    }`}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User info */}
          <div className="flex-shrink-0 flex border-t border-dark-700 p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white font-medium">A</span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-white">Admin</p>
                <p className="text-xs text-gray-400">admin@digitalwise.id</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="ml-64">
        {/* Top bar */}
        <header className="bg-white shadow-sm h-16 flex items-center justify-between px-6">
          <div className="flex items-center">
            <h1 className="text-lg font-semibold text-gray-900">
              DigitalWise Admin Panel
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <button className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">View notifications</span>
              <BellIcon className="h-6 w-6" aria-hidden="true" />
            </button>
            <button className="text-gray-400 hover:text-gray-500">
              <ArrowLeftOnRectangleIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
