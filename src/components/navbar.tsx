import { SignInButton, SignUpButton } from "@clerk/nextjs"
import React from "react"

export default function Navbar(){
    return <div>
    <SignInButton>SIGN IN</SignInButton>
    <SignUpButton>SIGN up</SignUpButton>
    </div>

}

