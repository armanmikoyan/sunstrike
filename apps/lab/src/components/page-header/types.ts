import type { ReactNode } from "react";

export type HeadingProps = {
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
};

export type PageHeaderProps = HeadingProps & {
  eyebrow?: string;
  divider?: boolean;
};
