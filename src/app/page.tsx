'use client';
import React from 'react';
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs';
import Link from 'next/link';


function Navbar() {
  return (
    <div>
      <nav className="bg-white border-b shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-6 py-3 flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="text-2xl font-extrabold text-indigo-600 tracking-wide hover:opacity-90">
            LOGIN TO CLERK
          </Link>

          {/* Navigation Actions */}
          <div className="flex items-center gap-4">
            <SignedOut>
              <SignInButton>
                <button className="px-4 py-2 rounded-full border border-black bg-white text-sm font-medium hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] hover:-translate-y-[1px] transition-all duration-200">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton>
                <button className="px-4 py-2 rounded-full border border-black bg-black text-white text-sm font-medium hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] hover:-translate-y-[1px] transition-all duration-200">
                  Sign Up
                </button>
              </SignUpButton>
            </SignedOut>

            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>
      </nav>

    </div>
  );
}

export default Navbar;
