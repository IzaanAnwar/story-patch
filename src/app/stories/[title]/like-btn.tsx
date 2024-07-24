'use client';
import { Button } from '@/components/ui/button';
import { likeStrory } from '@/server/stories';
import { useMutation } from '@tanstack/react-query';
import { HeartIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Like } from '../../../../types';
import { useEffect, useState } from 'react';
import { KindeUser } from '@kinde-oss/kinde-auth-nextjs/types';

export function LikeButton(props: {
  stroyId: string;
  allLikes: Like[] | undefined;
  user: KindeUser | null;
  likes: number;
}) {
  const [hasLiked, setHasLiked] = useState(false);
  const [likes, setLikes] = useState(props.likes);
  const [allLikes, setAllLikes] = useState(props.allLikes);
  const likeMutation = useMutation({
    mutationKey: ['like-story', props.stroyId],
    mutationFn: async (storyId: string) => {
      const { message, success } = await likeStrory({ storyId });
      if (!success) {
        throw new Error(message);
      }
      return message;
    },
    onError: e => toast.error(e.message),
  });

  useEffect(() => {
    if (props.user) {
      const liked = !!allLikes?.find(item => item.userId === props.user?.id);
      setHasLiked(liked);
    }
  }, [allLikes, props.user]);
  const handleLike = () => {
    if (!props.user) {
      toast.error('You need to login to like this story');
      return;
    }

    likeMutation.mutate(props.stroyId);
    const liked = allLikes?.find(item => item.userId === props.user?.id);
    console.log('Liked', { liked });

    if (liked) {
      setHasLiked(false);
      setLikes(prev => (prev > 0 ? prev - 1 : prev));
      setAllLikes(prev => {
        return prev?.filter(item => item.userId !== props.user?.id);
      });
    } else {
      setHasLiked(true);
      setLikes(prev => prev + 1);
      const updatedLikes = allLikes
        ? [
            ...allLikes,
            {
              createdAt: new Date(),
              storyId: props.stroyId,
              userId: props.user?.id,
            },
          ]
        : [];
      setAllLikes(updatedLikes);
    }
  };
  return (
    <>
      <span className='cursor-pointer w-fit h-fit' onClick={handleLike}>
        <HeartIcon
          fill={hasLiked ? '#ee3237' : 'none'}
          className='text-destructive'
        />
      </span>
      <p>
        {likes} {likes > 1 ? 'hearts' : 'heart'}
      </p>
    </>
  );
}
