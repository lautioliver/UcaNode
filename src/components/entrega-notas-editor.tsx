"use client";

import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Placeholder from "@tiptap/extension-placeholder";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import { EditorContent, useEditor, useEditorState } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import type { Editor, JSONContent } from "@tiptap/core";
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
import { useEffect, useRef, type ReactNode } from "react";
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

function EntregaNotasToolbar({ editor }: { editor: Editor }) {
  const active = useEditorState({
    editor,
    selector: ({ editor: instance }) => ({
      h1: instance.isActive("heading", { level: 1 }),
      h2: instance.isActive("heading", { level: 2 }),
      h3: instance.isActive("heading", { level: 3 }),
      bold: instance.isActive("bold"),
      italic: instance.isActive("italic"),
      strike: instance.isActive("strike"),
      bullet: instance.isActive("bulletList"),
      ordered: instance.isActive("orderedList"),
      task: instance.isActive("taskList"),
      quote: instance.isActive("blockquote"),
      code: instance.isActive("codeBlock"),
    }),
  });

  return (
    <div className="flex flex-wrap items-center gap-0.5 border-b border-border px-1.5 py-1">
      <ToolbarBtn
        label="Título 1"
        active={active.h1}
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
      >
        <Heading1 className="h-3.5 w-3.5" />
      </ToolbarBtn>
      <ToolbarBtn
        label="Título 2"
        active={active.h2}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        <Heading2 className="h-3.5 w-3.5" />
      </ToolbarBtn>
      <ToolbarBtn
        label="Título 3"
        active={active.h3}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      >
        <Heading3 className="h-3.5 w-3.5" />
      </ToolbarBtn>
      <ToolbarBtn
        label="Negrita"
        active={active.bold}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold className="h-3.5 w-3.5" />
      </ToolbarBtn>
      <ToolbarBtn
        label="Cursiva"
        active={active.italic}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic className="h-3.5 w-3.5" />
      </ToolbarBtn>
      <ToolbarBtn
        label="Tachado"
        active={active.strike}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <Strikethrough className="h-3.5 w-3.5" />
      </ToolbarBtn>
      <ToolbarBtn
        label="Lista"
        active={active.bullet}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List className="h-3.5 w-3.5" />
      </ToolbarBtn>
      <ToolbarBtn
        label="Lista numerada"
        active={active.ordered}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered className="h-3.5 w-3.5" />
      </ToolbarBtn>
      <ToolbarBtn
        label="Lista de tareas"
        active={active.task}
        onClick={() => editor.chain().focus().toggleTaskList().run()}
      >
        <CheckSquare className="h-3.5 w-3.5" />
      </ToolbarBtn>
      <ToolbarBtn
        label="Cita"
        active={active.quote}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <Quote className="h-3.5 w-3.5" />
      </ToolbarBtn>
      <ToolbarBtn
        label="Bloque de código"
        active={active.code}
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
      >
        <Code2 className="h-3.5 w-3.5" />
      </ToolbarBtn>
    </div>
  );
}

export function EntregaNotasEditor({
  initialContent,
  onChange,
  variant = "default",
}: {
  initialContent: TiptapDoc | null;
  onChange: (doc: TiptapDoc) => void;
  variant?: "default" | "notion";
}) {
  const isNotion = variant === "notion";
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const editor = useEditor({
    immediatelyRender: false,
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
        class: cn(
          "entrega-notas-prose focus:outline-none",
          isNotion ? "min-h-[40vh] px-0 py-1" : "min-h-64 px-1 py-2",
        ),
      },
    },
    onUpdate: ({ editor: instance }) => {
      onChangeRef.current(instance.getJSON() as TiptapDoc);
    },
  });

  if (!editor) {
    return (
      <div
        className={cn(
          "text-sm text-muted",
          isNotion
            ? "min-h-[40vh] py-2"
            : "min-h-64 rounded-xl border border-border bg-surface px-3 py-2",
        )}
      >
        Cargando editor…
      </div>
    );
  }

  return (
    <div
      className={cn(
        "entrega-notas-editor",
        isNotion
          ? "entrega-notas-editor--notion"
          : "rounded-xl border border-border bg-surface",
      )}
    >
      {!isNotion ? <EntregaNotasToolbar editor={editor} /> : null}

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

      <EditorContent
        editor={editor}
        className={isNotion ? "pb-2" : "px-3 pb-3"}
      />
    </div>
  );
}
