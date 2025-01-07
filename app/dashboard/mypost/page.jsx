"use client";
import Posts from "@/app/component/Posts";
import { useEffect, useState } from "react";
import { Trash2, Loader } from 'lucide-react';
export default function Insight() {
  const [refreshPosts, setRefreshPosts] = useState(false);

  const [media, setMedia] = useState([]);
  const [fileType, setFileType] = useState('');
  const [fileName, setFileName] = useState('');
  const [isClearing, setIsClearing] = useState(false);

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    const res = await fetch(`/api/media?fileType=${fileType}&fileName=${fileName}`);
    const data = await res.json();
    setMedia(data);
  };

  const handleClearAll = async () => {
    if (!confirm('Are you sure you want to clear all posts? This action cannot be undone.')) {
      return;
    }

    setIsClearing(true);
    try {
      const response = await fetch('/api/posts/clear', {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to clear posts');
      }

      setMedia([]);
    } catch (error) {
      console.error('Error clearing posts:', error);
      alert('Failed to clear posts. Please try again.');
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">POST</h2>
<div>
  <div>
  <button
        onClick={handleClearAll}
        disabled={isClearing || media.length === 0}
        className={`absolute right-4 top-4 flex items-center gap-2 px-4 py-2 rounded-lg 
          ${isClearing || media.length === 0 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-red-500 hover:bg-red-600'} 
          text-white transition-colors duration-200`}
      >
        {isClearing ? (
          <>
            <Loader className="w-5 h-5 animate-spin" />
            <span>Clearing...</span>
          </>
        ) : (
          <>
            <Trash2 className="w-5 h-5" />
            <span>Clear All</span>
          </>
        )}
      </button>
  </div>
  <Posts key={refreshPosts}/>
  </div>    
  </div>
  )
}

