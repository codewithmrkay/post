'use client'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Camera } from 'lucide-react'
import { useSession } from 'next-auth/react';
export function ProfileCom() {
  const { data: session } = useSession();
  const [email, setEmail] = useState('user@example.com')
  const router = useRouter()
  const [username, setUsername] = useState('John Doe')
  const [bio, setBio] = useState('Web Developer | Coffee Enthusiast')
  const [profileImage, setProfileImage] = useState('/profile-icon.svg')
  const fileInputRef = useRef(null)

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfileImage(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }
  useEffect(() => { 
    if (session) { 
      setUsername(session?.user?.name || 'John Doe'); 
      setBio(session?.user?.bio || 'Web Developer | Coffee Enthusiast'); 
      setProfileImage(session?.user?.image || profileImage); 
      setEmail(session?.user?.email || 'user@example.com'); } }, [session]);
  const handleSave = () => {
    // Here you would typically send the updated profile data to your backend
    console.log('Saving profile:', { username, bio , email, profileImage })
    // For now, we'll just show an alert
    alert('Profile saved successfully!')
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="relative mb-6">
        <button 
          onClick={() => router.push('/dashboard/home')}
          className="absolute top-0 left-0 p-2 rounded-full text-gray-200 hover:text-gray-600 transition-colors"
          aria-label="Go back to home"
        >
            <div className='flex items-center gap-2'>
          <ArrowLeft className="w-6 h-6" />
          Go Back
            </div>
        </button>
      </div>
      <div className="text-center">
        <div className="relative inline-block">
          <img
            src={profileImage}
            alt="Profile picture"
            width={128}
            height={128}
            className="rounded-full bg-white border-2 border-blue-600"
          />
          <button 
            onClick={() => fileInputRef.current.click()}
            className="absolute bottom-0 right-0 p-2 bg-blue-600 rounded-full text-white hover:bg-blue-700 transition-colors"
            aria-label="Change profile picture"
          >
            <Camera className="w-4 h-4" />
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageChange} 
            className="hidden" 
            accept="image/*"
          />
        </div>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="mt-4 text-2xl  font-bold text-center w-full bg-transparent border-b border-gray-300 focus:border-blue-500 outline-none"
        />
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="w-full mt-4 text-gray-200 text-center bg-transparent border-b border-gray-300 focus:border-blue-500 outline-none resize-none"
          rows="2"
        />
        <div className=" cursor-not-allowed mt-4 text-gray-200"> {email} </div>
      </div>
      <button 
        onClick={handleSave}
        className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Save Profile
      </button>
    </div>
  )
}