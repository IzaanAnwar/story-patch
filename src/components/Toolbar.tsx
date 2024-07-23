'use client';

import React from 'react';
import { type Editor } from '@tiptap/react';
import {
  Bold,
  Strikethrough,
  Italic,
  List,
  ListOrdered,
  Heading2,
  Quote,
  Code,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type Props = {
  editor: Editor | null;
  content: string;
};

const Toolbar = ({ editor, content }: Props) => {
  if (!editor) {
    return null;
  }
  return (
    <div
      className='px-4 py-3  rounded-tl-md rounded-tr-md flex justify-between items-start
    gap-5 w-full flex-wrap border border-gray-700'
    >
      <div className='flex justify-start items-center gap-5 w-full lg:w-10/12 flex-wrap '>
        <button
          onClick={e => {
            e.preventDefault();
            editor.chain().focus().toggleBold().run();
          }}
          className={cn(
            'p-1',

            editor.isActive('bold')
              ? 'bg-primary text-white  rounded-lg'
              : 'bg-secondary'
          )}
        >
          <Bold className='w-4 h-4' />
        </button>
        <button
          onClick={e => {
            e.preventDefault();
            editor.chain().focus().toggleItalic().run();
          }}
          className={cn(
            'p-1',

            editor.isActive('italic')
              ? 'bg-primary text-white  rounded-lg'
              : 'bg-secondary'
          )}
        >
          <Italic className='w-4 h-4' />
        </button>
        <button
          onClick={e => {
            e.preventDefault();
            editor.chain().focus().toggleStrike().run();
          }}
          className={cn(
            'p-1',

            editor.isActive('strike')
              ? 'bg-primary text-white  rounded-lg'
              : 'bg-secondary'
          )}
        >
          <Strikethrough className='w-4 h-4' />
        </button>
        <button
          onClick={e => {
            e.preventDefault();
            editor.chain().focus().toggleHeading({ level: 2 }).run();
          }}
          className={cn(
            'p-1',

            editor.isActive('heading', { level: 2 })
              ? 'bg-primary text-white  rounded-lg'
              : 'bg-secondary'
          )}
        >
          <Heading2 className='w-4 h-4' />
        </button>

        <button
          onClick={e => {
            e.preventDefault();
            editor.chain().focus().toggleBulletList().run();
          }}
          className={cn(
            'p-1',

            editor.isActive('bulletList')
              ? 'bg-primary text-white  rounded-lg'
              : 'bg-secondary'
          )}
        >
          <List className='w-4 h-4' />
        </button>
        <button
          onClick={e => {
            e.preventDefault();
            editor.chain().focus().toggleOrderedList().run();
          }}
          className={cn(
            'p-1',

            editor.isActive('orderedList')
              ? 'bg-primary text-white  rounded-lg'
              : 'bg-secondary'
          )}
        >
          <ListOrdered className='w-4 h-4' />
        </button>
        <button
          onClick={e => {
            e.preventDefault();
            editor.chain().focus().toggleBlockquote().run();
          }}
          className={cn(
            'p-1',

            editor.isActive('blockquote')
              ? 'bg-primary text-white  rounded-lg'
              : 'bg-secondary'
          )}
        >
          <Quote className='w-4 h-4' />
        </button>
        <button
          onClick={e => {
            e.preventDefault();
            editor.chain().focus().setCode().run();
          }}
          className={cn(
            'p-1',

            editor.isActive('code')
              ? 'bg-primary text-white  rounded-lg'
              : 'bg-secondary'
          )}
        >
          <Code className='w-4 h-4' />
        </button>
      </div>
    </div>
  );
};

export default Toolbar;
