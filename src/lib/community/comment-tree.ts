import type { CommunityComment } from "@/app/comunidad/components/mock-data";
import type { CommentWithRelations } from "@/lib/community/types";
import { toCommunityComment } from "@/lib/community/mappers";

export function buildCommentTree(
  flat: CommentWithRelations[],
  karmaByPerfilId: Map<string, number>,
): CommunityComment[] {
  const byId = new Map<string, CommunityComment>();
  const roots: CommunityComment[] = [];

  for (const row of flat) {
    byId.set(row.id, toCommunityComment(row, karmaByPerfilId));
  }

  for (const row of flat) {
    const node = byId.get(row.id)!;
    if (row.parentId) {
      const parent = byId.get(row.parentId);
      if (parent) {
        parent.children = parent.children ?? [];
        parent.children.push(node);
      } else {
        roots.push(node);
      }
    } else {
      roots.push(node);
    }
  }

  function sortTree(nodes: CommunityComment[]) {
    nodes.sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );
    for (const node of nodes) {
      if (node.children?.length) sortTree(node.children);
    }
  }

  sortTree(roots);
  return roots;
}

export function countCommentsInTree(comments: CommunityComment[]): number {
  let total = 0;
  for (const comment of comments) {
    total += 1;
    if (comment.children?.length) {
      total += countCommentsInTree(comment.children);
    }
  }
  return total;
}
