import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import Media from '../../../models/Media';

export async function POST(req) {
  await dbConnect();

  const formData = await req.formData();
  const file = formData.get('file');

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  console.log('file', file);
  const fileName = file.name;
  const fileType = file.type;
  const fileData = buffer.toString('base64');

  const media = new Media({
    fileName,
    fileType,
    fileData,
    likes: Math.floor(Math.random() * 1000),
    views: Math.floor(Math.random() * 10000),
    comments: Math.floor(Math.random() * 100),
    shares: Math.floor(Math.random() * 500),
  });

  await media.save();

  return NextResponse.json(media);
}

