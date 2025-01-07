'use client'

import { useState, useEffect } from 'react';
import { BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Loader } from 'lucide-react';

export default function Insights() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [topItems, setTopItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchInsightsData();
  }, []);

  const fetchInsightsData = async () => {
    setError(null);
    try {
      const response = await fetch('/api/insights');
      if (!response.ok) {
        throw new Error('Failed to fetch insights data');
      }
      const insightsData = await response.json();
      setData(insightsData.aggregatedData);
    } catch (error) {
      console.error('Error fetching insights data:', error);
      setError('Failed to load insights data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const fetchTopItems = async (category) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/insights?category=${category}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch top ${category} items`);
      }
      const topItemsData = await response.json();
      setTopItems(topItemsData);
      setSelectedCategory(category);
    } catch (error) {
      console.error(`Error fetching top ${category} items:`, error);
      setError(`Failed to load top ${category} items. Please try again later.`);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toFixed(0);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Content Reach Insights</h2>
        <p className="text-red-500">{error}</p>
        <button 
          onClick={fetchInsightsData} 
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Content Reach Insights</h2>
      
      {/* Bar Chart */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-2">Engagement Comparison</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis tickFormatter={formatNumber} />
            <Tooltip formatter={(value) => formatNumber(value)} />
            <Legend />
            <Bar dataKey="images" fill="#8884d8" name="Images" />
            <Bar dataKey="videos" fill="#82ca9d" name="Videos/Reels" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Radar Chart */}
      {/* <div className="mb-8">
        <h3 className="text-xl font-semibold mb-2">Overall Performance</h3>
        <ResponsiveContainer width="100%" height={400}>
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
            <PolarGrid />
            <PolarAngleAxis dataKey="name" />
            <PolarRadiusAxis angle={30} domain={[0, 'auto']} />
            <Radar name="Images" dataKey="images" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
            <Radar name="Videos/Reels" dataKey="videos" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
            <Legend />
            <Tooltip formatter={(value) => formatNumber(value)} />
          </RadarChart>
        </ResponsiveContainer>
      </div> */}

      {/* Top Items Buttons */}
      <div className="flex justify-center gap-4 mb-8">
        <button
          onClick={() => fetchTopItems('reach')}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Most Reach
        </button>
        <button
          onClick={() => fetchTopItems('views')}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Most Views
        </button>
        <button
          onClick={() => fetchTopItems('likes')}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Most Likes
        </button>
      </div>

      {/* Top Items Display */}
      {topItems.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-4">Top 5 Items by {selectedCategory}</h3>
          <ul className="space-y-4">
            {topItems.map((item, index) => (
              <li key={item._id} className="border border-gray-200 rounded-lg p-4 flex items-center">
                <span className="text-2xl font-bold mr-4">#{index + 1}</span>
                <div className="flex-grow">
                  <h4 className="font-semibold">{item.fileName}</h4>
                  <p className="text-sm text-gray-300">Type: {item.fileType}</p>
                  <p className="text-sm text-gray-300">
                    {selectedCategory === 'reach' && `Reach: ${formatNumber(item.reach)}`}
                    {selectedCategory === 'views' && `Views: ${formatNumber(item.views)}`}
                    {selectedCategory === 'likes' && `Likes: ${formatNumber(item.likes)}`}
                  </p>
                </div>
                <div className="w-20 h-20 flex-shrink-0">
                  {item.fileType.startsWith('image') ? (
                    <img 
                      src={`data:${item.fileType};base64,${item.fileData}`} 
                      alt={item.fileName}
                      className="w-full h-full object-cover rounded-md"
                    />
                  ) : item.fileType.startsWith('video') ? (
                    <video 
                      className="w-full h-full object-cover rounded-md"
                      controls
                    >
                      <source src={`data:${item.fileType};base64,${item.fileData}`} type={item.fileType} />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-md">
                      <span className="text-gray-500">No preview</span>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

