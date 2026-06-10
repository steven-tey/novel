import { DEFAULT_WORKSPACE_MEMBER_ID } from "@/lib/members";

export type AuthRole = "admin" | "user";

export type AuthSession = {
  id: string;
  memberId: string;
  name: string;
  email: string;
  role: AuthRole;
  loggedInAt: string;
};

export type LoginPayload = {
  role: AuthRole;
  email: string;
  password: string;
};

export const DEFAULT_USER_MEMBER_ID = "member-tech";

export const authRoleLabels: Record<AuthRole, string> = {
  admin: "管理员",
  user: "普通用户",
};

export const demoAccounts: Record<AuthRole, { email: string; password: string; name: string; memberId: string }> = {
  admin: {
    email: "admin@docflow.local",
    password: "admin123",
    name: "系统管理员",
    memberId: DEFAULT_WORKSPACE_MEMBER_ID,
  },
  user: {
    email: "user@docflow.local",
    password: "user123",
    name: "普通用户",
    memberId: DEFAULT_USER_MEMBER_ID,
  },
};

export const loginWithPassword = async (payload: LoginPayload): Promise<AuthSession> => {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });
  const result = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(typeof result?.error === "string" ? result.error : "登录失败，请稍后重试。");
  }

  return normalizeAuthSession(result?.session);
};

export const loadAuthSession = async (): Promise<AuthSession | null> => {
  try {
    const response = await fetch("/api/auth/me", {
      method: "GET",
      credentials: "include",
      cache: "no-store",
    });

    if (!response.ok) return null;
    const result = await response.json().catch(() => null);
    return result?.session ? normalizeAuthSession(result.session) : null;
  } catch {
    return null;
  }
};

export const clearAuthSession = async () => {
  await fetch("/api/auth/logout", {
    method: "POST",
    credentials: "include",
  }).catch(() => null);
};

export const isAdminSession = (session: AuthSession | null) => session?.role === "admin";

function normalizeAuthSession(value: Partial<AuthSession> & Record<string, unknown>): AuthSession {
  if (!value || (value.role !== "admin" && value.role !== "user")) {
    throw new Error("登录状态无效，请重新登录。");
  }

  const account = demoAccounts[value.role];

  return {
    id: typeof value.id === "string" && value.id ? value.id : `${value.role}-${Date.now()}`,
    memberId: typeof value.memberId === "string" && value.memberId ? value.memberId : account.memberId,
    name: typeof value.name === "string" && value.name ? value.name : account.name,
    email: typeof value.email === "string" && value.email ? value.email : account.email,
    role: value.role,
    loggedInAt: typeof value.loggedInAt === "string" ? value.loggedInAt : new Date().toISOString(),
  };
}
