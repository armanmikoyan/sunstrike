/** Grid placement per tile, tuned so the mosaic keeps its rhythm on desktop. */
export const mosaicTiles = [
  {
    id: "09",
    label: "9:16",
    span: "col-span-2 row-span-2 md:col-span-5 md:row-span-2",
  },
  { id: "02", label: "9:16", span: "md:col-span-4" },
  { id: "05", label: "3:4", span: "md:col-span-3" },
  { id: "04", label: "9:16", span: "md:col-span-3" },
  { id: "07", label: "9:16", span: "md:col-span-4" },
  { id: "11", label: "9:16", span: "md:col-span-5" },
  { id: "16", label: "1:1", span: "md:col-span-4" },
  { id: "17", label: "3:4", span: "hidden md:block md:col-span-3" },
];

export const mosaicCopy = {
  titleBefore: "Every frame finds its ",
  titleAccent: "shape",
  description:
    "Stills and motion across every ratio, without rebuilding the shot.",
  count: `${mosaicTiles.length} frames`,
  action: "Explore more",
};
