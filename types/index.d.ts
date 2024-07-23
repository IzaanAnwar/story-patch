import { pendingPatches, stories } from '@/db/schema';
import { InferSelectModel } from 'drizzle-orm';

export type NewUser = {
  name: string | null;
  email: string | null;
  password: string | null;
};

export type Story = InferSelectModel<typeof stories>;
export type PendingPatch = InferSelectModel<typeof pendingPatches>;
