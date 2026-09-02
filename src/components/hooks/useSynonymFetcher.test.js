import { describe, expect, it } from "vitest";
import { z } from "zod";
import { getRequestWaitTime } from "./useSynonymFetcher";

it("configures Zod without eval for strict CSP", () => {
  expect(z.config().jitless).toBe(true);
});

describe("getRequestWaitTime", () => {
  it("returns remaining interval before next request", () => {
    expect(getRequestWaitTime(950, 900, 100)).toBe(50);
    expect(getRequestWaitTime(1000, 900, 100)).toBe(0);
    expect(getRequestWaitTime(1100, 900, 100)).toBe(0);
  });
});
