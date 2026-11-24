import type { ReactNode } from "react";

export type PresenceListProps<T extends { id: string }> = {
  items: readonly T[];
  children: (item: T) => ReactNode;
  itemClassName?: string;
};
