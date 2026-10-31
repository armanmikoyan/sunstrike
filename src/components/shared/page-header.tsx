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
          <div className="mb-2 text-[12px] text-muted-foreground">
            {eyebrow}
          </div>
        ) : null}
        <h1 className="text-[30px] font-medium leading-tight tracking-[-0.035em] sm:text-[36px]">
          {title}
        </h1>
        {description ? (
          <p className="mt-2 max-w-xl text-[13px] leading-relaxed text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
