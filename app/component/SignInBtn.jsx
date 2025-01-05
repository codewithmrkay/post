// app/components/SignInButton.js
'use client';
import { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation';
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
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : session ? (
        <p>Redirecting...</p>
      ) : (
        <button onClick={handleSignIn}>Get Started</button>
      )}
    </div>
  );
}
