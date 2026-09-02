import { describe, expect, it } from "vitest";
import { getRequestWaitTime } from "./useSynonymFetcher";

describe("getRequestWaitTime", () => {
  it("returns remaining interval before next request", () => {
    expect(getRequestWaitTime(950, 900, 100)).toBe(50);
    expect(getRequestWaitTime(1000, 900, 100)).toBe(0);
    expect(getRequestWaitTime(1100, 900, 100)).toBe(0);
  });
});
