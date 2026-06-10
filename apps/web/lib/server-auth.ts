import { DEFAULT_USER_MEMBER_ID, type AuthRole, type AuthSession, type LoginPayload } from "@/lib/auth";
import { DEFAULT_WORKSPACE_MEMBER_ID } from "@/lib/members";
import { createHmac, randomUUID, scryptSync, timingSafeEqual } from "node:crypto";

export const AUTH_COOKIE_NAME = "docflow_auth";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;

type AuthUser = {
  id: string;
  memberId: string;
  name: string;
  email: string;
  role: AuthRole;
  passwordHash: string;
};

type AuthTokenPayload = AuthSession & {
  expiresAt: string;
};

const users: AuthUser[] = [
  {
    id: "user-admin",
    memberId: DEFAULT_WORKSPACE_MEMBER_ID,
    name: "系统管理员",
    email: "admin@docflow.local",
    role: "admin",
    passwordHash:
      "scrypt$16384$8$1$docflow-admin-salt-v1$fyUd-PgfdB1EtoYtgUFmpZwN_VUotTZbeQXXBx8FWGMHiI4j8WYpQTfOpE9m7MEzyJ5Mi87z_9ULxSklmZSDVA",
  },
  {
    id: "user-member",
    memberId: DEFAULT_USER_MEMBER_ID,
    name: "普通用户",
    email: "user@docflow.local",
    role: "user",
    passwordHash:
      "scrypt$16384$8$1$docflow-user-salt-v1$rNbu-cURqr3G6LgpGa-FsITC0xIu1iwSv8FQ7X4nvLKOcLwfJqiXj1DutfMz4dw-h6Doh9xsxmyWUfT2POdu2w",
  },
];

export const authenticateUser = ({ email, password, role }: LoginPayload): AuthSession | null => {
  const normalizedEmail = email.trim().toLowerCase();
  const user = users.find((item) => item.email === normalizedEmail);
  if (!user || user.role !== role) return null;
  if (!verifyPassword(password, user.passwordHash)) return null;

  return {
    id: user.id,
    memberId: user.memberId,
    name: user.name,
    email: user.email,
    role: user.role,
    loggedInAt: new Date().toISOString(),
  };
};

export const createSessionToken = (session: AuthSession) => {
  const payload: AuthTokenPayload = {
    ...session,
    expiresAt: new Date(Date.now() + SESSION_TTL_SECONDS * 1000).toISOString(),
  };
  const encodedPayload = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  return `${encodedPayload}.${signValue(encodedPayload)}`;
};

export const readSessionToken = (token?: string | null): AuthSession | null => {
  if (!token) return null;
  const [encodedPayload, signature] = token.split(".");
  if (!encodedPayload || !signature) return null;
  if (!safeEqual(signature, signValue(encodedPayload))) return null;

  try {
    const payload = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8")) as Partial<AuthTokenPayload>;
    if (!payload.expiresAt || new Date(payload.expiresAt).getTime() <= Date.now()) return null;
    return normalizeSessionPayload(payload);
  } catch {
    return null;
  }
};

export const getAuthCookieOptions = () => ({
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: SESSION_TTL_SECONDS,
});

export const getExpiredAuthCookieOptions = () => ({
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 0,
});

const verifyPassword = (password: string, passwordHash: string) => {
  const [algorithm, nValue, rValue, pValue, salt, expectedHash] = passwordHash.split("$");
  if (algorithm !== "scrypt" || !nValue || !rValue || !pValue || !salt || !expectedHash) return false;

  const actual = scryptSync(password, salt, Buffer.from(expectedHash, "base64url").length, {
    N: Number(nValue),
    r: Number(rValue),
    p: Number(pValue),
  });
  const expected = Buffer.from(expectedHash, "base64url");
  return actual.length === expected.length && timingSafeEqual(new Uint8Array(actual), new Uint8Array(expected));
};

const normalizeSessionPayload = (payload: Partial<AuthTokenPayload>): AuthSession | null => {
  if (payload.role !== "admin" && payload.role !== "user") return null;
  if (typeof payload.memberId !== "string" || typeof payload.email !== "string") return null;

  return {
    id: typeof payload.id === "string" && payload.id ? payload.id : randomUUID(),
    memberId: payload.memberId,
    name: typeof payload.name === "string" && payload.name ? payload.name : payload.email,
    email: payload.email,
    role: payload.role,
    loggedInAt: typeof payload.loggedInAt === "string" ? payload.loggedInAt : new Date().toISOString(),
  };
};

const signValue = (value: string) =>
  createHmac("sha256", process.env.AUTH_SECRET || "docflow-dev-auth-secret-change-me").update(value).digest("base64url");

const safeEqual = (left: string, right: string) => {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return (
    leftBuffer.length === rightBuffer.length &&
    timingSafeEqual(new Uint8Array(leftBuffer), new Uint8Array(rightBuffer))
  );
};
