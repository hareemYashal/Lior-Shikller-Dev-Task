"use client";
import React, { useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Strike from "@tiptap/extension-strike";
import { TiptapNode } from "@/types";

interface TiptapEditorProps {
  content: TiptapNode;
}

export const TiptapEditor: React.FC<TiptapEditorProps> = ({ content }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: true,
        HTMLAttributes: {
          class: "tiptap-link",
          target: "_blank",
          rel: "noopener noreferrer",
        },
      }),
      Table.configure({ resizable: true }),
      TableRow,
      TableCell,
      TableHeader,
      TaskList,
      TaskItem.configure({
        nested: true,
        HTMLAttributes: {
          class: "task-item",
        },
      }),
      Strike,
    ],
    content,
    editable: false,
  });

  useEffect(() => {
    if (editor && content) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  return (
    <div className="tiptap">
      <EditorContent
        editor={editor}
        className="prose prose-invert max-w-none"
      />
      <style jsx global>{`
        /* Base editor styles for dark theme */
        .ProseMirror {
          outline: none;
          color: #e2e8f0;
        }

        /* Headings */
        .ProseMirror h1,
        .ProseMirror h2,
        .ProseMirror h3,
        .ProseMirror h4 {
          color: #f8fafc;
          margin-top: 1.5em;
          margin-bottom: 0.75em;
          font-weight: 600;
        }

        .ProseMirror h1 {
          font-size: 2em;
        }

        .ProseMirror h2 {
          font-size: 1.5em;
        }

        .ProseMirror h3 {
          font-size: 1.25em;
        }

        /* Lists */
        .ProseMirror ul,
        .ProseMirror ol {
          padding-left: 1.5em;
          margin-top: 1em;
          margin-bottom: 1em;
        }

        .ProseMirror ul {
          list-style-type: disc;
        }

        .ProseMirror ul ul {
          list-style-type: circle;
        }

        .ProseMirror ul ul ul {
          list-style-type: square;
        }

        .ProseMirror ol {
          list-style-type: decimal;
        }

        .ProseMirror ol ol {
          list-style-type: lower-alpha;
        }

        .ProseMirror ol ol ol {
          list-style-type: lower-roman;
        }

        .ProseMirror li {
          margin-bottom: 0.5em;
        }

        .ProseMirror li p {
          margin: 0;
        }

        /* Code blocks */
        .ProseMirror pre {
          background: #1e293b;
          border-radius: 0.375rem;
          color: #e2e8f0;
          padding: 0.75rem 1rem;
        }

        .ProseMirror code {
          background: #334155;
          color: #f8fafc;
          border-radius: 0.25rem;
          padding: 0.125rem 0.25rem;
        }

        /* Blockquotes */
        .ProseMirror blockquote {
          border-left-color: #475569;
          color: #cbd5e1;
        }

        /* Task list styling */
        .ProseMirror ul[data-type="taskList"] {
          list-style: none;
          padding-left: 0.25rem;
        }

        .ProseMirror ul[data-type="taskList"] li {
          display: flex;
          align-items: center;
          margin-bottom: 0.75rem;
          position: relative;
        }

        /* Checkbox styling */
        .ProseMirror
          ul[data-type="taskList"]
          li
          > label
          input[type="checkbox"] {
          cursor: pointer;
          margin-right: 0.75rem;
          height: 1.25rem;
          width: 1.25rem;
          border: 2px solid #475569;
          border-radius: 0.25rem;
          position: relative;
          top: 0;
          background-color: #1e293b;
        }

        /* Checked state styling */
        .ProseMirror
          ul[data-type="taskList"]
          li[data-checked="true"]
          > label
          > input[type="checkbox"] {
          background-color: #3b82f6;
          border-color: #3b82f6;
          appearance: none;
          -webkit-appearance: none;
        }

        /* Checkmark */
        .ProseMirror
          ul[data-type="taskList"]
          li[data-checked="true"]
          > label
          > input[type="checkbox"]:after {
          content: "✓";
          color: #f8fafc;
          position: absolute;
          left: 50%;
          top: 45%;
          transform: translate(-50%, -50%);
          font-size: 0.875rem;
        }

        /* Task list item content */
        .ProseMirror ul[data-type="taskList"] li > label {
          display: flex;
          align-items: center;
          margin-bottom: 0;
          flex-shrink: 0;
        }

        .ProseMirror ul[data-type="taskList"] li > div {
          flex-grow: 1;
          margin-left: 0.25rem;
        }

        /* Links */
        .ProseMirror a.tiptap-link {
          color: #60a5fa;
          text-decoration: underline;
          cursor: pointer;
          transition: color 0.2s ease;
        }

        .ProseMirror a.tiptap-link:hover {
          color: #93c5fd;
          text-decoration: underline;
        }

        /* Tables */
        .ProseMirror table {
          border-collapse: collapse;
          margin: 1rem 0;
          overflow: hidden;
          width: 100%;
        }

        .ProseMirror th {
          background-color: #334155;
          color: #f8fafc;
          font-weight: bold;
          padding: 0.5rem;
          border: 1px solid #475569;
        }

        .ProseMirror td {
          border: 1px solid #475569;
          padding: 0.5rem;
        }
      `}</style>
    </div>
  );
};
