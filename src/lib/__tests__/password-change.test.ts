import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  PASSWORD_RESET_OK_MESSAGE,
  requestPasswordResetForEmail,
  sendPasswordChangeForPerfil,
} from "../password-change";

const mocks = vi.hoisted(() => ({
  findUnique: vi.fn(),
  canResendSecurityAction: vi.fn(),
  createSecurityActionToken: vi.fn(),
  sendPasswordChangeEmail: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    perfil: {
      findUnique: mocks.findUnique,
    },
  },
}));

vi.mock("@/lib/security-action", () => ({
  canResendSecurityAction: mocks.canResendSecurityAction,
  createSecurityActionToken: mocks.createSecurityActionToken,
  isEligibleForPasswordRecovery: (perfil: {
    password: string | null;
    emailVerifiedAt: Date | null;
    emailUcasal: string | null;
  } | null) =>
    Boolean(perfil?.password && perfil.emailVerifiedAt && perfil.emailUcasal),
}));

vi.mock("@/lib/email-security", () => ({
  sendPasswordChangeEmail: mocks.sendPasswordChangeEmail,
}));

vi.mock("@/lib/app-url", () => ({
  getAppUrl: () => "http://localhost:3000",
}));

describe("password change emails", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.canResendSecurityAction.mockResolvedValue(true);
    mocks.createSecurityActionToken.mockResolvedValue("raw-token");
    mocks.sendPasswordChangeEmail.mockResolvedValue(undefined);
  });

  it("requestPasswordResetForEmail returns generic success for unknown email", async () => {
    mocks.findUnique.mockResolvedValue(null);

    const result = await requestPasswordResetForEmail("missing@ucasal.edu.ar");

    expect(result.ok).toBe(true);
    expect(result.message).toBe(PASSWORD_RESET_OK_MESSAGE);
    expect(mocks.sendPasswordChangeEmail).not.toHaveBeenCalled();
  });

  it("sendPasswordChangeForPerfil sends email for eligible profile", async () => {
    mocks.findUnique.mockResolvedValue({
      id: "perfil-1",
      nombre: "Ana",
      password: "hash",
      emailVerifiedAt: new Date(),
      emailUcasal: "ana@ucasal.edu.ar",
    });

    const result = await sendPasswordChangeForPerfil("perfil-1");

    expect(result.ok).toBe(true);
    expect(mocks.sendPasswordChangeEmail).toHaveBeenCalledWith({
      to: "ana@ucasal.edu.ar",
      nombre: "Ana",
      changeUrl: expect.stringContaining("/cambiar-contrasena?token="),
    });
  });
});
