import { db } from '@/db';
import { NextRequest } from 'next/server';
import { count, eq, sql } from 'drizzle-orm';
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
    const statement = sql`SELECT story_id, json_agg(json_build_object(
      'id', id, 
      'content', content, 
      'author', author, 
      'storyId', story_id,
      'authorId', author_id, 
      'createdAt', created_at
    )) AS patches
    FROM pending_patches
    GROUP BY story_id;`;

    const storyPatchMap = (await db.execute(statement)) as
      | StoryPatchMap[]
      | []
      | undefined;

    if (!storyPatchMap) {
      return new Response('No patches found', { status: 404 });
    }

    for (const storyPatch of storyPatchMap) {
      if (!storyPatch?.patches) {
        console.log('No patch');
        continue;
      }

      let maxVote = { count: 0, patchId: '' };

      // Collect all promises for the inner loop
      const votePromises = storyPatch.patches.map(async patch => {
        const [totalVotes] = await db
          .select({
            count: count(votes.patchId),
          })
          .from(votes)
          .where(eq(votes.patchId, patch.id));

        if (maxVote.count < totalVotes.count) {
          maxVote = { count: totalVotes.count, patchId: patch.id };
        }
      });

      // Wait for all vote counts to be resolved
      await Promise.all(votePromises);

      console.log({ maxVote });

      if (maxVote.patchId) {
        const maxVotedPatch = storyPatch.patches.find(
          item => item.id === maxVote.patchId
        );

        if (maxVotedPatch) {
          await db.transaction(async tx => {
            console.log('Doing inserting', { maxVotedPatch });

            await tx.insert(patches).values({
              author: maxVotedPatch.author,
              authorId: maxVotedPatch.authorId,
              createdAt: new Date(maxVotedPatch.createdAt),
              content: maxVotedPatch.content,
              storyId: maxVotedPatch.storyId,
            });
            console.log('Doing deleting');

            await tx.delete(votes).where(eq(votes.patchId, maxVotedPatch.id));
            await tx
              .delete(pendingPatches)
              .where(eq(pendingPatches.storyId, maxVotedPatch.storyId));
          });
        }
      }
    }
    console.log('Done deleting');

    return new Response('Patches merged successfully', { status: 200 });
  } catch (error) {
    console.error('Error merging patches:', error);
    return new Response('Error merging patches', { status: 500 });
  }
};
