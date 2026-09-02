import { describe, expect, it } from "vitest";
import { shouldCommitChip } from "./chipInputLogic";

describe("shouldCommitChip", () => {
  it("does not commit a keyword when space is pressed", () => {
    expect(shouldCommitChip(" ", "user experience")).toBe(false);
  });

  it("commits non-empty keywords on supported delimiters", () => {
    expect(shouldCommitChip("Enter", "keyword")).toBe(true);
    expect(shouldCommitChip(",", "keyword")).toBe(true);
    expect(shouldCommitChip("Tab", "keyword")).toBe(true);
  });
});
