import "@testing-library/jest-dom/vitest";
import React, { type ReactNode } from "react";
import { afterEach, beforeEach, vi } from "vitest";
import { cleanup, render } from "@testing-library/react";
import { Provider } from "jotai";
import { TooltipProvider } from "@/ui/tooltip";
import { offeringsResponse, quoteResponse } from "@/mocks/offerings";

type WithChildrenProps = {
  children?: React.ReactNode;
};

type MockLinkProps = Record<string, unknown> & WithChildrenProps;

/* -------------------------------------------------------------------------- */
/*  Router state shared with tests                                            */
/* -------------------------------------------------------------------------- */

const navigation = vi.hoisted(() => ({
  routerMock: {
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  },
  state: {
    pathname: "/",
    searchParams: new URLSearchParams(),
    params: {} as Record<string, string>,
  },
}));

export const routerMock = navigation.routerMock;
export const navigationState = navigation.state;

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

const defaultFetch = async (input: RequestInfo | URL) => {
  const url = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;

  if (url === "/api/auth/session") return jsonResponse({ user: null });

  if (url === "/api/offerings") return jsonResponse(offeringsResponse);

  if (url.startsWith("/api/pricing/quote?")) {
    const quote = quoteResponse(url.slice(url.indexOf("?")));

    return quote ? jsonResponse(quote) : jsonResponse({ error: "Model not found." }, 404);
  }

  return new Response(null, { status: 204 });
};

export const fetchMock = vi.fn(defaultFetch);

vi.stubGlobal("fetch", fetchMock);

export function setPathname(pathname: string) {
  navigationState.pathname = pathname;
}

export function setSearchParams(search: string) {
  navigationState.searchParams = new URLSearchParams(search);
}

export function setParams(params: Record<string, string>) {
  navigationState.params = params;
}

export function resetNavigation() {
  navigationState.pathname = "/";
  navigationState.searchParams = new URLSearchParams();
  navigationState.params = {};
  routerMock.push.mockReset();
  routerMock.replace.mockReset();
  routerMock.prefetch.mockReset();
}

/** Renders a page with the providers the app shell normally supplies. */
export function renderWithProviders(ui: ReactNode) {
  return render(
    <Provider>
      <TooltipProvider>{ui}</TooltipProvider>
    </Provider>,
  );
}

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

vi.mock("next/navigation", () => ({
  useRouter: () => navigation.routerMock,
  usePathname: () => navigation.state.pathname,
  useSearchParams: () => navigation.state.searchParams,
  useParams: () => navigation.state.params,
  useSelectedLayoutSegment: () => null,
  useSelectedLayoutSegments: () => [],
  notFound: () => {
    throw new Error("NEXT_NOT_FOUND");
  },
  redirect: vi.fn(),
}));

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
    }: MockLinkProps,
    ref: React.Ref<HTMLAnchorElement>,
  ) {
    const url = typeof href === "string" ? href : ((href as { pathname?: string } | undefined)?.pathname ?? "#");

    return ReactModule.createElement("a", { ...(rest as object), ref, href: url }, children);
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
    const resolved = typeof src === "string" ? src : ((src as { src?: string } | undefined)?.src ?? "");

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

  // One component per tag: a fresh identity on every `motion.x` access would
  // remount the element on each render, dropping focus and local state.
  const passthroughs = new Map<string, React.ComponentType<Record<string, unknown>>>();

  const passthrough = (tag: string) => {
    const existing = passthroughs.get(tag);

    if (existing) return existing;

    const component = ReactModule.forwardRef(function MotionMock(
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

    passthroughs.set(tag, component);

    return component;
  };

  const motion = new Proxy(
    {},
    {
      get: (_target, tag: string) => passthrough(tag),
    },
  );

  const AnimatePresence = ({ children }: WithChildrenProps) =>
    ReactModule.createElement(ReactModule.Fragment, null, children);

  return {
    motion,
    AnimatePresence,
    LayoutGroup: ({ children }: WithChildrenProps) => ReactModule.createElement(ReactModule.Fragment, null, children),
    useReducedMotion: () => false,
  };
});

/* -------------------------------------------------------------------------- */
/*  Lifecycle                                                                 */
/* -------------------------------------------------------------------------- */

beforeEach(() => {
  resetNavigation();
  fetchMock.mockReset();
  fetchMock.mockImplementation(defaultFetch);
});

afterEach(() => {
  cleanup();
  vi.clearAllTimers();
});
