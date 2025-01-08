import { ProfileCom } from "@/app/component/ProfileComponent";
import { useSession, signOut } from 'next-auth/react'
export default function Profile() {
    return (
      <div className=" p-4 rounded-lg flex flex-col items-center justify-center h-[80vh] gap-8">
        <ProfileCom/>
      </div>
    )
  }
  
  