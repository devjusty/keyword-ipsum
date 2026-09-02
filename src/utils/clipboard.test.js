import { describe, expect, it } from "vitest";
import { hasClipboardSupport } from "./clipboard";

describe("hasClipboardSupport", () => {
  it("reports whether clipboard write access is available", () => {
    expect(
      hasClipboardSupport({
        clipboard: { writeText: () => Promise.resolve() },
      }),
    ).toBe(true);
    expect(hasClipboardSupport({})).toBe(false);
  });
});
