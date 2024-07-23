import Link from 'next/link';
import {
  RegisterLink,
  LoginLink,
  LogoutLink,
} from '@kinde-oss/kinde-auth-nextjs/components';

import { Button } from '@/components/ui/button';
import { MountainIcon } from 'lucide-react';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';

export async function Topbar() {
  const { isAuthenticated } = getKindeServerSession();
  const isLoggedIn = await isAuthenticated();
  return (
    <header className='flex h-16 w-full items-center justify-between bg-background px-4 md:px-6 border-b'>
      <Link href='#' className='flex items-center' prefetch={false}>
        <MountainIcon className='h-6 w-6' />
        <span className='ml-2 text-lg font-semibold'>Storypatch</span>
      </Link>
      <nav className=' space-x-4 flex'>
        {isLoggedIn ? (
          <Button>
            <LogoutLink>Logout</LogoutLink>
          </Button>
        ) : (
          <>
            <Button>
              <LoginLink>Sign in</LoginLink>
            </Button>
            <Button>
              <RegisterLink>Sign up</RegisterLink>
            </Button>
          </>
        )}
      </nav>
    </header>
  );
}
