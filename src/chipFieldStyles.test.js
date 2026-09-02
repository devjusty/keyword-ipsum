import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const stylesheet = readFileSync(new URL("index.css", import.meta.url), "utf8");

describe("chip field sizing", () => {
  it("allows the field to grow when chips wrap", () => {
    expect(stylesheet).toMatch(
      /\.chip-field__control\s*\{[^}]*height:\s*auto;/s,
    );
  });
});
