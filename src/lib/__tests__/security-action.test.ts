import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  PASSWORD_CHANGE_TTL_MS,
  EMAIL_CHANGE_TTL_MS,
  canResendSecurityAction,
  createSecurityActionToken,
  peekSecurityToken,
  consumeSecurityToken,
  isEligibleForPasswordRecovery,
} from "../security-action";
import { hashVerificationToken } from "../verification-token";
import { SecurityActionType } from "@/generated/prisma/client";

const mocks = vi.hoisted(() => ({
  deleteMany: vi.fn(),
  create: vi.fn(),
  findUnique: vi.fn(),
  findFirst: vi.fn(),
  delete: vi.fn(),
  transaction: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    securityActionToken: {
      deleteMany: mocks.deleteMany,
      create: mocks.create,
      findUnique: mocks.findUnique,
      findFirst: mocks.findFirst,
      delete: mocks.delete,
    },
    $transaction: mocks.transaction,
  },
}));

describe("security-action helpers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.transaction.mockImplementation(async (ops: Promise<unknown>[]) => {
      for (const op of ops) await op;
    });
    mocks.deleteMany.mockResolvedValue({ count: 0 });
    mocks.create.mockResolvedValue({ id: "token-1" });
  });

  it("uses expected TTL constants", () => {
    expect(PASSWORD_CHANGE_TTL_MS).toBe(60 * 60 * 1000);
    expect(EMAIL_CHANGE_TTL_MS).toBe(24 * 60 * 60 * 1000);
  });

  it("creates password change token and replaces previous ones", async () => {
    const rawToken = await createSecurityActionToken(
      "perfil-1",
      SecurityActionType.PASSWORD_CHANGE,
    );

    expect(rawToken).toBeTruthy();
    expect(mocks.transaction).toHaveBeenCalledOnce();
    expect(mocks.deleteMany).toHaveBeenCalledWith({
      where: { perfilId: "perfil-1", type: SecurityActionType.PASSWORD_CHANGE },
    });
    expect(mocks.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          perfilId: "perfil-1",
          type: SecurityActionType.PASSWORD_CHANGE,
          tokenHash: hashVerificationToken(rawToken),
        }),
      }),
    );
  });

  it("peeks valid email change token with payload", async () => {
    const rawToken = "raw-token";
    mocks.findUnique.mockResolvedValue({
      id: "token-1",
      perfilId: "perfil-1",
      type: SecurityActionType.EMAIL_CHANGE,
      payload: { newEmail: "nuevo@ucasal.edu.ar" },
      expiresAt: new Date(Date.now() + 60_000),
      perfil: {
        nombre: "Ana",
        emailUcasal: "ana@ucasal.edu.ar",
      },
    });

    const result = await peekSecurityToken(rawToken, SecurityActionType.EMAIL_CHANGE);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.payload?.newEmail).toBe("nuevo@ucasal.edu.ar");
      expect(result.emailUcasal).toBe("ana@ucasal.edu.ar");
    }
  });

  it("returns expired when token is stale", async () => {
    mocks.findUnique.mockResolvedValue({
      id: "token-1",
      perfilId: "perfil-1",
      type: SecurityActionType.PASSWORD_CHANGE,
      payload: null,
      expiresAt: new Date(Date.now() - 60_000),
      perfil: { nombre: "Ana", emailUcasal: "ana@ucasal.edu.ar" },
    });
    mocks.delete.mockResolvedValue({ id: "token-1" });

    const result = await peekSecurityToken("expired-token");

    expect(result).toEqual({ ok: false, reason: "expired" });
    expect(mocks.delete).toHaveBeenCalledWith({ where: { id: "token-1" } });
  });

  it("consumes valid token and deletes it", async () => {
    mocks.findUnique.mockResolvedValue({
      id: "token-1",
      perfilId: "perfil-1",
      type: SecurityActionType.PASSWORD_CHANGE,
      payload: null,
      expiresAt: new Date(Date.now() + 60_000),
    });
    mocks.delete.mockResolvedValue({ id: "token-1" });

    const result = await consumeSecurityToken(
      "valid-token",
      SecurityActionType.PASSWORD_CHANGE,
    );

    expect(result).toEqual({
      ok: true,
      perfilId: "perfil-1",
      type: SecurityActionType.PASSWORD_CHANGE,
      payload: null,
    });
    expect(mocks.delete).toHaveBeenCalledWith({ where: { id: "token-1" } });
  });

  it("respects resend cooldown", async () => {
    mocks.findFirst.mockResolvedValue({
      createdAt: new Date(Date.now() - 30_000),
    });

    const allowed = await canResendSecurityAction(
      "perfil-1",
      SecurityActionType.PASSWORD_CHANGE,
    );

    expect(allowed).toBe(false);
  });

  it("detects eligible password recovery profiles", () => {
    expect(
      isEligibleForPasswordRecovery({
        password: "hash",
        emailVerifiedAt: new Date(),
        emailUcasal: "ana@ucasal.edu.ar",
      }),
    ).toBe(true);

    expect(
      isEligibleForPasswordRecovery({
        password: null,
        emailVerifiedAt: new Date(),
        emailUcasal: "ana@ucasal.edu.ar",
      }),
    ).toBe(false);
  });
});
