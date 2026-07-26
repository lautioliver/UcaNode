import { z } from "zod";

export const POST_TITLE_MIN_LENGTH = 5;
export const POST_CONTENT_MIN_LENGTH = 10;

export const AttachmentTypeSchema = z.enum(["PDF", "DRIVE", "EXAM", "OTRO"]);

export const attachmentInputSchema = z.object({
  name: z.string().min(1, "El nombre del adjunto es requerido"),
  url: z
    .string()
    .url("URL inválida")
    .refine(
      (url) => url.startsWith("http://") || url.startsWith("https://"),
      "Solo se permiten URLs http o https",
    ),
  type: AttachmentTypeSchema.default("OTRO"),
});

export const createPostSchema = z.object({
  title: z
    .string()
    .min(
      POST_TITLE_MIN_LENGTH,
      `El título debe tener al menos ${POST_TITLE_MIN_LENGTH} caracteres`,
    ),
  content: z
    .string()
    .min(
      POST_CONTENT_MIN_LENGTH,
      `El contenido debe tener al menos ${POST_CONTENT_MIN_LENGTH} caracteres`,
    ),
  planEstudioCodigo: z.string().nullable().optional(),
  tags: z.array(z.string()).optional(),
  attachments: z.array(attachmentInputSchema).optional(),
});

export const createCommentSchema = z.object({
  postId: z.string().min(1, "Post requerido"),
  content: z.string().min(1, "El comentario no puede estar vacío"),
  parentId: z.string().nullable().optional(),
});

export const voteSchema = z.object({
  targetId: z.string().min(1),
  type: z.union([z.literal(1), z.literal(-1)]),
});

export const getPostsTabSchema = z.enum([
  "todo",
  "carrera",
  "materias",
  "archivos",
]);

export const getPostsSchema = z.object({
  tab: getPostsTabSchema.default("todo"),
  searchQuery: z.string().optional(),
  cursor: z.string().nullable().optional(),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;
export type CreateCommentInput = z.infer<typeof createCommentSchema>;
export type VoteInput = z.infer<typeof voteSchema>;
export type GetPostsInput = z.infer<typeof getPostsSchema>;
