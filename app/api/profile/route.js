import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import UserProfile from '@/models/UserProfile';

export async function GET(req) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  try {
    let profile = await UserProfile.findOne({ email });
    if (!profile) {
      profile = await UserProfile.create({ email, username: email.split('@')[0] });
    }
    return NextResponse.json(profile);
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}

export async function POST(req) {
  await dbConnect();
  const data = await req.json();

  if (!data.email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  try {
    const profile = await UserProfile.findOneAndUpdate(
      { email: data.email },
      { $set: data },
      { new: true, upsert: true }
    );
    return NextResponse.json(profile);
  } catch (error) {
    console.error('Error saving profile:', error);
    return NextResponse.json({ error: 'Failed to save profile' }, { status: 500 });
  }
}

