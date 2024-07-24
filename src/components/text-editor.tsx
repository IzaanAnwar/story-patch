'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Toolbar from './Toolbar';
import Underline from '@tiptap/extension-document';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Skeleton } from './ui/skeleton';

export const Tiptap = ({ onChange, content }: any) => {
  const [loading, setLoading] = useState(true);
  const handleChange = (newContent: string) => {
    onChange(newContent);
  };
  const editor = useEditor({
    extensions: [StarterKit, Underline],

    editorProps: {
      attributes: {
        class:
          'flex flex-col px-4 py-3 justify-start border-b border-r  border-l border-gray-700  items-start w-full gap-3  pt-4 rounded-bl-md rounded-br-md outline-none',
      },
    },
    onUpdate: ({ editor }) => {
      handleChange(editor.getHTML());
    },
  });
  useEffect(() => {
    if (editor) {
      setLoading(false);
    }
  }, [editor]);

  if (loading) {
    return (
      <div className='flex justify-center items-center w-full h-full'>
        <Skeleton className='w-full h-[25vh]' />
      </div>
    );
  }

  return (
    <div className='w-full rounded-md border border-input bg-background  text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'>
      <Toolbar editor={editor} content={content} />
      <EditorContent
        style={{
          whiteSpace: 'pre-line',
          caretColor: 'blueviolet',
        }}
        editor={editor}
      />
    </div>
  );
};
