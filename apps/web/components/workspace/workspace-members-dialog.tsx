"use client";

import { Button } from "@/components/tailwind/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/tailwind/ui/dialog";
import { MemberAvatar } from "@/components/workspace/member-avatar";
import type { DocumentItem } from "@/lib/documents";
import {
  DEFAULT_WORKSPACE_MEMBER_ID,
  type WorkspaceMember,
  type WorkspaceMemberInput,
  type WorkspaceMemberRole,
  workspaceMemberRoleLabels,
} from "@/lib/members";
import { Trash2, UserPlus, Users } from "lucide-react";
import { useMemo, useState } from "react";

interface WorkspaceMembersDialogProps {
  open: boolean;
  members: WorkspaceMember[];
  documents: DocumentItem[];
  onOpenChange: (open: boolean) => void;
  onCreateMember: (input: WorkspaceMemberInput) => WorkspaceMember;
  onUpdateMember: (memberId: string, updates: Partial<Pick<WorkspaceMember, "name" | "email" | "role">>) => void;
  onDeleteMember: (memberId: string) => void;
}

export function WorkspaceMembersDialog({
  open,
  members,
  documents,
  onOpenChange,
  onCreateMember,
  onUpdateMember,
  onDeleteMember,
}: WorkspaceMembersDialogProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<WorkspaceMemberRole>("member");

  const assignedCountByMemberId = useMemo(() => {
    const result = new Map<string, number>();

    for (const document of documents) {
      const participantIds = new Set<string>();
      if (document.ownerId) participantIds.add(document.ownerId);
      for (const access of document.memberAccess ?? []) participantIds.add(access.memberId);

      for (const memberId of participantIds) {
        result.set(memberId, (result.get(memberId) ?? 0) + 1);
      }
    }

    return result;
  }, [documents]);

  const createMember = () => {
    const nextName = name.trim();
    if (!nextName) return;

    onCreateMember({
      name: nextName,
      email: email.trim() || `member-${Date.now()}@docflow.local`,
      role,
    });
    setName("");
    setEmail("");
    setRole("member");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] w-[calc(100vw-2rem)] max-w-2xl grid-rows-[auto_minmax(0,1fr)] overflow-hidden p-0">
        <DialogHeader className="border-b px-5 py-4 pr-12">
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            工作区成员
          </DialogTitle>
          <DialogDescription>管理工作区成员，并把成员分配到具体文档中。</DialogDescription>
        </DialogHeader>

        <div className="min-h-0 overflow-y-auto px-5 py-4">
          <section className="rounded-md border bg-background p-3">
            <div className="mb-3 flex items-center gap-2 text-sm font-medium">
              <UserPlus className="h-4 w-4 text-muted-foreground" />
              新增成员
            </div>
            <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_112px]">
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="h-9 rounded-md border bg-background px-3 text-sm outline-none focus:border-foreground"
                placeholder="姓名"
              />
              <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="h-9 rounded-md border bg-background px-3 text-sm outline-none focus:border-foreground"
                placeholder="邮箱，可选"
              />
              <select
                value={role}
                onChange={(event) => setRole(event.target.value as WorkspaceMemberRole)}
                className="h-9 rounded-md border bg-background px-3 text-sm outline-none focus:border-foreground"
              >
                <option value="member">成员</option>
                <option value="admin">管理员</option>
              </select>
            </div>
            <Button className="mt-3 h-8 gap-2" disabled={!name.trim()} onClick={createMember}>
              <UserPlus className="h-3.5 w-3.5" />
              添加成员
            </Button>
          </section>

          <section className="mt-4">
            <div className="mb-2 text-xs font-medium text-muted-foreground">成员列表</div>
            <div className="divide-y rounded-md border bg-background">
              {members.map((member) => {
                const assignedCount = assignedCountByMemberId.get(member.id) ?? 0;
                const protectedMember = member.id === DEFAULT_WORKSPACE_MEMBER_ID || member.role === "owner";
                const canDelete = !protectedMember && assignedCount === 0;

                return (
                  <div key={member.id} className="grid gap-3 px-3 py-3 sm:grid-cols-[minmax(0,1fr)_112px_72px]">
                    <div className="flex min-w-0 items-center gap-3">
                      <MemberAvatar member={member} size="md" />
                      <div className="min-w-0 flex-1">
                        <input
                          value={member.name}
                          disabled={member.role === "owner"}
                          onChange={(event) => onUpdateMember(member.id, { name: event.target.value })}
                          className="h-7 w-full rounded-md border border-transparent bg-transparent px-1 text-sm font-medium outline-none focus:border-border focus:bg-background disabled:opacity-80"
                        />
                        <input
                          value={member.email}
                          disabled={member.role === "owner"}
                          onChange={(event) => onUpdateMember(member.id, { email: event.target.value })}
                          className="h-7 w-full rounded-md border border-transparent bg-transparent px-1 text-xs text-muted-foreground outline-none focus:border-border focus:bg-background disabled:opacity-80"
                        />
                        <div className="mt-1 text-[11px] text-muted-foreground">关联 {assignedCount} 篇文档</div>
                      </div>
                    </div>
                    <select
                      value={member.role}
                      disabled={member.role === "owner"}
                      onChange={(event) => onUpdateMember(member.id, { role: event.target.value as WorkspaceMemberRole })}
                      className="h-8 rounded-md border bg-background px-2 text-sm outline-none focus:border-foreground disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {Object.entries(workspaceMemberRoleLabels).map(([value, label]) => (
                        <option key={value} value={value} disabled={value === "owner"}>
                          {label}
                        </option>
                      ))}
                    </select>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 justify-center gap-1.5 text-red-600 hover:bg-red-50 hover:text-red-700 disabled:text-muted-foreground dark:hover:bg-red-950"
                      disabled={!canDelete}
                      onClick={() => onDeleteMember(member.id)}
                      title={
                        canDelete
                          ? "删除成员"
                          : protectedMember
                            ? "系统所有者不能删除"
                            : "该成员仍关联文档，先移除文档协作关系"
                      }
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      删除
                    </Button>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}
