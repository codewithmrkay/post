'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home ,TableCellsMerge, PlusCircleIcon, Compass, User, MessageCircleCode, PanelLeft } from 'lucide-react'

export function Sidebar({ children }) {
  const [isOpen, setIsOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768)
      setIsOpen(window.innerWidth >= 768)
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)

    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  const navItems = [
    { name: 'Home', icon: <Home className="w-5 h-5" />, href: '/dashboard/home' },
    { name: 'Profile', icon: <User className="w-5 h-5" />, href: '/dashboard/profile' },
    { name: 'Upload', icon: <PlusCircleIcon className="w-5 h-5" />, href: '/dashboard/upload' },
    { name: 'MyPost', icon: <TableCellsMerge className="w-5 h-5" />, href: '/dashboard/mypost' },
    { name: 'Insight', icon: <Compass className="w-5 h-5" />, href: '/dashboard/insight' },
    { name: 'Chat', icon: <MessageCircleCode className="w-5 h-5" />, href: '/dashboard/chat' },
  ]

  return (
    <div className="flex min-h-screen bg-black">
      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 z-40
          h-full bg-[#1C1C1C] 
          transition-all duration-300 ease-in-out
          ${isOpen ? 'w-64' : 'w-0 md:w-16'}
          ${isMobile && !isOpen ? '-translate-x-[150%]' : 'translate-x-0'}
        `}
      >
        {/* Header */}
        <div className="p-4 border-b-2 border-gray-800">
          <h2 className={`${!isOpen && 'md:hidden'}`}>
          <img src={'/trend-iq-icon.png'} alt="" width={130} 
        />
          </h2>
        </div>
        {/* Navigation */}
        <nav className="py-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`
                    flex items-center gap-4 px-4 py-2
                    text-gray-400 hover:text-white
                    hover:bg-gray-800 transition-colors
                    ${pathname === item.href ? 'bg-gray-800 text-white' : ''}
                  `}
                >
                  {item.icon}
                  <span className={`${isOpen ? 'opacity-100' : 'opacity-0 md:hidden'} transition-opacity duration-200`}>
                    {item.name}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Overlay for mobile */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={toggleSidebar}
        />
      )}

      {/* Main content */}
      <main className={`flex-1 p-4 transition-all duration-300 bg-[#1c1c1c] 
      border-gray-800 border-l-2
        ${isOpen ? 'md:ml-64' : 'md:ml-16'} ${isOpen ? 'z-0' : 'z-50'}`}>
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={toggleSidebar}
            className="p-2 hover:bg-gray-800 rounded-lg"
            aria-label="Toggle sidebar"
          >
            <PanelLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-xl text-white">
            {pathname=='/dashboard/home' ? 'Home' : pathname=='/dashboard/profile' ? 'Profile' : pathname=='/dashboard/upload' ? 'Upload' : pathname=='/dashboard/mypost' ? 'MyPost' : pathname=='/dashboard/insight' ? 'Insight' :
             pathname=='/dashboard/chat' ? 'Chat' : 'Home'}
            </h1>
        </div>
        {children}
      </main>
    </div>
  )
}

