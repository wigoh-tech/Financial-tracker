'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useUser, useClerk } from '@clerk/nextjs';
import Image from  '/home.svg';

const navItems = [
   { href: '/', label: 'Home', icon: '/home2.svg' },
  { href: '/dashboard', label: 'Dashboard', icon: 'images/dashboard2.svg' },
  { href: '/transactions', label: 'Transactions', icon: '/transaction.svg' },
  { href: '/categories', label: 'Categories', icon: '/category2.svg' },
  { href: '/alerts', label: 'Alerts', icon: 'alerts.svg' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const { user } = useUser();
  const { signOut } = useClerk();

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden flex justify-between items-center p-4 bg-white shadow-md sticky top-0 z-50 w-full">
        <h1 className="text-lg font-semibold text-gray-800">Finance Tracker</h1>
        <button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="w-6 h-6 text-gray-800" /> : <Menu className="w-6 h-6 text-gray-800" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`bg-white w-64 border-r border-gray-200 px-6 py-8 space-y-6 absolute md:relative z-40 transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <h2 className="text-2xl font-bold text-gray-900 hidden md:block mb-8">Finance Tracker</h2>

        {/* Navigation */}
        <nav className="flex flex-col space-y-4 mb-8">
  {navItems.map(({ href, label, icon }) => (
    <Link
      key={href}
      href={href}
      onClick={() => setIsOpen(false)}
      className={`flex items-center gap-2 px-3 py-2 rounded-md transition font-medium ${
        pathname === href
          ? 'bg-[#d4db6a] text-gray-900'
          : 'text-gray-700 hover:bg-gray-100'
      }`}
    >
      {typeof icon === 'string' && icon.endsWith('.svg') ? (
        <img src={icon} alt={`${label} icon`} className="w-5 h-5" />
      ) : (
        <span>{icon}</span>
      )}
      {label}
    </Link>
  ))}
</nav>


        {/* Clerk User Info & Logout */}
        {user && (
          <div className="border-t border-gray-300 pt-4">
            <p className="mb-2 font-semibold text-gray-900">
              {user.fullName || user.primaryEmailAddress?.emailAddress || 'User'}
            </p>
            <button
              onClick={() => signOut()}
              className="w-full bg-[#d4db6a] hover:bg-[rgb(202,209,86)] text-black font-semibold py-2 rounded-md transition"
            >
              Log Out
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
