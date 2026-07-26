"use client";

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { CommunitySidebar } from "@/app/comunidad/components/community-sidebar";
import { CreatePostModal } from "@/app/comunidad/components/create-post-modal";
import { type CommunityPost } from "@/app/comunidad/components/mock-data";
import { PostCard } from "@/app/comunidad/components/post-card";
import { EmptyState, PageHeader } from "@/components/layout";
import { Button } from "@/components/ui/button";
import type { CommunitySidebarData } from "@/lib/community/queries";
import type { MateriaPlanFuente } from "@/lib/planes-estudio/types";

type FeedFilter = "todo" | "carrera" | "materias" | "archivos";

const FILTER_TABS: { key: FeedFilter; label: string }[] = [
  { key: "todo", label: "Todo" },
  { key: "carrera", label: "Mi carrera" },
  { key: "materias", label: "Mis materias" },
  { key: "archivos", label: "Apuntes y archivos" },
];

type CommunityWorkspaceProps = {
  carreraNombre: string;
  materiasCursando: { nombre: string; codigo: string | null }[];
  planMaterias: MateriaPlanFuente[];
  initialPosts: CommunityPost[];
  sidebarData: CommunitySidebarData;
};

export function CommunityWorkspace({
  carreraNombre,
  materiasCursando,
  planMaterias,
  initialPosts,
  sidebarData,
}: CommunityWorkspaceProps) {
  const router = useRouter();
  const [filter, setFilter] = useState<FeedFilter>("todo");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  const materiaNames = useMemo(
    () => new Set(materiasCursando.map((m) => m.nombre.toLowerCase())),
    [materiasCursando],
  );

  const filteredPosts = useMemo(() => {
    let result = initialPosts;

    switch (filter) {
      case "carrera":
        result = result.filter((p) => p.carrera === carreraNombre);
        break;
      case "materias":
        result = result.filter((p) => materiaNames.has(p.materia.label.toLowerCase()));
        break;
      case "archivos":
        result = result.filter((p) => (p.attachments?.length ?? 0) > 0);
        break;
    }

    if (activeTag) {
      const tagLower = activeTag.toLowerCase();
      result = result.filter((p) =>
        p.tags?.some((t) => t.toLowerCase() === tagLower),
      );
    }

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q) ||
          p.materia.label.toLowerCase().includes(q) ||
          p.tags?.some((t) => t.toLowerCase().includes(q)),
      );
    }

    return result;
  }, [initialPosts, filter, carreraNombre, materiaNames, activeTag, searchQuery]);

  function handlePublished() {
    router.refresh();
    setFilter("todo");
    setActiveTag(null);
    setSearchQuery("");
  }

  return (
    <main className="min-w-0 space-y-6">
      <PageHeader
        pill="Foro estudiantil"
        title={`Comunidad — ${carreraNombre}`}
        description="Compartí apuntes, resolvé dudas y seguí lo que pasa en tu carrera."
        action={
          <Button type="button" onClick={() => setCreateOpen(true)}>
            <Plus className="h-4 w-4" data-icon="inline-start" />
            Nuevo post
          </Button>
        }
      />

      <div className="flex gap-1 overflow-x-auto rounded-xl border border-border bg-surface p-1 filter-scroll-row">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setFilter(tab.key)}
            className={`shrink-0 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
              filter === tab.key
                ? "bg-accent text-white shadow-[var(--shadow-sm)]"
                : "text-secondary hover:text-primary"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid min-w-0 items-start gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(240px,28%)] lg:gap-5">
        <section className="min-w-0 space-y-4">
          {filteredPosts.length === 0 ? (
            <EmptyState message="No hay publicaciones que coincidan con este filtro." />
          ) : (
            filteredPosts.map((post) => <PostCard key={post.id} post={post} />)
          )}
        </section>

        <CommunitySidebar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          activeTag={activeTag}
          onTagSelect={setActiveTag}
          topResources={sidebarData.topResources}
          trendingTags={sidebarData.trendingTags}
        />
      </div>

      <CreatePostModal
        open={createOpen}
        onOpenChange={setCreateOpen}
        planMaterias={planMaterias}
        onPublished={handlePublished}
      />
    </main>
  );
}
