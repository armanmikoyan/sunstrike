import type { LIBRARY_TABS } from "./constants";
import type { useLibraryView } from "./hooks";

export type LibraryTab = (typeof LIBRARY_TABS)[number]["value"];

export type LibraryViewState = ReturnType<typeof useLibraryView>;
