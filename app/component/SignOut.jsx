// app/components/SignOutButton.js
'use client';
import { useRouter } from 'next/navigation'; // Updated import
import { signOut } from 'next-auth/react';
import { LogOut } from 'lucide-react';

export default function SignOutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/');
  };

  return (
    <button
    className='flex gap-2 items-center justify-center bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg'
    onClick={handleSignOut}>
      Sign out
      <LogOut size={24} color="white" />
      </button>
  );
}
