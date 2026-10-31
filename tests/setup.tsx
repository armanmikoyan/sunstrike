import "@testing-library/jest-dom/vitest";
import React from "react";
import { afterEach, beforeEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";
import { resetNavigation } from "./mocks/navigation";

/* -------------------------------------------------------------------------- */
/*  Browser APIs jsdom does not implement                                     */
/* -------------------------------------------------------------------------- */

if (!window.matchMedia) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }),
  });
}

class MockObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}

Object.defineProperty(window, "ResizeObserver", {
  writable: true,
  value: MockObserver,
});
Object.defineProperty(window, "IntersectionObserver", {
  writable: true,
  value: MockObserver,
});

if (!Element.prototype.animate) {
  Element.prototype.animate = function animate() {
    return {
      cancel: vi.fn(),
      finish: vi.fn(),
      play: vi.fn(),
      pause: vi.fn(),
      reverse: vi.fn(),
      commitStyles: vi.fn(),
      finished: Promise.resolve(),
      onfinish: null,
      cancelAnimationFrame: vi.fn(),
    } as unknown as Animation;
  } as unknown as Element["animate"];
}

if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = vi.fn();
}

if (!Element.prototype.hasPointerCapture) {
  Element.prototype.hasPointerCapture = vi.fn(() => false);
}
if (!Element.prototype.setPointerCapture) {
  Element.prototype.setPointerCapture = vi.fn();
}
if (!Element.prototype.releasePointerCapture) {
  Element.prototype.releasePointerCapture = vi.fn();
}

/* -------------------------------------------------------------------------- */
/*  Next.js framework mocks                                                   */
/* -------------------------------------------------------------------------- */

vi.mock("next/navigation", async () => {
  const { routerMock, navigationState } = await import("./mocks/navigation");
  return {
    useRouter: () => routerMock,
    usePathname: () => navigationState.pathname,
    useSearchParams: () => navigationState.searchParams,
    useParams: () => navigationState.params,
    useSelectedLayoutSegment: () => null,
    useSelectedLayoutSegments: () => [],
    notFound: () => {
      throw new Error("NEXT_NOT_FOUND");
    },
    redirect: vi.fn(),
  };
});

vi.mock("next/link", async () => {
  const ReactModule = await import("react");
  const Link = ReactModule.forwardRef(function LinkMock(
    {
      href,
      children,
      prefetch: _prefetch,
      replace: _replace,
      scroll: _scroll,
      shallow: _shallow,
      passHref: _passHref,
      legacyBehavior: _legacyBehavior,
      locale: _locale,
      ...rest
    }: Record<string, unknown> & { href?: unknown; children?: React.ReactNode },
    ref: React.Ref<HTMLAnchorElement>,
  ) {
    const url =
      typeof href === "string"
        ? href
        : ((href as { pathname?: string } | undefined)?.pathname ?? "#");

    return ReactModule.createElement(
      "a",
      { ...(rest as object), ref, href: url },
      children,
    );
  });

  return { __esModule: true, default: Link };
});

vi.mock("next/image", async () => {
  const ReactModule = await import("react");
  const Image = ReactModule.forwardRef(function ImageMock(
    {
      src,
      alt,
      fill: _fill,
      priority: _priority,
      quality: _quality,
      loader: _loader,
      placeholder: _placeholder,
      blurDataURL: _blurDataURL,
      unoptimized: _unoptimized,
      ...rest
    }: Record<string, unknown> & { src?: unknown; alt?: string },
    ref: React.Ref<HTMLImageElement>,
  ) {
    const resolved =
      typeof src === "string"
        ? src
        : ((src as { src?: string } | undefined)?.src ?? "");

    return ReactModule.createElement("img", {
      ...(rest as object),
      ref,
      src: resolved,
      alt: alt ?? "",
    });
  });

  return { __esModule: true, default: Image };
});

vi.mock("motion/react", async () => {
  const ReactModule = await import("react");

  const passthrough = (tag: string) =>
    ReactModule.forwardRef(function MotionMock(
      props: Record<string, unknown>,
      ref: React.Ref<HTMLElement>,
    ) {
      const {
        initial: _initial,
        animate: _animate,
        exit: _exit,
        transition: _transition,
        variants: _variants,
        layout: _layout,
        layoutId: _layoutId,
        whileHover: _whileHover,
        whileTap: _whileTap,
        whileInView: _whileInView,
        viewport: _viewport,
        drag: _drag,
        ...rest
      } = props;

      return ReactModule.createElement(tag, { ...rest, ref });
    });

  const motion = new Proxy(
    {},
    {
      get: (_target, tag: string) => passthrough(tag),
    },
  );

  const AnimatePresence = ({ children }: { children?: React.ReactNode }) =>
    ReactModule.createElement(ReactModule.Fragment, null, children);

  return { motion, AnimatePresence, LayoutGroup: ({ children }: { children?: React.ReactNode }) => ReactModule.createElement(ReactModule.Fragment, null, children) };
});

/* -------------------------------------------------------------------------- */
/*  Lifecycle                                                                 */
/* -------------------------------------------------------------------------- */

beforeEach(() => {
  resetNavigation();
});

afterEach(() => {
  cleanup();
  vi.clearAllTimers();
});
