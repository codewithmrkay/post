// app/components/SignInButton.js
'use client';
import { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation';
import { Loader } from 'lucide-react';
export default function SignInButton() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      // Redirect to dashboard if already signed in
      router.push('/dashboard');
    }
  }, [status, router]);

  const handleSignIn = async () => {
    setLoading(true);
    await signIn('google');
  };

  return (
    <div className='flex gap-2 items-center justify-center'>
      {loading ? (
        <>
          <Loader color='white' size={20} className="animate-spin"/>
          <p>Loading...</p>
        </>
      ) : session ? (
        <>
        <Loader color='white' size={25} className="animate-spin"/>
        <p>Redirecting...</p>
        </>
      ) : (
        <button 
        className= 'w-60 font-semibold bg-purple-800 hover:bg-purple-900 text-white px-4 py-2 rounded-lg'
        onClick={handleSignIn}>Get Started</button>
      )}
    </div>
  );
}
