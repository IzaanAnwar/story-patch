'use server';

import { z } from 'zod';
import { getCurrUser } from './users';
import { db } from '@/db';
import { and, eq } from 'drizzle-orm';
import { votes } from '@/db/schema';
import { revalidatePath } from 'next/cache';

/**
 * Handles voting logic for a user on a given patch. If the user has already voted for the patch, it removes the vote.
 * Otherwise, it registers a new vote.
 *
 */
export async function vote(data: {
  patchId: string;
  storyId: string;
}): Promise<{ success: boolean; message: string }> {
  try {
    const user = await getCurrUser();
    if (!user) {
      throw new Error('You are not logged in');
    }
    console.log({ data });

    const { patchId, storyId } = z
      .object({ patchId: z.string().uuid(), storyId: z.string().uuid() })
      .parse(data);
    const existingVote = await db.query.votes.findFirst({
      where: and(eq(votes.patchId, patchId), eq(votes.userId, user.id)),
    });

    if (existingVote) {
      console.info('Deleting');
      await db
        .delete(votes)
        .where(and(eq(votes.patchId, patchId), eq(votes.userId, user.id)));
    } else {
      console.info('Inserting');

      await db.insert(votes).values({
        userId: user.id,
        patchId,
        storyId,
      });
    }
    revalidatePath('/stories/**');
    return { success: true, message: 'Vote registered' };
  } catch (error: any) {
    console.error(error);
    return {
      success: false,
      message: error?.message ?? 'Something went wrong',
    };
  }
}
