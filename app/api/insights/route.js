import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Media from '@/models/Media';
export async function GET(req) {
  await dbConnect();

  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');

  try {
    if (category) {
      // Fetch top 5 items for the specified category
      let sortField;
      if (category === 'reach') {
        sortField = { reach: -1 };
      } else if (['views', 'likes', 'comments', 'shares'].includes(category)) {
        sortField = { [category]: -1 };
      } else {
        throw new Error('Invalid category');
      }

      const topItems = await Media.aggregate([
        { 
          $addFields: { 
            reach: { $add: ['$likes', '$views', '$comments', '$shares'] } 
          } 
        },
        { $sort: sortField },
        { $limit: 5 },
        { 
          $project: { 
            fileName: 1, 
            fileType: 1, 
            likes: 1, 
            views: 1, 
            comments: 1, 
            shares: 1,
            reach: 1,
            fileData: 1 // Include full file data
          }
        }
      ]);

      return NextResponse.json(topItems);
    } else {
      // Fetch aggregated data for charts
      const imageData = await Media.aggregate([
        { $match: { fileType: { $regex: /^image/ } } },
        { 
          $group: {
            _id: null,
            totalLikes: { $sum: '$likes' },
            totalViews: { $sum: '$views' },
            totalComments: { $sum: '$comments' },
            totalShares: { $sum: '$shares' },
            count: { $sum: 1 }
          }
        }
      ]);

      const videoData = await Media.aggregate([
        { $match: { fileType: { $regex: /^video/ } } },
        { 
          $group: {
            _id: null,
            totalLikes: { $sum: '$likes' },
            totalViews: { $sum: '$views' },
            totalComments: { $sum: '$comments' },
            totalShares: { $sum: '$shares' },
            count: { $sum: 1 }
          }
        }
      ]);

      const imageStats = imageData[0] || { totalLikes: 0, totalViews: 0, totalComments: 0, totalShares: 0, count: 0 };
      const videoStats = videoData[0] || { totalLikes: 0, totalViews: 0, totalComments: 0, totalShares: 0, count: 0 };

      const aggregatedData = [
        {
          name: 'Likes',
          images: imageStats.totalLikes / imageStats.count || 0,
          videos: videoStats.totalLikes / videoStats.count || 0,
        },
        {
          name: 'Views',
          images: imageStats.totalViews / imageStats.count || 0,
          videos: videoStats.totalViews / videoStats.count || 0,
        },
        {
          name: 'Comments',
          images: imageStats.totalComments / imageStats.count || 0,
          videos: videoStats.totalComments / videoStats.count || 0,
        },
        {
          name: 'Shares',
          images: imageStats.totalShares / imageStats.count || 0,
          videos: videoStats.totalShares / videoStats.count || 0,
        },
      ];

      return NextResponse.json({ aggregatedData });
    }
  } catch (error) {
    console.error('Error fetching insights data:', error);
    return NextResponse.json({ error: 'Failed to fetch insights data' }, { status: 500 });
  }
}







