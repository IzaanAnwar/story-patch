import { relations } from 'drizzle-orm';
import { timestamp, pgTable, text, integer } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  name: text('name'),
  image: text('image'),
  email: text('email').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const stories = pgTable('stories', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text('name').unique(),
  content: text('content').notNull().unique(),
  author: text('author').notNull(),
  authorId: text('author_id').notNull(),
  overview: text('overview').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  likes: integer('likes').notNull().default(0),
});

export const likes = pgTable('likes', {
  storyId: text('story_id')
    .notNull()
    .references(() => stories.id)
    .primaryKey(),
  userId: text('user_id').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const patches = pgTable('patches', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  storyId: text('story_id')
    .notNull()
    .references(() => stories.id),
  content: text('content').notNull().unique(),
  author: text('author').notNull(),
  authorId: text('author_id').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const pendingPatches = pgTable('pending_patches', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  storyId: text('story_id')
    .notNull()
    .references(() => stories.id),
  content: text('content').notNull().unique(),
  author: text('author').notNull(),
  authorId: text('author_id').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const votes = pgTable('votes', {
  patchId: text('patch_id')
    .notNull()
    .references(() => pendingPatches.id),
  storyId: text('story_id')
    .notNull()
    .references(() => stories.id),
  userId: text('user_id').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// relations
export const storyRelation = relations(stories, ({ many }) => ({
  patches: many(patches),
  allikes: many(likes),
}));

export const patchRelation = relations(patches, ({ one }) => ({
  story: one(stories, {
    fields: [patches.storyId],
    references: [stories.id],
  }),
}));

export const pendingPatchRelation = relations(pendingPatches, ({ many }) => ({
  votes: many(votes),
}));

export const voteRelation = relations(votes, ({ one }) => ({
  patch: one(pendingPatches, {
    fields: [votes.patchId],
    references: [pendingPatches.id],
  }),
}));

export const likeRelation = relations(likes, ({ one }) => ({
  story: one(stories, {
    fields: [likes.storyId],
    references: [stories.id],
  }),
}));
