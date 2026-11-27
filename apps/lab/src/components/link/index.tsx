"use client";

import NextLink, { useLinkStatus } from "next/link";
import { useEffect, useRef } from "react";
import type { ComponentProps } from "react";
import { NAVIGATION_SETTLED_EVENT, NAVIGATION_START_EVENT } from "@/components/navigation-progress/constants";

/**
 * Reports this link's pending navigation to the top progress bar. Only a
 * pending → settled transition ends it: a link that unmounts mid-navigation
 * (a drawer closing on click) leaves the finish to the route commit.
 */

function LinkPending() {
  const { pending } = useLinkStatus();
  const started = useRef(false);

  useEffect(() => {
    if (pending) {
      started.current = true;
      window.dispatchEvent(new Event(NAVIGATION_START_EVENT));
    } else if (started.current) {
      started.current = false;
      window.dispatchEvent(new Event(NAVIGATION_SETTLED_EVENT));
    }
  }, [pending]);

  return null;
}

/** `next/link` that drives the navigation progress bar from Next's own pending state. */
export function Link({ children, ...props }: ComponentProps<typeof NextLink>) {
  return (
    <NextLink {...props}>
      {children}
      <LinkPending />
    </NextLink>
  );
}
