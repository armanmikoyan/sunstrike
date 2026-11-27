import { MegaMenuFeatures } from "./mega-menu-features";
import { MegaMenuFooter } from "./mega-menu-footer";
import { MegaMenuIntro } from "./mega-menu-intro";
import { MegaMenuPreviews } from "./mega-menu-previews";
import type { MegaMenuPanelProps } from "./types";

export function MegaMenuPanel({ menu, onClose, left, width }: MegaMenuPanelProps) {
  return (
    <div className="absolute top-11 z-50" style={{ left, width }}>
      <div className="glass-menu mega-menu-panel overflow-hidden rounded-b-2xl border-x border-b border-white/10">
        <div className="grid lg:grid-cols-[15.625rem_1fr_18.75rem]">
          <MegaMenuIntro menu={menu} onClose={onClose} />
          <MegaMenuFeatures features={menu.features} onClose={onClose} />
          <MegaMenuPreviews previews={menu.previews} onClose={onClose} />
        </div>
        <MegaMenuFooter onClose={onClose} />
      </div>
    </div>
  );
}
