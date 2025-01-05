// app/dashboard/page.js
"use client"
import { useSession, signOut } from 'next-auth/react'
import SignOutButton from "../component/SignOut";
import { Sidebar } from '../component/Sidebar';
import { redirect } from 'next/navigation';

export default function Dashboard() {
  const { data: session } = useSession();
  console.log(session)
      return (
        redirect('/dashboard/home')
    );
  }
  