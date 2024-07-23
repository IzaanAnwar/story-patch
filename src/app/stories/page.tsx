import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ClockIcon, HeartIcon, UserIcon, UsersIcon } from 'lucide-react';
import { Story } from '../../../types';
import { getAllStrories, getStoryContributors } from '@/server/stories';
import moment from 'moment';
import Link from 'next/link';

export default async function StoriesPage() {
  const { error, stories } = await getAllStrories();
  return (
    <div className='container mx-auto px-4 py-12 md:px-6 lg:py-16'>
      <div className='grid gap-8'>
        <div className='grid gap-4'>
          <h1 className='text-3xl font-bold tracking-tight sm:text-4xl'>
            Community Stories
          </h1>
          <p className='text-muted-foreground'>
            Check out the latest stories shared by our community.
          </p>
        </div>
        {error && <div>{error}</div>}
        <div className='grid gap-6'>
          {stories?.map(story => {
            return <StoryCard key={story.id} story={story} />;
          })}
        </div>
      </div>
    </div>
  );
}

async function StoryCard({ story }: { story: Story }) {
  const { error, totalContributors } = await getStoryContributors(story.id);

  return (
    <Link
      className='block'
      href={`stories/${story.title?.replaceAll(' ', '_')}`}
    >
      <Card className='p-0 border-0 shadow-none group'>
        <CardContent className='grid gap-4'>
          <div className='flex items-center gap-2 text-sm text-muted-foreground'>
            <div className='flex items-center gap-1'>
              <UserIcon className='w-4 h-4' />
              <span>u/{story.author}</span>
            </div>
            <Separator orientation='vertical' className='h-4' />
            <div className='flex items-center gap-1'>
              <ClockIcon className='w-4 h-4' />
              <span>{moment(story.updatedAt).fromNow()}</span>
            </div>
          </div>
          <h3 className='text-xl font-semibold group-hover:text-primary duration-200'>
            {story.title}
          </h3>
          <p className='text-muted-foreground line-clamp-3'>{story.content}</p>
          <div className='flex items-center gap-4'>
            <div className='flex items-center gap-1 text-sm text-muted-foreground'>
              <UsersIcon className='w-4 h-4' />
              <span>{totalContributors ?? 0} contributors</span>
            </div>
            <div className='flex items-center gap-1 text-sm text-muted-foreground'>
              <HeartIcon className='w-4 h-4' />
              <span>342 likes</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
