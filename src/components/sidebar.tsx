'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { useUser, useClerk } from '@clerk/nextjs';

const navItems = [
  { href: '/', label: 'Home', icon: '🏠' },
  { href: '/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/transactions', label: 'Transactions', icon: '💸' },
  { href: '/categories', label: 'Categories', icon: '📂' },
  { href: '/alerts', label: 'Alerts', icon: '🔔' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);


  const { user } = useUser();
  const { signOut } = useClerk();



 

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden flex justify-between items-center p-4 bg-white dark:bg-gray-900 shadow-md sticky top-0 z-50 w-full">
        <h1 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Finance Tracker</h1>
        <button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="w-6 h-6 text-gray-800 dark:text-gray-100" /> : <Menu className="w-6 h-6 text-gray-800 dark:text-gray-100" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`bg-white dark:bg-gray-900 w-64 border-r border-gray-200 dark:border-gray-700 px-6 py-8 space-y-6 absolute md:relative z-40 transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 hidden md:block mb-8">Finance Tracker</h2>
        
        {/* Navigation */}
        <nav className="flex flex-col space-y-4 mb-8">
          {navItems.map(({ href, label, icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-2 px-3 py-2 rounded-md transition font-medium ${
                pathname === href
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <span>{icon}</span>
              {label}
            </Link>
          ))}
        </nav>

        
        {/* Clerk User Info & Logout */}
        {user && (
          <div className="border-t border-gray-300 dark:border-gray-700 pt-4">
            <p className="mb-2 font-semibold text-gray-900 dark:text-gray-100">
              {user.fullName || user.primaryEmailAddress?.emailAddress || 'User'}
            </p>
            <button
              onClick={() => signOut()}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-md transition"
            >
              Log Out
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
