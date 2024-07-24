import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RegisterLink } from '@kinde-oss/kinde-auth-nextjs';
import { BookOpenIcon, PenIcon, VoteIcon } from 'lucide-react';
import Image from 'next/image';
import { RegisterBtn } from './aut-buttons';
import Link from 'next/link';

const Hero = () => {
  return (
    <div className='relative text-center py-20 min-h-[50vh] lg:min-h-[75vh] flex flex-col justify-center items-center'>
      <div className='absolute w-screen left-[-20rem] inset-0 z-[-1] bg-gradient-to-r from-blue-500 via-purple-500 to-white animate-gradient opacity-10'></div>
      <h1 className='text-5xl font-bold mb-4 text-zinc-800'>
        Welcome to StoryPatch
      </h1>
      <p className='text-2xl mb-8 text-zinc-600'>
        Contribute to stories, one patch at a time.
      </p>
      <Button className='text-xl px-6'>
        <Link href={'/stories'}>Explore Stories</Link>
      </Button>
    </div>
  );
};
const Features = () => {
  return (
    <div className='py-20'>
      <h2 className='text-3xl font-bold text-center mb-12'>How It Works</h2>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
        <Card className='text-center p-6 bg-white shadow-lg rounded-lg'>
          <CardContent>
            <QuillWrite01Icon className='text-4xl mx-auto mb-4 text-blue-500' />
            <h3 className='text-xl font-semibold mb-2'>Contribute a Patch</h3>
            <p className='text-gray-600'>
              Add a paragraph to an ongoing story and see it evolve with
              contributions from others.
            </p>
          </CardContent>
        </Card>
        <Card className='text-center p-6 bg-white shadow-lg rounded-lg'>
          <CardContent>
            <VoteIcon className='text-4xl mx-auto mb-4 text-green-500' />
            <h3 className='text-xl font-semibold mb-2'>Vote on Patches</h3>
            <p className='text-gray-600'>
              Review and vote for the best patches. The most popular ones get
              merged into the main story.
            </p>
          </CardContent>
        </Card>
        <Card className='text-center p-6 bg-white shadow-lg rounded-lg'>
          <CardContent>
            <BookOpenIcon className='text-4xl mx-auto mb-4 text-purple-500' />
            <h3 className='text-xl font-semibold mb-2'>Start a New Story</h3>
            <p className='text-gray-600'>
              Begin a new story, set the stage, and invite others to contribute
              their creative patches.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const CallToAction = () => {
  return (
    <div className='text-center py-20 '>
      <h2 className='text-3xl font-bold mb-4'>Ready to Join the Story?</h2>
      <Button className='text-xl'>
        <RegisterBtn>Sign Up Now</RegisterBtn>
      </Button>
    </div>
  );
};

export default function Home() {
  return (
    <div className='px-2 md:px-16 lg:px-32'>
      <Hero />
      <Features />
      <CallToAction />
    </div>
  );
}

const QuillWrite01Icon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 24 24'
    width={24}
    height={24}
    color={'#ffffff'}
    fill={'none'}
    {...props}
  >
    <path
      d='M5.07579 17C4.08939 4.54502 12.9123 1.0121 19.9734 2.22417C20.2585 6.35185 18.2389 7.89748 14.3926 8.61125C15.1353 9.38731 16.4477 10.3639 16.3061 11.5847C16.2054 12.4534 15.6154 12.8797 14.4355 13.7322C11.8497 15.6004 8.85421 16.7785 5.07579 17Z'
      stroke='currentColor'
      strokeWidth='1.5'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
    <path
      d='M4 22C4 15.5 7.84848 12.1818 10.5 10'
      stroke='currentColor'
      strokeWidth='1.5'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
);
