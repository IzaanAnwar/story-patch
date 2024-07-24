import { db } from '@/db';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (req: NextRequest) => {
  try {
    const allStories = await db.query.stories.findMany({
      with: { allikes: true, patches: true },
    });

    return NextResponse.json({
      stories: allStories,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error?.message ?? 'Something went wrong. Please try again',
      },
      { status: 500 }
    );
  }
};
