import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import DownloadCSVButton from '@/components/downloadcsvbutton';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-between bg-gradient-to-b from-purple-100 to-pink-150 px-4 py-6">
      
      {/* Logo */}
      <div className="pt-4">
        <Image
          src="/wigoh.png"
          alt="Finance Tracker Logo"
          width={270}
          height={120}
          className="mx-auto"
        />
      </div>

      {/* Main Content Card */}
      <main className="flex-grow flex items-center justify-center w-full">
        <div className="bg-white rounded-3xl shadow-lg p-10 w-full max-w-xl text-center border border-gray-200">
          <h1 className="text-3xl font-extrabold text-black-700 mb-4">
            Welcome to Your Finance Tracker
          </h1>
          <p className="text-gray-600 text-base mb-6 leading-relaxed">
            Track your spending, categorize expenses, and take control of your financial goals with ease.
          </p>

          <div className="mb-4">
            <h2 className="text-lg font-semibold text-black-600 mb-2">Export Transactions</h2>
            <DownloadCSVButton month="2025-05" />
          </div>
        </div>
      </main>

      {/* Footer Links */}
      <footer className="w-full text-center text-sm text-black-600 mt-6 space-x-6 pb-4">
        <Link href="/contact" className="hover:underline">Contact Us</Link>
        <Link href="/settings" className="hover:underline">Settings</Link>
        <Link href="/help" className="hover:underline">Help Center</Link>
      </footer>
    </div>
  );
}
