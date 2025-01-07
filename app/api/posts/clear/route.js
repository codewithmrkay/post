import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Media from '@/models/Media';

export async function DELETE(req) {
  await dbConnect();
  
  try {
    await Media.deleteMany({});
    return NextResponse.json({ message: 'All posts cleared successfully' });
  } catch (error) {
    console.error('Error clearing posts:', error);
    return NextResponse.json({ error: 'Failed to clear posts' }, { status: 500 });
  }
}

