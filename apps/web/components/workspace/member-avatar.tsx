import { getWorkspaceMemberInitials, type WorkspaceMember } from "@/lib/members";
import { cn } from "@/lib/utils";

interface MemberAvatarProps {
  member?: WorkspaceMember | null;
  size?: "sm" | "md";
  className?: string;
}

export function MemberAvatar({ member, size = "sm", className }: MemberAvatarProps) {
  const dimensionClass = size === "md" ? "h-8 w-8 text-xs" : "h-5 w-5 text-[10px]";

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full font-medium text-white shadow-sm",
        dimensionClass,
        className,
      )}
      style={{ backgroundColor: member?.avatarColor ?? "#71717a" }}
      title={member?.name ?? "未分配成员"}
    >
      {getWorkspaceMemberInitials(member?.name ?? "?")}
    </span>
  );
}
