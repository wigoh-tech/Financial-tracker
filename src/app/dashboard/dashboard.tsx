"use client";

import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs";

export default function Dashboard() {
  return (
    <>
      <SignedIn>
        <div className="p-8">
          <h1 className="text-2xl font-bold">Welcome to your dashboard!</h1>
        </div>
      </SignedIn>

      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}
