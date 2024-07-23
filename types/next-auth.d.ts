import type { Session, User } from 'next-auth';
import { DefaultSession } from 'next-auth';
import { AdapterUser, Adapter } from '@auth/core/adapters';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
    } & DefaultSession['user'];
  }
}
