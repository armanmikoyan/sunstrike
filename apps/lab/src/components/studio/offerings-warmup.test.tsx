import { act, render } from "@testing-library/react";
import { Provider, createStore } from "jotai";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { offeringsResponse } from "@/mocks/offerings";
import { OfferingsWarmup } from "./offerings-warmup";
import { resetOfferingsCache } from "./hooks";
import { offeringsAtom } from "./state";

const json = (body: unknown) => Promise.resolve(new Response(JSON.stringify(body), { status: 200 }));

describe("offerings warmup", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    resetOfferingsCache();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("fetches the catalog while idle and seeds the shared atom", async () => {
    const fetchMock = vi.fn(() => json(offeringsResponse));
    vi.stubGlobal("fetch", fetchMock);
    const store = createStore();

    render(
      <Provider store={store}>
        <OfferingsWarmup />
      </Provider>,
    );

    expect(fetchMock).not.toHaveBeenCalled();
    expect(store.get(offeringsAtom).status).toBe("loading");

    await act(async () => {
      await vi.runAllTimersAsync();
    });

    expect(fetchMock).toHaveBeenCalledWith("/api/offerings", { cache: "no-store" });
    expect(store.get(offeringsAtom).status).toBe("ready");
  });

  it("keeps failures out of the session cache", async () => {
    const fetchMock = vi.fn(() => Promise.resolve(new Response("nope", { status: 500 })));
    vi.stubGlobal("fetch", fetchMock);
    const store = createStore();

    render(
      <Provider store={store}>
        <OfferingsWarmup />
      </Provider>,
    );

    await act(async () => {
      await vi.runAllTimersAsync();
    });

    expect(store.get(offeringsAtom).status).toBe("loading");

    render(
      <Provider store={store}>
        <OfferingsWarmup />
      </Provider>,
    );
    await act(async () => {
      await vi.runAllTimersAsync();
    });

    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
