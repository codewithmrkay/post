import React from 'react'
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
const hadler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
          })
    ],
    secret: process.env.NEXTAUTH_SECRET,
  })
export {hadler as GET , hadler as POST}  