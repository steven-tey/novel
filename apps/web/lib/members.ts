export type WorkspaceMemberRole = "owner" | "admin" | "member";

export type WorkspaceMember = {
  id: string;
  name: string;
  email: string;
  role: WorkspaceMemberRole;
  avatarColor: string;
  createdAt: string;
  updatedAt: string;
};

export type WorkspaceMemberInput = {
  name: string;
  email: string;
  role?: WorkspaceMemberRole;
};

export const WORKSPACE_MEMBERS_STORAGE_KEY = "docflow-workspace-members";
export const DEFAULT_WORKSPACE_MEMBER_ID = "member-current-user";

const avatarColors = ["#2563eb", "#16a34a", "#9333ea", "#dc2626", "#0891b2", "#ca8a04", "#db2777", "#4f46e5"];

const roleWeight: Record<WorkspaceMemberRole, number> = {
  owner: 0,
  admin: 1,
  member: 2,
};

export const workspaceMemberRoleLabels: Record<WorkspaceMemberRole, string> = {
  owner: "所有者",
  admin: "管理员",
  member: "成员",
};

export const createWorkspaceMemberId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `member-${Date.now()}-${Math.random().toString(36).slice(2)}`;
};

export const createWorkspaceMember = ({ name, email, role = "member" }: WorkspaceMemberInput): WorkspaceMember => {
  const now = new Date().toISOString();
  const id = createWorkspaceMemberId();

  return {
    id,
    name: name.trim(),
    email: email.trim(),
    role,
    avatarColor: avatarColors[Math.abs(hashText(`${name}:${email}:${id}`)) % avatarColors.length],
    createdAt: now,
    updatedAt: now,
  };
};

export const createDefaultWorkspaceMembers = (): WorkspaceMember[] => {
  const now = new Date().toISOString();

  return [
    {
      id: DEFAULT_WORKSPACE_MEMBER_ID,
      name: "我",
      email: "me@docflow.local",
      role: "owner",
      avatarColor: avatarColors[0],
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "member-product",
      name: "产品负责人",
      email: "product@docflow.local",
      role: "admin",
      avatarColor: avatarColors[1],
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "member-tech",
      name: "普通用户",
      email: "user@docflow.local",
      role: "member",
      avatarColor: avatarColors[2],
      createdAt: now,
      updatedAt: now,
    },
  ];
};

export const normalizeWorkspaceMember = (value: Partial<WorkspaceMember> & Record<string, unknown>): WorkspaceMember => {
  const now = new Date().toISOString();
  const name = typeof value.name === "string" && value.name.trim() ? value.name.trim() : "未命名成员";
  const email = typeof value.email === "string" ? value.email.trim() : "";
  const role = value.role === "owner" || value.role === "admin" || value.role === "member" ? value.role : "member";

  return {
    id: typeof value.id === "string" && value.id.trim() ? value.id : createWorkspaceMemberId(),
    name,
    email,
    role,
    avatarColor: typeof value.avatarColor === "string" && value.avatarColor ? value.avatarColor : avatarColors[0],
    createdAt: typeof value.createdAt === "string" ? value.createdAt : now,
    updatedAt: typeof value.updatedAt === "string" ? value.updatedAt : now,
  };
};

export const loadWorkspaceMembers = (): WorkspaceMember[] => {
  if (typeof window === "undefined") return createDefaultWorkspaceMembers();

  const raw = window.localStorage.getItem(WORKSPACE_MEMBERS_STORAGE_KEY);
  if (!raw) {
    const members = createDefaultWorkspaceMembers();
    saveWorkspaceMembers(members);
    return members;
  }

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) throw new Error("Invalid workspace members");
    const members = parsed.map((item) => normalizeWorkspaceMember(item));
    return ensureOwnerMember(members);
  } catch {
    const members = createDefaultWorkspaceMembers();
    saveWorkspaceMembers(members);
    return members;
  }
};

export const saveWorkspaceMembers = (members: WorkspaceMember[]) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(WORKSPACE_MEMBERS_STORAGE_KEY, JSON.stringify(sortWorkspaceMembers(members)));
};

export const sortWorkspaceMembers = (members: WorkspaceMember[]) =>
  [...members].sort((a, b) => {
    if (roleWeight[a.role] !== roleWeight[b.role]) return roleWeight[a.role] - roleWeight[b.role];
    return a.name.localeCompare(b.name, "zh-CN");
  });

export const getWorkspaceMemberInitials = (name: string) => {
  const trimmedName = name.trim();
  if (!trimmedName) return "?";
  return [...trimmedName].slice(0, 2).join("").toUpperCase();
};

export const getMemberById = (members: WorkspaceMember[], memberId?: string | null) =>
  members.find((member) => member.id === memberId) ?? null;

function ensureOwnerMember(members: WorkspaceMember[]) {
  if (members.some((member) => member.id === DEFAULT_WORKSPACE_MEMBER_ID)) {
    return sortWorkspaceMembers(members);
  }

  return sortWorkspaceMembers([...createDefaultWorkspaceMembers().slice(0, 1), ...members]);
}

function hashText(value: string) {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index);
    hash |= 0;
  }
  return hash;
}
