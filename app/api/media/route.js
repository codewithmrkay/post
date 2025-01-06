import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import Media from '../../../models/Media';

export async function GET(req) {
  await dbConnect();

  const { searchParams } = new URL(req.url);
  const fileType = searchParams.get('fileType');
  const fileName = searchParams.get('fileName');

  let query = {};

  if (fileType) {
    query = { ...query, fileType };
  }

  if (fileName) {
    query = { ...query, fileName: { $regex: fileName, $options: 'i' } };
  }

  const media = await Media.find(query);

  return NextResponse.json(media);
}
