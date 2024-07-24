'use server';
import { db } from '@/db';
import { likes, patches, pendingPatches, stories } from '@/db/schema';
import { ZodError, z } from 'zod';
import { getCurrUser } from './users';
import { and, count, eq, like, sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

const storySchema = z.object({
  title: z.string().min(1),
  content: z.string().min(100).max(1000),
  overview: z.string().min(1),
});

export async function createStory(data: z.infer<typeof storySchema>) {
  try {
    const user = await getCurrUser();
    if (!user) {
      throw new Error('You are not logged in');
    }
    const storyData = storySchema.parse(data);
    console.log({ storyData });

    await db.insert(stories).values({
      title: storyData.title,
      content: storyData.content,
      author: user.username! ?? user.given_name ?? user.family_name,
      authorId: user.id,
      overview: storyData.overview,
    });
    revalidatePath('/stories');
    return { success: true, message: 'Story created successfully' };
  } catch (error: any) {
    console.log({ error });
    if (error instanceof ZodError) {
      const err = error.flatten();
      const contentErr = err.fieldErrors.content?.at(0)?.replace('String', '');
      const titleErr = err.fieldErrors.title?.at(0)?.replace('String', '');
      const overviewErr = err.fieldErrors.overview
        ?.at(0)
        ?.replace('String', '');
      if (contentErr) {
        return { success: false, message: `Content Field ${contentErr}` };
      }
      if (titleErr) {
        return { success: false, message: `Title Field ${titleErr}` };
      }
      if (overviewErr) {
        return { success: false, message: `Overview Field ${overviewErr}` };
      }
    }
    return {
      success: false,
      message: error?.message ?? 'Something went wrong',
    };
  }
}

export async function getAllStrories() {
  try {
    const allStories = await db.query.stories.findMany();
    console.log('GOt em');

    return {
      error: null,
      stories: allStories,
    };
  } catch (error: any) {
    return {
      error: error?.message ?? 'Something went wrong. Please try again',
      stories: null,
    };
  }
}

export async function getStoryContributors(id: string) {
  try {
    const storyId = z.string().uuid().parse(id);
    const contributors = await db.query.patches.findMany({
      where: eq(patches.storyId, storyId),
    });

    return {
      error: null,
      contributors,
    };
  } catch (error: any) {
    return {
      error: error?.message ?? 'Something went wrong. Please try again',
      contributors: null,
    };
  }
}

const storyPatchSchema = z.object({
  content: z.string().min(100).max(1000),
  storyId: z.string(),
});
export async function createStoryPatch(data: z.infer<typeof storyPatchSchema>) {
  try {
    const user = await getCurrUser();
    if (!user) {
      throw new Error('You are not logged in');
    }
    const patchData = storyPatchSchema.parse(data);
    const existingPatch = await db.query.pendingPatches.findFirst({
      where: and(
        eq(pendingPatches.authorId, user.id),
        eq(pendingPatches.storyId, patchData.storyId)
      ),
    });

    if (existingPatch) {
      throw new Error('You have alread submitted a patch for this story line');
    }
    await db.insert(pendingPatches).values({
      author: user.username! ?? user.given_name ?? user.family_name,
      authorId: user.id,
      content: patchData.content,
      storyId: patchData.storyId,
    });
    revalidatePath('/stories');
    revalidatePath('/stories/*');
    return { success: true, message: 'Patch Submitted successfully' };
  } catch (error: any) {
    if (error instanceof ZodError) {
      const err = error.flatten();
      console.log({ err });
      const contentErr = err.fieldErrors.content?.at(0)?.replace('String', '');
      const storyIdErr = err.fieldErrors.storyId?.at(0)?.replace('String', '');

      if (contentErr) {
        return { success: false, message: `Content Field ${contentErr}` };
      }
      if (storyIdErr) {
        return {
          success: false,
          message: `storyIdErr Field ${storyIdErr}`,
        };
      }
    }
    return {
      success: false,
      message: error?.message ?? 'Something went wrong',
    };
  }
}

export async function getStroyPatches(data: string) {
  try {
    const storyTitle = z.string().parse(data);

    const storyPatches = await db.query.stories.findFirst({
      where: eq(stories.title, storyTitle),
      with: {
        patches: true,
        allikes: true,
      },
    });
    return {
      error: null,
      storyPatches,
    };
  } catch (error: any) {
    return {
      error: error?.message ?? 'Something went wrong. Please try again',
      storyPatches: null,
    };
  }
}

export async function getPendingPatches(data: string) {
  try {
    const storyId = z.string().parse(data);

    const patches = await db.query.pendingPatches.findMany({
      where: eq(pendingPatches.storyId, storyId),
      with: {
        votes: true,
      },
    });
    console.log({ patches });

    return {
      error: null,
      patches,
    };
  } catch (error: any) {
    return {
      error: error?.message ?? 'Something went wrong. Please try again',
      patches: null,
    };
  }
}

export async function likeStrory(data: {
  storyId: string;
}): Promise<{ success: boolean; message: string }> {
  try {
    const user = await getCurrUser();
    if (!user) {
      throw new Error('You are not logged in');
    }

    const { storyId } = z.object({ storyId: z.string().uuid() }).parse(data);
    const existingLike = await db.query.likes.findFirst({
      where: and(eq(likes.storyId, storyId), eq(likes.userId, user.id)),
    });

    await db.transaction(async tx => {
      if (existingLike) {
        console.info('Deleting');
        await tx
          .delete(likes)
          .where(and(eq(likes.storyId, storyId), eq(likes.userId, user.id)));
        console.log('Deleted');
      } else {
        console.info('Inserting');

        await tx.insert(likes).values({
          userId: user.id,
          storyId,
        });
        console.log('Totak iii');
      }
      const [totalLikes] = await tx
        .select({ count: count(likes.storyId) })
        .from(likes)
        .where(eq(likes.storyId, storyId));

      console.log('Total Likes', { totalLikes });

      await tx.update(stories).set({ likes: totalLikes.count });
    });
    revalidatePath('/stories');
    return { success: true, message: 'Liked' };
  } catch (error: any) {
    console.error(error);
    return {
      success: false,
      message: error?.message ?? 'Something went wrong',
    };
  }
}
