import { db } from '@/db';
import { NextRequest } from 'next/server';
import { eq, sql } from 'drizzle-orm';
import { patches, pendingPatches, votes } from '@/db/schema';
import { PendingPatch } from '../../../../types';

type StoryPatchMap = {
  story_id: string;
  patches: [
    {
      id: string;
      author: string;
      authorId: string;
      storyId: string;
      content: string;
      createdAt: Date;
    }
  ];
};
export const POST = async (req: NextRequest) => {
  try {
    const storyPatchMap =
      (await db.execute(sql` SELECT story_id, json_agg(json_build_object(
        'id', id, 
        'content', content, 
        'author', author, 
        'authorId', author_id, 
        'createdAt', created_at, 
      )) AS patches
      FROM pending_patches
      GROUP BY story_id;`)) as StoryPatchMap[] | [] | undefined;
    storyPatchMap?.forEach(async storyPatch => {
      let maxVote = { count: 0, patchId: '' };
      storyPatch.patches.forEach(async patch => {
        const [totalVotes] = await db
          .select({
            count: sql<number>`cast(count(${votes.patchId}) as integer)`,
            patchId: votes.patchId,
          })
          .from(votes)
          .where(eq(votes.patchId, patch.id));
        if (maxVote.count < totalVotes.count) {
          maxVote = totalVotes;
        }
      });
      if (maxVote.patchId) {
        const maxVotedPatch = storyPatch.patches.find(
          item => item.id === maxVote.patchId
        );
        if (maxVotedPatch) {
          await db.transaction(async tx => {
            await tx.insert(patches).values({
              author: maxVotedPatch.author,
              authorId: maxVotedPatch.authorId,
              createdAt: maxVotedPatch.createdAt,
              content: maxVotedPatch.content,
              storyId: maxVotedPatch.storyId,
            });
            await tx
              .delete(pendingPatches)
              .where(eq(pendingPatches.storyId, maxVotedPatch.storyId));
          });
        }
      }
    });
    return new Response('Patches merged successfully', { status: 200 });
  } catch (error) {
    console.error('Error merging patches:', error);
    return new Response('Error merging patches', { status: 500 });
  }
};
