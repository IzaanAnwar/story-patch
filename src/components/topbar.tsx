import Link from 'next/link';
import {
  RegisterLink,
  LoginLink,
  LogoutLink,
} from '@kinde-oss/kinde-auth-nextjs/components';

import { Button } from '@/components/ui/button';
import { getCurrUser } from '@/server/users';

export async function Topbar() {
  const user = await getCurrUser();
  return (
    <header className='flex h-16 w-full items-center justify-between bg-background px-2 md:px-16 lg:px-32 border-b'>
      <Link href='/' className='flex items-center' prefetch={false}>
        <GitbookIcon className='text-primary' />
        <span className='ml-2 text-lg font-semibold'>Storypatch</span>
      </Link>
      <nav className=' space-x-4 flex'>
        {user?.id ? (
          <>
            <Button size={'sm'} variant={'ghost'} className='hidden md:flex'>
              <Link href={'/stories'}>stories</Link>
            </Button>
            <Button size={'sm'} variant={'ghost'}>
              <Link href={'/new'}>new story</Link>
            </Button>
            <Button size={'sm'} variant={'ghost'}>
              <Link href={`/profile/${user.id}`}>profile</Link>
            </Button>
            <Button size={'sm'} variant={'destructive'}>
              <LogoutLink>logout</LogoutLink>
            </Button>
          </>
        ) : (
          <>
            <Button size={'sm'}>
              <LoginLink>Sign in</LoginLink>
            </Button>
            <Button size={'sm'} variant={'outline'}>
              <RegisterLink>Sign up</RegisterLink>
            </Button>
          </>
        )}
      </nav>
    </header>
  );
}

const GitbookIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 24 24'
    width={24}
    height={24}
    fill={'none'}
    {...props}
  >
    <path
      d='M5.68421 13.143L12.5263 16.6063L22 11.6587V14.4523C22 15.1711 21.5855 15.8333 20.9171 16.1823L14.5609 19.5019C13.2948 20.1631 11.756 20.1662 10.4869 19.51L4.77515 16.5569C3.06346 15.6719 2 13.9811 2 12.1447M2 12.1447C2 10.1029 4.28574 8.77492 6.22844 9.68804L12.5263 12.6482L22 7.70056L15.7196 4.57498C14.0678 3.75288 12.076 3.81601 10.4868 4.74084L4.22963 8.38212C2.84349 9.18877 2 10.6122 2 12.1447Z'
      stroke='currentColor'
      strokeWidth='1.5'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
);
