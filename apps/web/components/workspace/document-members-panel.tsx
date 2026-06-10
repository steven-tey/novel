"use client";

import { Button } from "@/components/tailwind/ui/button";
import { MemberAvatar } from "@/components/workspace/member-avatar";
import {
  type DocumentItem,
  type DocumentMemberAccess,
  type DocumentMemberRole,
  type DocumentMetaUpdate,
} from "@/lib/documents";
import {
  DEFAULT_WORKSPACE_MEMBER_ID,
  getMemberById,
  type WorkspaceMember,
  type WorkspaceMemberInput,
  type WorkspaceMemberRole,
  workspaceMemberRoleLabels,
} from "@/lib/members";
import { cn } from "@/lib/utils";
import { Plus, UserPlus, Users, X } from "lucide-react";
import { useMemo, useState } from "react";

const documentMemberRoleLabels: Record<DocumentMemberRole, string> = {
  editor: "可编辑",
  viewer: "可查看",
};

interface DocumentMembersPanelProps {
  document: DocumentItem;
  members: WorkspaceMember[];
  onChange?: (updates: DocumentMetaUpdate) => void;
  onCreateMember?: (input: WorkspaceMemberInput) => WorkspaceMember;
}

export function DocumentMembersPanel({ document, members, onChange, onCreateMember }: DocumentMembersPanelProps) {
  const ownerId = document.ownerId ?? DEFAULT_WORKSPACE_MEMBER_ID;
  const owner = getMemberById(members, ownerId);
  const [selectedMemberId, setSelectedMemberId] = useState("");
  const [selectedRole, setSelectedRole] = useState<DocumentMemberRole>("editor");
  const [creatingMember, setCreatingMember] = useState(false);
  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [newMemberRole, setNewMemberRole] = useState<WorkspaceMemberRole>("member");

  const collaboratorAccess = useMemo(
    () => normalizeCollaboratorAccess(document.memberAccess ?? [], ownerId),
    [document.memberAccess, ownerId],
  );
  const collaboratorIds = new Set(collaboratorAccess.map((access) => access.memberId));
  const availableMembers = members.filter((member) => member.id !== ownerId && !collaboratorIds.has(member.id));

  const updateCollaborators = (nextAccess: DocumentMemberAccess[]) => {
    onChange?.({ memberAccess: normalizeCollaboratorAccess(nextAccess, ownerId) });
  };

  const changeOwner = (nextOwnerId: string) => {
    onChange?.({
      ownerId: nextOwnerId,
      memberAccess: normalizeCollaboratorAccess(collaboratorAccess, nextOwnerId),
    });
  };

  const addCollaborator = () => {
    if (!selectedMemberId) return;
    updateCollaborators([...collaboratorAccess, { memberId: selectedMemberId, role: selectedRole }]);
    setSelectedMemberId("");
    setSelectedRole("editor");
  };

  const updateCollaboratorRole = (memberId: string, role: DocumentMemberRole) => {
    updateCollaborators(collaboratorAccess.map((access) => (access.memberId === memberId ? { ...access, role } : access)));
  };

  const removeCollaborator = (memberId: string) => {
    updateCollaborators(collaboratorAccess.filter((access) => access.memberId !== memberId));
  };

  const createAndAssignMember = () => {
    const name = newMemberName.trim();
    if (!name || !onCreateMember) return;

    const member = onCreateMember({
      name,
      email: newMemberEmail.trim() || `member-${Date.now()}@docflow.local`,
      role: newMemberRole,
    });

    updateCollaborators([...collaboratorAccess, { memberId: member.id, role: "editor" }]);
    setNewMemberName("");
    setNewMemberEmail("");
    setNewMemberRole("member");
    setCreatingMember(false);
  };

  return (
    <div className="rounded-md border bg-background p-3">
      <div className="flex items-center gap-2">
        <Users className="h-3.5 w-3.5 text-muted-foreground" />
        <div className="text-xs font-medium text-muted-foreground">成员协作</div>
      </div>

      <div className="mt-3 space-y-3">
        <div>
          <div className="mb-1.5 text-xs text-muted-foreground">负责人</div>
          <div className="flex items-center gap-2">
            <MemberAvatar member={owner} />
            <select
              value={ownerId}
              disabled={!onChange}
              onChange={(event) => changeOwner(event.target.value)}
              className="h-8 min-w-0 flex-1 rounded-md border bg-background px-2 text-sm outline-none focus:border-foreground disabled:cursor-not-allowed disabled:opacity-60"
            >
              {members.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name} · {workspaceMemberRoleLabels[member.role]}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <div className="mb-1.5 text-xs text-muted-foreground">协作者</div>
          {collaboratorAccess.length ? (
            <div className="space-y-2">
              {collaboratorAccess.map((access) => {
                const member = getMemberById(members, access.memberId);
                return (
                  <div key={access.memberId} className="flex items-center gap-2 rounded-md bg-muted/50 px-2 py-1.5">
                    <MemberAvatar member={member} />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-xs font-medium">{member?.name ?? "未知成员"}</div>
                      <div className="truncate text-[11px] text-muted-foreground">{member?.email ?? access.memberId}</div>
                    </div>
                    <select
                      value={access.role}
                      disabled={!onChange}
                      onChange={(event) => updateCollaboratorRole(access.memberId, event.target.value as DocumentMemberRole)}
                      className="h-7 rounded-md border bg-background px-1.5 text-xs outline-none focus:border-foreground disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {Object.entries(documentMemberRoleLabels).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      disabled={!onChange}
                      className="flex h-7 w-7 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-background hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
                      onClick={() => removeCollaborator(access.memberId)}
                      title="移除协作者"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-md border border-dashed px-3 py-4 text-center text-xs text-muted-foreground">
              还没有添加协作者
            </div>
          )}
        </div>

        <div className="grid grid-cols-[minmax(0,1fr)_86px] gap-2">
          <select
            value={selectedMemberId}
            disabled={!onChange || availableMembers.length === 0}
            onChange={(event) => setSelectedMemberId(event.target.value)}
            className="h-8 min-w-0 rounded-md border bg-background px-2 text-sm outline-none focus:border-foreground disabled:cursor-not-allowed disabled:opacity-60"
          >
            <option value="">{availableMembers.length ? "选择成员" : "无可添加成员"}</option>
            {availableMembers.map((member) => (
              <option key={member.id} value={member.id}>
                {member.name}
              </option>
            ))}
          </select>
          <select
            value={selectedRole}
            disabled={!onChange || !selectedMemberId}
            onChange={(event) => setSelectedRole(event.target.value as DocumentMemberRole)}
            className="h-8 rounded-md border bg-background px-2 text-sm outline-none focus:border-foreground disabled:cursor-not-allowed disabled:opacity-60"
          >
            {Object.entries(documentMemberRoleLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="h-8 w-full gap-2"
          disabled={!onChange || !selectedMemberId}
          onClick={addCollaborator}
        >
          <Plus className="h-3.5 w-3.5" />
          添加到当前文档
        </Button>

        {onCreateMember && (
          <div className={cn("rounded-md border border-dashed p-2", creatingMember ? "space-y-2" : "border-transparent p-0")}>
            {creatingMember ? (
              <>
                <input
                  value={newMemberName}
                  onChange={(event) => setNewMemberName(event.target.value)}
                  className="h-8 w-full rounded-md border bg-background px-2 text-sm outline-none focus:border-foreground"
                  placeholder="成员姓名"
                />
                <input
                  value={newMemberEmail}
                  onChange={(event) => setNewMemberEmail(event.target.value)}
                  className="h-8 w-full rounded-md border bg-background px-2 text-sm outline-none focus:border-foreground"
                  placeholder="邮箱，可选"
                />
                <select
                  value={newMemberRole}
                  onChange={(event) => setNewMemberRole(event.target.value as WorkspaceMemberRole)}
                  className="h-8 w-full rounded-md border bg-background px-2 text-sm outline-none focus:border-foreground"
                >
                  <option value="member">成员</option>
                  <option value="admin">管理员</option>
                </select>
                <div className="flex gap-2">
                  <Button size="sm" className="h-8 flex-1" disabled={!newMemberName.trim()} onClick={createAndAssignMember}>
                    创建并添加
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8" onClick={() => setCreatingMember(false)}>
                    取消
                  </Button>
                </div>
              </>
            ) : (
              <Button variant="ghost" size="sm" className="h-8 w-full gap-2 text-muted-foreground" onClick={() => setCreatingMember(true)}>
                <UserPlus className="h-3.5 w-3.5" />
                新建成员并加入文档
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function normalizeCollaboratorAccess(accessList: DocumentMemberAccess[], ownerId: string): DocumentMemberAccess[] {
  const accessByMemberId = new Map<string, DocumentMemberRole>();

  for (const access of accessList) {
    if (!access.memberId || access.memberId === ownerId) continue;
    accessByMemberId.set(access.memberId, access.role === "viewer" ? "viewer" : "editor");
  }

  return [...accessByMemberId.entries()].map(([memberId, role]) => ({ memberId, role }));
}
