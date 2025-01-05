import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dbConnect from '../../../lib/mongodb';
import Media from '../../../models/Media';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

export async function POST(req) {
  await dbConnect();
  const { message } = await req.json();

  const mediaData = await Media.find({});

  const context = `You are a helpful assistant for a media application. 
  The application has ${mediaData.length} media items stored. 
  Here's a summary of the data: 
  ${mediaData.map(item => `
    - File: ${item.fileName}
    - Type: ${item.fileType}
    - Likes: ${item.likes}
    - Views: ${item.views}
    - Comments: ${item.comments}
    - Shares: ${item.shares}
  `).join('\n')}
  
  When appropriate, use markdown to format your responses. You can create tables and even simple charts using the following syntax:
  
  For tables:
  | Column 1 | Column 2 |
  | -------- | -------- |
  | Data 1   | Data 2   |
  
  For charts:
  \`\`\`chart
  [
    {"name": "Category 1", "value": 400},
    {"name": "Category 2", "value": 300},
    {"name": "Category 3", "value": 200}
  ]
  \`\`\`
  `;

  try {
    const result = await model.generateContent([context, message]);
    const response = await result.response;
    let text = response.text();

    // Example of adding a table if asked about file types
    if (message.toLowerCase().includes('file types')) {
      const fileTypes = [...new Set(mediaData.map(item => item.fileType))];
      const tableRows = fileTypes.map(type => `| ${type} | ${mediaData.filter(item => item.fileType === type).length} |`).join('\n');
      text += `\n\nHere's a breakdown of file types:\n\n| File Type | Count |\n| --------- | ----- |\n${tableRows}`;
    }

    // Example of adding a chart if asked about engagement
    if (message.toLowerCase().includes('engagement')) {
      const engagementData = [
        { name: 'Likes', value: mediaData.reduce((sum, item) => sum + item.likes, 0) },
        { name: 'Views', value: mediaData.reduce((sum, item) => sum + item.views, 0) },
        { name: 'Comments', value: mediaData.reduce((sum, item) => sum + item.comments, 0) },
        { name: 'Shares', value: mediaData.reduce((sum, item) => sum + item.shares, 0) }
      ];
      text += `\n\nHere's a chart of the total engagement:\n\n\`\`\`chart\n${JSON.stringify(engagementData)}\n\`\`\``;
    }

    return NextResponse.json({ reply: text });
  } catch (error) {
    console.error('Error generating chat response:', error);
    return NextResponse.json({ error: 'Failed to generate response' }, { status: 500 });
  }
}

