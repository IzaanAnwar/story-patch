'use client';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  ClockIcon,
  HeartIcon,
  Loader2,
  UserIcon,
  UsersIcon,
} from 'lucide-react';
import { Story } from '../../../types';
import moment from 'moment';
import Link from 'next/link';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { useKindeAuth } from '@kinde-oss/kinde-auth-nextjs';
import { KindeUser } from '@kinde-oss/kinde-auth-nextjs/types';
import { likeStrory } from '@/server/stories';

export default function StoriesPage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const userQuery = useQuery({
    queryKey: ['getUser'],
    queryFn: async () => {
      const res = await fetch('/api/getUser');
      if (res.ok) {
        const data = (await res.json()) as { user: KindeUser | null };
        return data.user;
      }
    },
  });

  useEffect(() => {
    setLoading(true);
    const fetchStories = async () => {
      const res = await fetch('/api/stories');
      if (res.ok) {
        const data = (await res.json()) as { stories: Story[] | undefined };
        console.log({ data });

        setStories(data.stories ? data.stories : []);
      }
    };
    try {
      fetchStories().then(() => {
        setLoading(false);
      });
    } catch (error: any) {
      setError(error?.message);
      setLoading(false);
    }
  }, []);
  if (error) {
    toast.error(error);
    setError('');
  }

  return (
    <div className='px-2 py-12 md:px-16 lg:px-32 lg:py-16 min-h-svh'>
      <div className='grid gap-8'>
        <div className='grid gap-4'>
          <h1 className='text-3xl font-bold tracking-tight sm:text-4xl'>
            Community Stories
          </h1>
          <p className='text-muted-foreground'>
            Check out the latest stories shared by our community.
          </p>
        </div>

        {loading ? (
          <div className='grid gap-6'>
            <Skeleton className='w-full h-64' />
            <Skeleton className='w-full h-64' />
            <Skeleton className='w-full h-64' />
            <Skeleton className='w-full h-64' />
          </div>
        ) : (
          <div className='grid gap-6'>
            {stories?.map(story => {
              return (
                <StoryCard
                  key={story.id}
                  story={story}
                  setStories={setStories}
                  user={userQuery.data}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function StoryCard({
  story,
  setStories,
  user,
}: {
  story: Story;
  user: KindeUser | null | undefined;
  setStories: Dispatch<SetStateAction<Story[]>>;
}) {
  const [hasLiked, setHasLiked] = useState(true);
  const [loading, setLoading] = useState(true);

  console.log({ user });

  const likeMutation = useMutation({
    mutationKey: ['like', story.id],
    mutationFn: async (storyId: string) => {
      const { message, success } = await likeStrory({ storyId });
      if (!success) {
        throw new Error(message);
      }
      return message;
    },
    onError: e => toast.error(e.message),
  });
  console.log({ story });
  useEffect(() => {
    setLoading(true);
    try {
      const isLiked = story.allikes?.find(item => item.userId === user?.id);

      setHasLiked(prev => !!isLiked);
      console.log({ isLiked });
    } catch (error) {
      console.error({ error });
    } finally {
      setLoading(false);
    }
  }, [story, user]);
  if (loading) {
    return <Skeleton className='w-full h-64' />;
  }
  console.log({ hasLiked });
  function handleLike() {
    if (!user) {
      toast.error('You need to login to like a story');
      return;
    }
    console.log('UPdate');

    setStories(prevStories => {
      return prevStories.map(item => {
        if (item.id === story.id) {
          const hasUserLiked = item.allikes?.some(
            like => like.userId === user.id
          );

          const updatedLikesArray = hasUserLiked
            ? item.allikes?.filter(like => like.userId !== user.id) // Remove like object
            : [
                ...item.allikes!,
                {
                  userId: user.id,
                  createdAt: new Date(),
                  storyId: story.id,
                }, // Add new like object
              ];

          const updatedLikeCount = hasUserLiked
            ? item.likes > 0
              ? item.likes - 1
              : 0
            : item.likes + 1;

          return {
            ...item,
            allikes: updatedLikesArray,
            likes: updatedLikeCount,
          };
        } else {
          return item;
        }
      });
    });

    setHasLiked(prevHasLiked => !prevHasLiked);

    console.log('UPdateed', { hasLiked });

    likeMutation.mutate(story.id);
  }

  return (
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
        <Link className='block max-w-full ' href={`stories/${story.name}`}>
          <h3 className='text-xl font-semibold group-hover:text-primary duration-200'>
            {story.name}
          </h3>
          <p className='text-muted-foreground line-clamp-3 w-[80vw] md:w-[70vw]'>
            {story.content}
          </p>
        </Link>
        <div className='flex items-center gap-4'>
          <div className='flex items-center gap-1 text-sm text-purple-950'>
            <UsersIcon className='w-4 h-4 text-purple-500' />
            <span>{story.patches?.length ?? 0} contributors</span>
          </div>
          <div className='flex items-center gap-1 text-sm text-muted-foreground'>
            <span onClick={handleLike} className='w-fit h-fit'>
              <HeartIcon
                fill={hasLiked ? '#ee3237' : 'none'}
                className='w-4 h-4 text-red-500'
              />
            </span>
            <span>{story.likes} likes</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
