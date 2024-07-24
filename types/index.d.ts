import { likes, patches, pendingPatches, stories } from '@/db/schema';
import { InferSelectModel } from 'drizzle-orm';

export type NewUser = {
  name: string | null;
  email: string | null;
  password: string | null;
};

export type Story = InferSelectModel<typeof stories> & {
  allikes: InferSelectModel<typeof likes>[] | undefined;
  patches: InferSelectModel<typeof patches>[] | undefined;
};

export type Like = InferSelectModel<typeof likes>;
export type PendingPatch = InferSelectModel<typeof pendingPatches>;
