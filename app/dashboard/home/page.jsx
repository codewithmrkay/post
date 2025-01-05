'use client'
import React, { useEffect, useState } from 'react'
import { motion } from "framer-motion"
import SignOutButton from '@/app/component/SignOut';
function page() {
  const [c, setC] = useState(55);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setC(30);
      } else {
        setC(55); // Set the value for larger screens if needed
      }
    };

    handleResize(); // Call initially to set the correct value on mount
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return (
    <div className="bg-gray-800 p-4 rounded-lg flex flex-col items-center justify-center h-[80vh] gap-8">
      <div>
        {/* Rombo logo */}
        <div className="flex items-baseline">
          {["T", "R", "E", "N", "D", "I", "Q"].map((letter, index) => (
            <motion.span
              key={index}
              className="text-[10vw] font-bold text-white cursor-default"
              animate={{
                y: [0, -c, 0],
                transition: {
                  duration: 1.5,
                  ease: "easeInOut",
                  delay: index * 0.1,
                  repeat: Infinity,
                  repeatDelay: 2
                }
              }}
            >
              {letter}
            </motion.span>
          ))}
        </div>
      </div>
      <div className='w-[40vw] motion-preset-seesaw-sm'>
        <div className="flex items-center justify-center text-white bg-[#1c1c1c] hover:bg-gray-600  text-xl py-2 rounded-lg w-full"><SignOutButton /></div>
      </div>
    </div>
  )
}

export default page

