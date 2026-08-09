export const PERFIL_COOKIE = "ucanode_perfil_id";
export const SESSION_VERSION_COOKIE = "ucanode_session_v";

type SessionCookieOptions = {
  httpOnly: boolean;
  sameSite: "lax";
  secure: boolean;
  path: string;
  maxAge: number;
};

export function perfilCookieOptions(): SessionCookieOptions {
  return {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  };
}

export type SessionCookieEntry = {
  name: string;
  value: string;
  options: SessionCookieOptions;
};

export function sessionCookieEntries(
  perfilId: string,
  sessionVersion: number,
): SessionCookieEntry[] {
  const options = perfilCookieOptions();
  return [
    { name: PERFIL_COOKIE, value: perfilId, options },
    {
      name: SESSION_VERSION_COOKIE,
      value: String(sessionVersion),
      options,
    },
  ];
}

export function sessionCookieNames(): string[] {
  return [PERFIL_COOKIE, SESSION_VERSION_COOKIE];
}
