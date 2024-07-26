'use server';

import { db } from '@/db';
import { patches, stories, users } from '@/db/schema';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

export async function getCurrUser() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  return user;
}

export async function createUser() {
  try {
    const user = await getCurrUser();
    if (!user) throw new Error('user is not logged in');
    const userExsists = await db.query.users.findFirst({
      where: eq(users.id, user.id),
    });
    if (userExsists) {
      return { error: null, message: 'success', exists: true };
    }

    await db.insert(users).values({
      id: user.id,
      email: user.email ?? 'NA',
      image: user.picture,
      name: user.username ?? user.family_name ?? user.given_name ?? 'NA',
    });
    return { error: null, message: 'success', exists: false };
  } catch (error: any) {
    return { error: error?.message, message: null, exists: null };
  }
}

export async function getProfileDetails(id: string) {
  try {
    const userId = z.string().safeParse(id);
    if (userId.error) {
      throw new Error('Invalid user id');
    }
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId.data),
    });

    if (!user) {
      throw new Error('Could not find this user');
    }
    const storyContributions = await db.query.stories.findMany({
      where: eq(stories.authorId, user.id),
    });

    const patcheContributions = await db.query.patches.findMany({
      where: eq(patches.authorId, user.id),
    });

    return {
      error: null,
      data: {
        user: user,
        stories: storyContributions,
        patches: patcheContributions,
      },
    };
  } catch (err: any) {
    return { error: err?.message, data: null };
  }
}
