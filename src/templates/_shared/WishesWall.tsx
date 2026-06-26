import { useProjects } from "@/lib/projects-store";

interface Props {
  projectId?: string;
  theme: "light" | "dark";
}

export function WishesWall({ projectId, theme }: Props) {
  const { getProject } = useProjects();
  const project = projectId ? getProject(projectId) : undefined;
  const wishes = project?.wishes ?? [];
  const isDark = theme === "dark";

  if (wishes.length === 0) {
    return (
      <p className="text-center text-sm italic opacity-70">
        Jadilah yang pertama mengirimkan doa.
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {wishes
        .slice()
        .reverse()
        .slice(0, 12)
        .map((w) => (
          <li
            key={w.id}
            className={`rounded-lg p-4 ${
              isDark
                ? "border border-[var(--gilded)]/20 bg-white/5"
                : "border border-[var(--bordeaux)]/10 bg-white/70"
            }`}
          >
            <p className="text-sm leading-relaxed">{w.message}</p>
            <p className="mt-2 text-[11px] uppercase tracking-[0.2em] opacity-60">
              — {w.guestName}
            </p>
          </li>
        ))}
    </ul>
  );
}