'use client';

import { useState } from 'react';
import { FiMenu, FiHome, FiSettings, FiX, FiMail, FiUsers, FiDatabase, FiServer, FiPhone } from 'react-icons/fi';
import Home from './home';
import { useUser } from '@clerk/nextjs';
import IntakeForm from './intakeForm';
import OurServices from './ourServices/page';
import ContactUs from './contactUs/page';

export default function HamburgerMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen((prev) => !prev);
  const { user, isSignedIn } = useUser();
  const [currentPage, setCurrentPage] = useState('home'); 

  const handleMenuClick = (page: string) => {
    setCurrentPage(page);  
    setIsOpen(false); 
  };

  // Function to apply active class to the icon
  const getActiveClass = (page: string) => {
    return currentPage === page ? 'text-blue-500' : '';  
  };

  return (
    <div className="h-screen grid grid-cols-[auto_1fr]">
      <button
        className="absolute top-4 left-4 z-50 p-2 bg-white shadow rounded-md"
        onClick={toggleMenu}>
        {isOpen ? <FiX size={20} /> : <FiMenu size={20} />}
      </button>
      
      {/* Sidebar */}
      <div
        className={`bg-gray-900 text-white transition-all duration-300 ${isOpen ? 'w-64' : 'w-16'}`}>
        
        {/* Home */}
        <div
          className={`p-4 flex items-center space-x-3 cursor-pointer hover:bg-gray-100 hover:text-black rounded-lg transition ${getActiveClass('home')}`}
          onClick={() => handleMenuClick('home')}>
          <FiHome size={24} />
          {isOpen && <span className="text-xl font-semibold">Home</span>}
        </div>

        {/* Intake Form */}
        
          <div
            className={`p-4 flex items-center space-x-3 cursor-pointer hover:bg-gray-100 rounded-lg transition hover:text-black ${getActiveClass('')}`}
            onClick={() => handleMenuClick('')}>
            <FiMail size={24} />
            {isOpen && <span>Mail</span>}
          </div>
     

        {/* Settings */}
        <div
          className={`p-4 flex items-center space-x-3 cursor-pointer hover:bg-gray-100 hover:text-black rounded-lg transition ${getActiveClass('settings')}`}
          onClick={() => handleMenuClick('settings')}>
          <FiSettings size={24} />
          {isOpen && <span>Settings</span>}
        </div>
        
        {/* Our Services */}
        <div
          className={`p-4 flex items-center space-x-3 cursor-pointer hover:bg-gray-100 hover:text-black rounded-lg transition ${getActiveClass('our-services')}`}
          onClick={() => handleMenuClick('our-services')}>
          <FiServer size={24} />
          {isOpen && <span>Our-Services</span>}
        </div>
        
        {/* Intake Question */}
        <div
          className={`p-4 flex items-center space-x-3 cursor-pointer hover:bg-gray-100 hover:text-black rounded-lg transition ${getActiveClass('intake-form')}`}
          onClick={() => handleMenuClick('intake-form')}>
          <FiDatabase size={24} />
          {isOpen && <span>Intake Question</span>}
        </div>
        <div
          className={`p-4 flex items-center space-x-3 cursor-pointer hover:bg-gray-100 hover:text-black rounded-lg transition ${getActiveClass('contact-us')}`}
          onClick={() => handleMenuClick('contact-us')}>
          <FiPhone size={24} />
          {isOpen && <span>Intake Question</span>}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative p-6">
        <div className="flex-1 p-4">
          {currentPage === 'home' && (isSignedIn ? <Home/> : <Home  />)}  {/* Show Home */}
          {currentPage === 'our-services' && <OurServices />}  {/* Show RegisterClient */}
          {currentPage === 'intake-form' && (isSignedIn ? <IntakeForm /> : <Home />)}  {/* Show IntakeForm or Home based on auth */}
          {currentPage === 'contact-us' && <ContactUs/> }  {/* Show Settings */}
        </div>
      </div>
    </div>
  );
}
