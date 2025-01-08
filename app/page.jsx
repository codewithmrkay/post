'use client'
import React, { useEffect, useState } from 'react'
import { motion } from "framer-motion"
import SignInButton from './component/SignInBtn'

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
    <div className="flex flex-col items-center justify-center bg-gradient-to-br from-purple-500 to-indigo-900 p-4 rounded-lg min-h-screen">
      <div>
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
      </div>
      <div className="motion-preset-confetti cursor-pointer flex "><SignInButton />
      </div>
    </div>
  )
}

export default page