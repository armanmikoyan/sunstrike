import type { FC } from "react";
import type { VioletOrbProps } from "./types";

/**
 * `violet-orb` is a custom element registered by `/brand/violet-orb.js`. The
 * cast keeps the runtime tag a string while letting JSX type its attributes;
 * no global JSX augmentation is needed.
 */
export const VIOLET_ORB = "violet-orb" as unknown as FC<VioletOrbProps>;

/** One lockup drives the rail, the footer and the login hero. */
export const LOCKUP_SRC = "/brand/chronolab-logo.svg";
export const LOCKUP_WIDTH = 1758;
export const LOCKUP_HEIGHT = 301;

/** A 128px orb that holds the nav slot before the live element takes over. */
export const MARK_POSTER_SRC = "/brand/chronolab-orb-128.png";
export const MARK_POSTER_SIZE = 128;

/** Graphite social card, shared by metadata and the login hero. */
export const SOCIAL_SRC = "/images/social.png";

export const BRAND_COPY = {
  home: "Chronolab.ai home",
};
