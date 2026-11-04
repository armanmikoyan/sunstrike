import { cn } from "@/lib/utils";

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col justify-between gap-5 border-b border-border pb-6 sm:flex-row sm:items-end",
        className,
      )}
    >
      <div>
        {eyebrow ? (
          <div className="mb-2 text-[0.75rem] text-muted-foreground">
            {eyebrow}
          </div>
        ) : null}
        <h1 className="text-[1.875rem] font-medium leading-tight tracking-[-0.035em] sm:text-[2.25rem]">
          {title}
        </h1>
        {description ? (
          <p className="mt-2 max-w-xl text-[0.8125rem] leading-relaxed text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
