'use client';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { createStoryPatch } from '@/server/stories';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';

export function SubmitPatch({ storyId }: { storyId: string }) {
  const [content, setContent] = useState<string>('');
  const createPatchMutation = useMutation({
    mutationKey: ['create-patch'],
    mutationFn: async ({
      content,
      storyId,
    }: {
      storyId: string;
      content: string;
    }) => {
      const { message, success } = await createStoryPatch({ content, storyId });
      if (!success) {
        throw new Error(message);
      }
      return { message };
    },
    onError: err => {
      toast.error(err.message);
    },
    onSuccess: d => {
      toast.success(d.message);
    },
  });
  return (
    <section className='py-4'>
      <div className='space-y-3 '>
        <h5 className=' text-lg'>Submit a patch</h5>
        <div className='space-y-2'>
          <Textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            className='w-full h-full'
          />
          <Button
            onClick={async () => {
              if (!content) {
                toast.error('Please write something before submiting');
                return;
              }
              createPatchMutation.mutate({ storyId, content });
            }}
            loading={createPatchMutation.isPending}
            disabled={createPatchMutation.isPending}
          >
            Submit
          </Button>
        </div>
      </div>
    </section>
  );
}
