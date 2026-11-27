export type MosaicTileProps = {
  id: string;
  label: string;
  span: string;
  showCost?: boolean;
  /** Small tile: stream the lighter wall encode, which the hero has cached. */
  compact?: boolean;
};
