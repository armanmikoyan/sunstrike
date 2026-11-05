export type VioletOrbProps = {
  className?: string;
  duration?: string;
};

export type ChronosphereProps = {
  className?: string;
  /** Seconds per revolution. */
  duration?: number;
};

export type LogoLockupProps = {
  className?: string;
  href?: string;
  compact?: boolean;
  /** Kept in the layout for a reveal transition but out of reach. */
  inactive?: boolean;
};
