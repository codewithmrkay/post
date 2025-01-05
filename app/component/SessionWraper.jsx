"use client"
import React from 'react'
import { SessionProvider } from "next-auth/react"
function SessionWraper({ children }) {
    return (
        <SessionProvider>{children}</SessionProvider>
    )
}
export default SessionWraper