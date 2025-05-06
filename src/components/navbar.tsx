import { SignInButton, SignOutButton } from "@clerk/nextjs"
import React from "react"

export default function Navbar(){
    return <div>
    <SignInButton>
        <button>SIGN IN </button> 
    </SignInButton>
    <SignOutButton>SIGN OUT</SignOutButton>
    </div>
}

