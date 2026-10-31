import { vi } from "vitest";

export const routerMock = {
  push: vi.fn(),
  replace: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
  refresh: vi.fn(),
  prefetch: vi.fn(),
};

export const navigationState = {
  pathname: "/",
  searchParams: new URLSearchParams(),
  params: {} as Record<string, string>,
};

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
}
