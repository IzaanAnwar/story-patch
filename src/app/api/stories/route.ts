import { db } from '@/db';
import { createUser } from '@/server/users';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export const GET = async (req: NextRequest) => {
  try {
    const { error, message, exists } = await createUser();
    console.log({ error, message, exists });

    const allStories = await db.query.stories.findMany({
      with: { allikes: true, patches: true },
      orderBy: (stories, { desc }) => [
        desc(stories.likes),
        desc(stories.createdAt),
      ],
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
