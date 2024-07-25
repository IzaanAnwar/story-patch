'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { createStory } from '@/server/stories';
import { useFormState, useFormStatus } from 'react-dom';
import { Tiptap } from '@/components/text-editor';
import { Suspense, useState } from 'react';
import { EditorState } from 'draft-js';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export default function NewStory() {
  const createStoryMutattion = useMutation({
    mutationKey: ['create-story'],
    mutationFn: async ({
      title,
      content,
      overview,
    }: {
      title: string;
      content: string;
      overview: string;
    }) => {
      const { message, success } = await createStory({
        title,
        content,
        overview,
      });
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
  const [content, setContent] = useState<string>('');
  const handleContentChange = (reason: any) => {
    setContent(reason);
  };

  return (
    <div className='flex  flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8 min-h-svh'>
      <form
        className='mx-auto w-full max-w-3xl space-y-6'
        action={formData => {
          if (!content) {
            toast.error('Overview can not be empty');
            return;
          }
          createStoryMutattion.mutate({
            title: formData.get('title') as string,
            content: formData.get('content') as string,
            overview: content,
          });
        }}
      >
        <div className='grid gap-2'>
          <Label htmlFor='title' className='text-sm font-medium'>
            Title
          </Label>
          <Input
            id='title'
            type='text'
            name='title'
            placeholder='Enter your story title'
            className='text-2xl font-bold'
            required
          />
        </div>
        <div className='space-y-2'>
          <Label htmlFor='content' className='text-sm font-medium'>
            Content
          </Label>
          <Textarea
            placeholder='Start writing your story here...'
            rows={12}
            name='content'
            className='w-full  p-4 text-lg '
            required
          />
        </div>
        <div className='grid gap-2'>
          <Label htmlFor='content' className='text-sm font-medium'>
            Story overview (note: write what you want this story to be or what
            this story is about)
          </Label>
          <Tiptap
            content={content}
            onChange={(newContent: string) => handleContentChange(newContent)}
          />
        </div>
        <Button
          className='w-full'
          loading={createStoryMutattion.isPending}
          disabled={createStoryMutattion.isPending}
          type='submit'
        >
          Save Story
        </Button>
      </form>
    </div>
  );
}
