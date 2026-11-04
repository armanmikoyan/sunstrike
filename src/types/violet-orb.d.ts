import type { DetailedHTMLProps, HTMLAttributes } from "react";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      /**
       * The WebGL orb custom element registered by
       * `public/brand/violet-orb.js`.
       */
      "violet-orb": DetailedHTMLProps<
        HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        /** Seconds per revolution. Defaults to 12. */
        duration?: string;
        /** Present to hold the orb still until `play()` is called. */
        paused?: boolean;
      };
    }
  }
}
