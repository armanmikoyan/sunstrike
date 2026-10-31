import { describe, expect, it } from "vitest";
import { cn } from "@/lib/utils";

describe("cn", () => {
  it("joins class names", () => {
    expect(cn("a", "b")).toBe("a b");
  });

  it("drops falsy values", () => {
    expect(cn("a", false, null, undefined, "", "b")).toBe("a b");
  });

  it("resolves tailwind conflicts to the last value", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
    expect(cn("text-sm", "text-lg", "text-xs")).toBe("text-xs");
  });

  it("keeps conditional variants", () => {
    expect(cn("rounded-lg", true && "bg-brand", false && "hidden")).toBe(
      "rounded-lg bg-brand",
    );
  });
});
