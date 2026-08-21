"use client";

import { Extension, type Editor, type Range } from "@tiptap/core";
import { ReactRenderer } from "@tiptap/react";
import Suggestion, { type SuggestionOptions } from "@tiptap/suggestion";
import {
  CheckSquare,
  Code2,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Type,
} from "lucide-react";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

export type SlashItem = {
  title: string;
  description: string;
  icon: ReactNode;
  keywords: string;
  command: (props: { editor: Editor; range: Range }) => void;
};

export type SlashListHandle = {
  onKeyDown: (props: { event: KeyboardEvent }) => boolean;
};

type SlashListProps = {
  items: SlashItem[];
  command: (item: SlashItem) => void;
};

function applyBlock(
  editor: Editor,
  range: Range,
  run: (chain: ReturnType<Editor["chain"]>) => void,
) {
  const chain = editor.chain().focus().deleteRange(range);
  run(chain);
}

export const slashItems: SlashItem[] = [
  {
    title: "Texto",
    description: "Párrafo simple",
    keywords: "parrafo texto",
    icon: <Type className="h-4 w-4" />,
    command: ({ editor, range }) =>
      applyBlock(editor, range, (chain) => chain.setParagraph().run()),
  },
  {
    title: "Título 1",
    description: "Encabezado grande",
    keywords: "h1 titulo heading",
    icon: <Heading1 className="h-4 w-4" />,
    command: ({ editor, range }) =>
      applyBlock(editor, range, (chain) =>
        chain.setHeading({ level: 1 }).run(),
      ),
  },
  {
    title: "Título 2",
    description: "Encabezado mediano",
    keywords: "h2 titulo heading",
    icon: <Heading2 className="h-4 w-4" />,
    command: ({ editor, range }) =>
      applyBlock(editor, range, (chain) =>
        chain.setHeading({ level: 2 }).run(),
      ),
  },
  {
    title: "Título 3",
    description: "Encabezado chico",
    keywords: "h3 titulo heading",
    icon: <Heading3 className="h-4 w-4" />,
    command: ({ editor, range }) =>
      applyBlock(editor, range, (chain) =>
        chain.setHeading({ level: 3 }).run(),
      ),
  },
  {
    title: "Lista",
    description: "Viñetas",
    keywords: "ul lista vineta",
    icon: <List className="h-4 w-4" />,
    command: ({ editor, range }) =>
      applyBlock(editor, range, (chain) => chain.toggleBulletList().run()),
  },
  {
    title: "Lista numerada",
    description: "Pasos ordenados",
    keywords: "ol lista numerada",
    icon: <ListOrdered className="h-4 w-4" />,
    command: ({ editor, range }) =>
      applyBlock(editor, range, (chain) => chain.toggleOrderedList().run()),
  },
  {
    title: "Lista de tareas",
    description: "Checkboxes para to-do",
    keywords: "todo task checkbox tareas",
    icon: <CheckSquare className="h-4 w-4" />,
    command: ({ editor, range }) =>
      applyBlock(editor, range, (chain) => chain.toggleTaskList().run()),
  },
  {
    title: "Código",
    description: "Bloque con resaltado",
    keywords: "code pre programacion",
    icon: <Code2 className="h-4 w-4" />,
    command: ({ editor, range }) =>
      applyBlock(editor, range, (chain) => chain.toggleCodeBlock().run()),
  },
  {
    title: "Cita",
    description: "Bloque citado",
    keywords: "quote cita blockquote",
    icon: <Quote className="h-4 w-4" />,
    command: ({ editor, range }) =>
      applyBlock(editor, range, (chain) => chain.toggleBlockquote().run()),
  },
];

export const SlashList = forwardRef<SlashListHandle, SlashListProps>(
  function SlashList({ items, command }, ref) {
    const [selected, setSelected] = useState(0);

    useEffect(() => {
      setSelected(0);
    }, [items]);

    useImperativeHandle(ref, () => ({
      onKeyDown({ event }) {
        if (items.length === 0) return false;
        if (event.key === "ArrowUp") {
          setSelected((index) => (index + items.length - 1) % items.length);
          return true;
        }
        if (event.key === "ArrowDown") {
          setSelected((index) => (index + 1) % items.length);
          return true;
        }
        if (event.key === "Enter") {
          const item = items[selected];
          if (item) command(item);
          return true;
        }
        return false;
      },
    }));

    if (items.length === 0) {
      return (
        <div className="w-64 rounded-xl border border-border bg-surface-card px-3 py-2 text-sm text-muted shadow-[var(--shadow-md)]">
          Sin coincidencias
        </div>
      );
    }

    return (
      <div className="w-64 overflow-hidden rounded-xl border border-border bg-surface-card py-1 shadow-[var(--shadow-md)]">
        {items.map((item, index) => (
          <button
            key={item.title}
            type="button"
            onClick={() => command(item)}
            className={cn(
              "flex w-full items-center gap-2 px-2.5 py-1.5 text-left text-sm transition",
              index === selected
                ? "bg-accent-ghost text-primary"
                : "text-secondary hover:bg-surface-hover hover:text-primary",
            )}
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-surface text-primary">
              {item.icon}
            </span>
            <span className="min-w-0">
              <span className="block truncate font-medium text-primary">
                {item.title}
              </span>
              <span className="block truncate text-[11px] text-muted">
                {item.description}
              </span>
            </span>
          </button>
        ))}
      </div>
    );
  },
);

function filterSlashItems(query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return slashItems;
  return slashItems.filter(
    (item) =>
      item.title.toLowerCase().includes(q) ||
      item.keywords.toLowerCase().includes(q),
  );
}

type SlashOptions = {
  suggestion: Omit<SuggestionOptions<SlashItem, SlashItem>, "editor">;
};

export const SlashCommand = Extension.create<SlashOptions>({
  name: "slashCommand",

  addOptions() {
    return {
      suggestion: {
        char: "/",
        allowSpaces: false,
        startOfLine: false,
        items: ({ query }) => filterSlashItems(query),
        command: ({ editor, range, props }) => {
          props.command({ editor, range });
        },
        allow: ({ editor }) => !editor.isActive("codeBlock"),
        render: () => {
          let component: ReactRenderer<SlashListHandle, SlashListProps> | null =
            null;
          let unmount: (() => void) | undefined;

          return {
            onStart(props) {
              component = new ReactRenderer(SlashList, {
                editor: props.editor,
                props: {
                  items: props.items,
                  command: props.command,
                },
              });
              unmount = props.mount(component.element);
            },
            onUpdate(props) {
              component?.updateProps({
                items: props.items,
                command: props.command,
              });
            },
            onKeyDown(props) {
              if (props.event.key === "Escape") {
                unmount?.();
                return true;
              }
              return component?.ref?.onKeyDown(props) ?? false;
            },
            onExit() {
              unmount?.();
              component?.destroy();
              component = null;
            },
          };
        },
      },
    };
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
      }),
    ];
  },
});
