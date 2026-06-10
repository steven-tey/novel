import {
  AUTH_COOKIE_NAME,
  authenticateUser,
  createSessionToken,
  getAuthCookieOptions,
} from "@/lib/server-auth";
import type { LoginPayload } from "@/lib/auth";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const normalizeLoginPayload = (value: unknown): LoginPayload | null => {
  if (!value || typeof value !== "object") return null;
  const record = value as Record<string, unknown>;
  const role = record.role === "admin" || record.role === "user" ? record.role : null;
  const email = typeof record.email === "string" ? record.email.trim().toLowerCase() : "";
  const password = typeof record.password === "string" ? record.password : "";

  if (!role || !email || !password) return null;
  return { role, email, password };
};

export async function POST(req: Request) {
  const payload = normalizeLoginPayload(await req.json().catch(() => null));
  if (!payload) {
    return NextResponse.json({ error: "请输入账号、密码和登录角色。" }, { status: 400 });
  }

  const session = authenticateUser(payload);
  if (!session) {
    return NextResponse.json({ error: "账号、密码或登录角色不正确。" }, { status: 401 });
  }

  const response = NextResponse.json({ session });
  response.cookies.set(AUTH_COOKIE_NAME, createSessionToken(session), getAuthCookieOptions());
  return response;
}
