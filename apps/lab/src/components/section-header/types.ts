import type { ReactNode } from "react";

export type SectionHeaderProps = {
  title: ReactNode;
  description: string;
  action?: ReactNode;
  className?: string;
};
