'use client';

import { Button } from '@/components/ui/button';
import { Flame } from 'lucide-react';
import { useKindeAuth } from '@kinde-oss/kinde-auth-nextjs';
import { cn } from '@/lib/utils';
import { useMutation } from '@tanstack/react-query';
import { vote } from '@/server/votes';
import { toast } from 'sonner';

export default function VoteBtn(props: {
  patchId: string;
  fill: boolean;
  storyId: string;
}) {
  const { user } = useKindeAuth();

  const voteMutation = useMutation({
    mutationKey: ['vote'],
    mutationFn: async (data: { patchId: string; storyId: string }) => {
      const { message, success } = await vote(data);
      if (!success) {
        throw new Error(message);
      }
      return { message };
    },
    onSuccess: d => toast.success(d.message),
    onError: err => toast.error(err?.message),
  });

  return (
    <>
      <Button
        loading={voteMutation.isPending}
        disabled={voteMutation.isPending}
        variant='ghost'
        size='icon'
        onClick={() => voteMutation.mutate(props)}
      >
        <Flame
          className={cn(props.fill && 'text-red-500')}
          fill={props.fill ? 'red' : 'none'}
          size={20}
        />
        <span className='sr-only'>Upvote</span>
      </Button>
    </>
  );
}
