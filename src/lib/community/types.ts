import type {
  AttachmentType,
  PlanEstudio,
  PostAttachment,
  Prisma,
} from "@/generated/prisma/client";

export type PostWithRelations = Prisma.PostGetPayload<{
  include: {
    perfil: { select: { id: true; nombre: true; anioIngreso: true } };
    planEstudio: { select: { id: true; codigo: true; nombre: true } };
    carrera: { select: { id: true; nombre: true } };
    attachments: true;
    votes: { select: { type: true; perfilId: true } };
    _count: { select: { comments: true } };
  };
}>;

export type PostDetailWithRelations = Prisma.PostGetPayload<{
  include: {
    perfil: { select: { id: true; nombre: true; anioIngreso: true } };
    planEstudio: { select: { id: true; codigo: true; nombre: true } };
    carrera: { select: { id: true; nombre: true } };
    attachments: true;
    votes: { select: { type: true; perfilId: true } };
    comments: {
      include: {
        perfil: { select: { id: true; nombre: true; anioIngreso: true } };
        votes: { select: { type: true; perfilId: true } };
      };
    };
  };
}>;

export type CommentWithRelations = PostDetailWithRelations["comments"][number];

export type PlanEstudioRef = Pick<PlanEstudio, "codigo" | "nombre"> | null;

export type AttachmentRef = Pick<PostAttachment, "name" | "url" | "type">;

export type UiAttachmentType = "pdf" | "drive" | "exam";

export function toUiAttachmentType(type: AttachmentType): UiAttachmentType {
  switch (type) {
    case "PDF":
      return "pdf";
    case "DRIVE":
      return "drive";
    case "EXAM":
      return "exam";
    default:
      return "pdf";
  }
}
