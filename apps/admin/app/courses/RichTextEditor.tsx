"use client";

import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

export function RichTextEditor({ value, onChange }: { value: string; onChange: (val: string) => void }) {
  return (
    <div className="rounded-lg bg-white">
      <ReactQuill 
        theme="snow" 
        value={value} 
        onChange={onChange}
        modules={{
          toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['link'],
            ['clean']
          ]
        }}
      />
    </div>
  );
}
