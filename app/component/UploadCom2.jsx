'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Upload from './Upload'
const UploadCom2 = () => {
    const [showGrid, setShowGrid] = useState(false)
    const [isPosted, setIsPosted] = useState(false)
    const [refreshPosts, setRefreshPosts] = useState(false)

    const toggleGrid = () => {
        setShowGrid(!showGrid)
    }

    // Dummy data for media items
    const mediaArray = [
        { type: 'image', src: '/h1.jpg' },
        { type: 'image', src: '/h2.jpg' },
        { type: 'image', src: '/h3.jpg' },
        { type: 'video', src: '/h4.mp4' },
        { type: 'video', src: '/h5.mp4' },
        { type: 'video', src: '/h6.mp4' },
        { type: 'video', src: '/h7.mp4' },
        { type: 'image', src: '/r1.jpg' },
        { type: 'image', src: '/r2.webp' },
        { type: 'video', src: '/r3.mp4' },
        { type: 'video', src: '/r4.mp4' },
        { type: 'video', src: '/r5.mp4' },
        { type: 'video', src: '/r6.mp4' },
    ]

    const handleUploadComplete = () => {
        setRefreshPosts(!refreshPosts)
    }

    const handlePostAll = async () => {
        try {
            // Post each media item to the database
            for (const media of mediaArray) {
                const formData = new FormData()

                // Fetch the file and create a File object
                const response = await fetch(media.src)
                const blob = await response.blob()
                const file = new File([blob], `file-${Date.now()}.${media.type === 'video' ? 'mp4' : 'jpg'}`, {
                    type: media.type === 'video' ? 'video/mp4' : 'image/jpeg'
                })

                formData.append('file', file)

                // Upload the file using the same API endpoint as individual uploads
                const uploadResponse = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData,
                })

                if (!uploadResponse.ok) {
                    throw new Error(`Failed to upload ${media.src}`)
                }
            }

            // Update state to show all items have been posted
            setIsPosted(true)
            handleUploadComplete()
        } catch (error) {
            console.error('Error posting all media:', error)
            alert('Failed to post all media. Please try again.')
        }
    }

    return (
        <div className="mx-auto p-4">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <div className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
                    <Upload onUploadComplete={handleUploadComplete} />
                </div>
                <button
                    className="w-full py-2 px-4 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                    onClick={toggleGrid}
                >
                    Try Dummy Data
                </button>
            </div>

            <AnimatePresence>
                {showGrid && (
                    <>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            transition={{ duration: 0.3 }}
                            className="mt-8 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                        >
                            {mediaArray.map((media, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    transition={{ duration: 0.2, delay: index * 0.05 }}
                                    className="aspect-square bg-gray-200 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                                >
                                    <div key={index}>
                                        {media.type === 'image' ? (
                                            <img
                                                src={media.src}
                                                alt={`media-${index}`}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <video
                                                controls
                                                preload='auto'
                                                autoPlay
                                                muted
                                                loop
                                                className="w-full h-full object-cover"
                                            >
                                                <source src={media.src} type="video/mp4" />
                                                Your browser does not support the video tag.
                                            </video>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="mt-6 flex justify-center"
                        >
                            <button
                                onClick={handlePostAll}
                                disabled={isPosted}
                                className={`py-3 px-6 rounded-lg text-white font-medium transition-colors ${isPosted
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-blue-500 hover:bg-blue-600'
                                    }`}
                            >
                                {isPosted ? 'Already Posted' : 'Post All'}
                            </button>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    )
}

export default UploadCom2
