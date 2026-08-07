const LOGIN_DRAFT_KEY = "ucanode_auth_draft_login";
const REGISTRO_DRAFT_KEY = "ucanode_auth_draft_registro";

export type LoginDraft = {
  email: string;
  password: string;
  acceptTerms: boolean;
};

export type RegistroDraft = {
  nombre: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
};

function readDraft<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function writeDraft(key: string, data: object) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(key, JSON.stringify(data));
}

function clearDraft(key: string) {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(key);
}

export function readLoginDraft(): LoginDraft | null {
  return readDraft<LoginDraft>(LOGIN_DRAFT_KEY);
}

export function writeLoginDraft(draft: LoginDraft) {
  writeDraft(LOGIN_DRAFT_KEY, draft);
}

export function clearLoginDraft() {
  clearDraft(LOGIN_DRAFT_KEY);
}

export function readRegistroDraft(): RegistroDraft | null {
  return readDraft<RegistroDraft>(REGISTRO_DRAFT_KEY);
}

export function writeRegistroDraft(draft: RegistroDraft) {
  writeDraft(REGISTRO_DRAFT_KEY, draft);
}

export function clearRegistroDraft() {
  clearDraft(REGISTRO_DRAFT_KEY);
}
