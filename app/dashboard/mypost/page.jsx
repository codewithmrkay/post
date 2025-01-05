"use client";
import Posts from "@/app/component/Posts";
import { useState } from "react";

export default function Insight() {
  const [refreshPosts, setRefreshPosts] = useState(false);
  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">POST</h2>
<div>
  <Posts key={refreshPosts}/>
  </div>    
  </div>
  )
}

