// 'use client'

// import { useState, useEffect } from 'react';

// export default function Posts() {
//   const [media, setMedia] = useState([]);
//   const [fileType, setFileType] = useState('');
//   const [fileName, setFileName] = useState('');

//   useEffect(() => {
//     fetchMedia();
//   }, []);

//   const fetchMedia = async () => {
//     const res = await fetch(`/api/media?fileType=${fileType}&fileName=${fileName}`);
//     const data = await res.json();
//     setMedia(data);
//   };

//   const toggleMetrics = (id) => {
//     setMedia(media.map(item => 
//       item._id === id ? {...item, showMetrics: !item.showMetrics} : item
//     ));
//   };

// }
'use client'

import { useState, useEffect } from 'react';
import { Heart, Eye, MessageCircle, Share2, BarChart2 , Loader } from 'lucide-react';
export default function Posts() {
    const [media, setMedia] = useState([]);
    const [fileType, setFileType] = useState('');
    const [fileName, setFileName] = useState('');
    const [loading, setLoading] = useState(true);
    const [showStats, setShowStats] = useState({});
    const [error, setError] = useState(null);
    const toggleStats = (id) => {
        setShowStats(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    useEffect(() => {
        fetchMedia();
    }, []);

    const fetchMedia = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/media');
            if (!response.ok) {
              throw new Error('Failed to fetch posts');
            }
            const data = await response.json();
            setMedia(data);
          } catch (error) {
            console.error('Error fetching posts:', error);
            setError('Failed to load posts. Please try again later.');
          } finally {
            setLoading(false);
          }
    };
    if (loading) {
        return (
          <div className="flex justify-center items-center h-[70vh]">
            <Loader className="w-8 h-8 animate-spin text-white" />
          </div>
        );
      }
    
      if (error) {
        return (
          <div className="text-center text-red-500 mt-8">
            <p>{error}</p>
            <button 
              onClick={fetchPosts}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Retry
            </button>
          </div>
        );
      }
        return (
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {media.map((item) => (
                        <div key={item._id} className="relative group aspect-square shadow-xl rounded-lg bg-gray-900 ">
                            {/* Media Content */}
                            <div className="w-full h-full rounded-lg overflow-hidden">
                                {item.fileType?.startsWith('image') ? (
                                    <img
                                        src={`data:${item.fileType};base64,${item.fileData}`}
                                        alt={item.fileName}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <video autoPlay muted loop className="w-full h-full object-cover">
                                        <source src={`data:${item.fileType};base64,${item.fileData}`} />
                                    </video>
                                )}
                            </div>

                            {/* Stats Button */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    toggleStats(item._id);
                                }}
                                className="absolute top-3 right-3 z-20 p-2 bg-black backdrop-blur-sm rounded-full 
                         opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-gray-600 hover:"
                            >
                                <BarChart2 className="w-5 h-5 text-white" />
                            </button>

                            {/* Stats Overlay */}
                            {showStats[item._id] && (
                                <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center
                           transition-all duration-300 z-10">
                                    <div className="grid grid-cols-2 gap-6 p-4">
                                        <div className="flex flex-col items-center text-white">
                                            <Heart className="w-6 h-6 text-red-500 mb-1" />
                                            <span className="text-lg font-semibold">{item.likes || 0}</span>
                                            <span className="text-xs opacity-75">Likes</span>
                                        </div>
                                        <div className="flex flex-col items-center text-white">
                                            <Eye className="w-6 h-6 text-blue-500 mb-1" />
                                            <span className="text-lg font-semibold">{item.views || 0}</span>
                                            <span className="text-xs opacity-75">Views</span>
                                        </div>
                                        <div className="flex flex-col items-center text-white">
                                            <MessageCircle className="w-6 h-6 text-green-500 mb-1" />
                                            <span className="text-lg font-semibold">{item.comments || 0}</span>
                                            <span className="text-xs opacity-75">Comments</span>
                                        </div>
                                        <div className="flex flex-col items-center text-white">
                                            <Share2 className="w-6 h-6 text-yellow-500 mb-1" />
                                            <span className="text-lg font-semibold">{item.shares || 0}</span>
                                            <span className="text-xs opacity-75">Shares</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Hover Info */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent
                         opacity-0 group-hover:opacity-100 transition-all duration-200 flex flex-col justify-end p-4">
                                <h3 className="text-white font-medium truncate">{item.fileName}</h3>
                                <p className="text-gray-200 text-sm">{item.fileType}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
