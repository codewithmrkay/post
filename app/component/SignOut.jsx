// app/components/SignOutButton.js
'use client';
import { useRouter } from 'next/navigation'; // Updated import
import { signOut } from 'next-auth/react';

export default function SignOutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/');
  };

  return (
    <button onClick={handleSignOut}>Sign out</button>
  );
}
