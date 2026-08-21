"use client";

import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Placeholder from "@tiptap/extension-placeholder";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import { EditorContent, useEditor } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import type { JSONContent } from "@tiptap/core";
import {
  Bold,
  CheckSquare,
  Code2,
  Heading1,
  Heading2,
  Heading3,
  Italic,
  List,
  ListOrdered,
  Quote,
  Strikethrough,
} from "lucide-react";
import { createLowlight } from "lowlight";
import javascript from "highlight.js/lib/languages/javascript";
import typescript from "highlight.js/lib/languages/typescript";
import python from "highlight.js/lib/languages/python";
import json from "highlight.js/lib/languages/json";
import bash from "highlight.js/lib/languages/bash";
import sql from "highlight.js/lib/languages/sql";
import xml from "highlight.js/lib/languages/xml";
import css from "highlight.js/lib/languages/css";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { SlashCommand } from "@/components/entrega-notas-slash";
import type { TiptapDoc } from "@/lib/schemas";
import { cn } from "@/lib/utils";

const lowlight = createLowlight();
lowlight.register("javascript", javascript);
lowlight.register("js", javascript);
lowlight.register("typescript", typescript);
lowlight.register("ts", typescript);
lowlight.register("python", python);
lowlight.register("json", json);
lowlight.register("bash", bash);
lowlight.register("shell", bash);
lowlight.register("sql", sql);
lowlight.register("html", xml);
lowlight.register("xml", xml);
lowlight.register("css", css);

export const EMPTY_TIPTAP_DOC: TiptapDoc = {
  type: "doc",
  content: [{ type: "paragraph" }],
};

type ToolbarBtnProps = {
  active?: boolean;
  label: string;
  onClick: () => void;
  children: ReactNode;
};

function ToolbarBtn({ active, label, onClick, children }: ToolbarBtnProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      aria-label={label}
      aria-pressed={active}
      onClick={onClick}
      className={cn(active && "bg-accent-ghost text-accent")}
    >
      {children}
    </Button>
  );
}

export function EntregaNotasEditor({
  initialContent,
  onChange,
}: {
  initialContent: TiptapDoc | null;
  onChange: (doc: TiptapDoc) => void;
}) {
  const editor = useEditor({
    immediatelyRender: false,
    shouldRerenderOnTransaction: true,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        codeBlock: false,
      }),
      Placeholder.configure({
        placeholder: "Escribí algo, o '/' para insertar un bloque…",
      }),
      TaskList,
      TaskItem.configure({ nested: true }),
      CodeBlockLowlight.configure({ lowlight }),
      SlashCommand,
    ],
    content: (initialContent ?? EMPTY_TIPTAP_DOC) as JSONContent,
    editorProps: {
      attributes: {
        class: "entrega-notas-prose min-h-64 px-1 py-2 focus:outline-none",
      },
    },
    onUpdate: ({ editor: instance }) => {
      onChange(instance.getJSON() as TiptapDoc);
    },
  });

  if (!editor) {
    return (
      <div className="min-h-64 rounded-xl border border-border bg-surface px-3 py-2 text-sm text-muted">
        Cargando editor…
      </div>
    );
  }

  return (
    <div className="entrega-notas-editor rounded-xl border border-border bg-surface">
      <div className="flex flex-wrap items-center gap-0.5 border-b border-border px-1.5 py-1">
        <ToolbarBtn
          label="Título 1"
          active={editor.isActive("heading", { level: 1 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        >
          <Heading1 className="h-3.5 w-3.5" />
        </ToolbarBtn>
        <ToolbarBtn
          label="Título 2"
          active={editor.isActive("heading", { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          <Heading2 className="h-3.5 w-3.5" />
        </ToolbarBtn>
        <ToolbarBtn
          label="Título 3"
          active={editor.isActive("heading", { level: 3 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          <Heading3 className="h-3.5 w-3.5" />
        </ToolbarBtn>
        <ToolbarBtn
          label="Negrita"
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className="h-3.5 w-3.5" />
        </ToolbarBtn>
        <ToolbarBtn
          label="Cursiva"
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className="h-3.5 w-3.5" />
        </ToolbarBtn>
        <ToolbarBtn
          label="Tachado"
          active={editor.isActive("strike")}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          <Strikethrough className="h-3.5 w-3.5" />
        </ToolbarBtn>
        <ToolbarBtn
          label="Lista"
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List className="h-3.5 w-3.5" />
        </ToolbarBtn>
        <ToolbarBtn
          label="Lista numerada"
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered className="h-3.5 w-3.5" />
        </ToolbarBtn>
        <ToolbarBtn
          label="Lista de tareas"
          active={editor.isActive("taskList")}
          onClick={() => editor.chain().focus().toggleTaskList().run()}
        >
          <CheckSquare className="h-3.5 w-3.5" />
        </ToolbarBtn>
        <ToolbarBtn
          label="Cita"
          active={editor.isActive("blockquote")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <Quote className="h-3.5 w-3.5" />
        </ToolbarBtn>
        <ToolbarBtn
          label="Bloque de código"
          active={editor.isActive("codeBlock")}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        >
          <Code2 className="h-3.5 w-3.5" />
        </ToolbarBtn>
      </div>

      <BubbleMenu
        editor={editor}
        className="flex gap-0.5 rounded-xl border border-border bg-surface-card p-1 shadow-[var(--shadow-md)]"
        shouldShow={({ editor: instance, from, to }) =>
          from !== to && !instance.isActive("codeBlock")
        }
      >
        <ToolbarBtn
          label="Negrita"
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className="h-3.5 w-3.5" />
        </ToolbarBtn>
        <ToolbarBtn
          label="Cursiva"
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className="h-3.5 w-3.5" />
        </ToolbarBtn>
        <ToolbarBtn
          label="Tachado"
          active={editor.isActive("strike")}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          <Strikethrough className="h-3.5 w-3.5" />
        </ToolbarBtn>
      </BubbleMenu>

      <EditorContent editor={editor} className="px-3 pb-3" />
    </div>
  );
}
