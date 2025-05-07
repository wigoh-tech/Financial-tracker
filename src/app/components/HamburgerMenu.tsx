'use client';

import Link from 'next/link';
import { useState } from 'react';
import { FiMenu, FiHome, FiSettings, FiX, FiMail, FiUsers, FiDatabase } from 'react-icons/fi';
import RegisterClient from './register-client';
import Home from './home';

export default function HamburgerMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen((prev) => !prev);
  const [showRegisterClient, setShowRegisterClient] = useState(false);

  const handleToggle = () => {
    setShowRegisterClient((prev) => !prev);
  };
  return (
    <div className="h-screen grid grid-cols-[auto_1fr]">
      <button
        className="absolute top-4 left-4 z-50 p-2 bg-white shadow rounded-md"
        onClick={toggleMenu}
      >
        {isOpen ? <FiX size={20} /> : <FiMenu size={20} />}
      </button>
      {/* Sidebar */}
      <div
        className={`bg-gray-900 text-white transition-all duration-300 ${isOpen ? 'w-64' : 'w-16'
          }`}
      >
        <div className="p-4 flex items-center space-x-3 cursor-pointer hover:bg-gray-100 rounded-lg transition">
          <FiHome size={24} />
          {isOpen && <span className="text-xl font-semibold">Home</span>}
        </div>

        <Link href="/components/intake-form">
          <div className="p-4 flex items-center space-x-3 cursor-pointer hover:bg-gray-100 rounded-lg transition">
            <FiMail size={24} />
            {isOpen && <span>Mail</span>}
          </div>
        </Link>

        <div className="p-4 flex items-center space-x-3 cursor-pointer hover:bg-gray-100 rounded-lg transition">
          <FiSettings size={24} />
          {isOpen && <span>Settings</span>}
        </div>
        <div
          className={`p-4 flex items-center space-x-3 cursor-pointer hover:bg-gray-100 rounded-lg transition ${showRegisterClient ? "bg-gray-200" : ""}`}
          onClick={handleToggle}
        >
          <FiUsers size={24} />
          {isOpen && <span>Create Client</span>}
        </div>
        <div className="p-4 flex items-center space-x-3 cursor-pointer hover:bg-gray-100 rounded-lg transition">
          <FiDatabase size={24} />
          {isOpen && <span>Intake Question</span>}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative p-6">
        <div className="flex-1 p-4">
          {showRegisterClient ? <RegisterClient /> : <Home />}
        </div>
      </div>
    </div>
  );
}
