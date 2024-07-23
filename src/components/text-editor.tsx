'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Toolbar from './Toolbar';
import Underline from '@tiptap/extension-document';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

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
        <Loader2 className='animate-spin' />
      </div>
    );
  }

  return (
    <div className='w-full px-4 '>
      <Toolbar editor={editor} content={content} />
      <EditorContent style={{ whiteSpace: 'pre-line' }} editor={editor} />
    </div>
  );
};
