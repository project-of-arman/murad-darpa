
"use client";

import 'react-quill/dist/quill.snow.css';
import { useEffect, useRef } from 'react';
import type Quill from 'quill';

interface RichTextEditorProps {
    value?: string | null;
    onChange: (value: string) => void;
}

const modules = {
  toolbar: [
    [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
    [{size: []}],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{'list': 'ordered'}, {'list': 'bullet'}, 
     {'indent': '-1'}, {'indent': '+1'}],
    ['link', 'image', 'video'],
    ['clean']
  ],
  clipboard: {
    matchVisual: false,
  }
}

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<Quill | null>(null);
  const isInitialized = useRef(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && wrapperRef.current && !isInitialized.current) {
        import('quill').then((Quill) => {
            if (!quillRef.current) { // Ensure it's only created once
                 quillRef.current = new Quill.default(wrapperRef.current!, {
                    theme: 'snow',
                    modules: modules,
                });

                quillRef.current.on('text-change', () => {
                    if (quillRef.current) {
                        onChange(quillRef.current.root.innerHTML);
                    }
                });

                if (value) {
                    quillRef.current.clipboard.dangerouslyPasteHTML(value);
                }
            }
        });
        isInitialized.current = true;
    }
  }, [onChange, value]);

  // Handle updates to the value from outside
  useEffect(() => {
    if (quillRef.current && value !== quillRef.current.root.innerHTML) {
        // Only update if the content is different to prevent cursor jumps
        const selection = quillRef.current.getSelection();
        quillRef.current.clipboard.dangerouslyPasteHTML(value || '');
        if (selection && quillRef.current.hasFocus()) {
            quillRef.current.setSelection(selection);
        }
    }
  }, [value]);

  return (
    <div ref={wrapperRef} className="bg-white"></div>
  );
}
