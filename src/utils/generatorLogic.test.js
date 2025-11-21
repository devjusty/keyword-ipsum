import { describe, expect, it } from "vitest";
import { generateIpsum } from "./generatorLogic";

describe("generateIpsum", () => {
  it("capitalizes the first word from a single token", () => {
    const keywords = ["first", "second"];
    const result = generateIpsum(keywords, 1, "sentences", {
      startWithLorem: false,
      keywordProbability: 1,
    });

    const firstWord = result.split(" ")[0];
    expect(keywords).toContain(firstWord.toLowerCase());
  });

  it("does not add extra words when startWithLorem is enabled for sentences", () => {
    const options = { startWithLorem: false, keywordProbability: 0 };
    const sentenceWithoutLorem = generateIpsum(
      ["seed"],
      1,
      "sentences",
      options,
    );

    const sentenceWithLorem = generateIpsum(["seed"], 1, "sentences", {
      ...options,
      startWithLorem: true,
    });

    const wordCountWithoutLorem = sentenceWithoutLorem
      .replace(".", "")
      .split(" ").length;
    const wordCountWithLorem = sentenceWithLorem
      .replace(".", "")
      .split(" ").length;

    expect(sentenceWithLorem.startsWith("Lorem")).toBe(true);
    expect(wordCountWithLorem).toBe(wordCountWithoutLorem);
  });

  it("ignores the startWithLorem option for word units", () => {
    const length = 5;
    const keywords = ["alpha", "beta"];
    const wordsWithoutLorem = generateIpsum(keywords, length, "words", {
      startWithLorem: false,
      keywordProbability: 1,
    });
    const wordsWithLorem = generateIpsum(keywords, length, "words", {
      startWithLorem: true,
      keywordProbability: 1,
    });

    expect(wordsWithLorem.split(" ")).toHaveLength(length);
    expect(wordsWithLorem).toBe(wordsWithoutLorem);
  });

  it("replaces only the first paragraph start when startWithLorem is enabled", () => {
    const options = { startWithLorem: true, keywordProbability: 0 };
    const paragraphs = generateIpsum(["seed"], 2, "paragraphs", options).split(
      "\n\n",
    );

    expect(paragraphs).toHaveLength(2);
    expect(paragraphs[0].startsWith("Lorem")).toBe(true);
    expect(paragraphs[1].startsWith("Lorem")).toBe(false);
  });

  it("produces repeatable output for the same keywords", () => {
    const options = { startWithLorem: false, keywordProbability: 0.4 };
    const firstRun = generateIpsum(["apple", "banana"], 10, "words", options);
    const secondRun = generateIpsum(["apple", "banana"], 10, "words", options);

    expect(firstRun).toBe(secondRun);
  });

  it("changes the output when keywords differ", () => {
    const options = { startWithLorem: false, keywordProbability: 0.4 };
    const appleIpsum = generateIpsum(["apple", "banana"], 50, "words", options);
    const apricotIpsum = generateIpsum(
      ["apricot", "banana"],
      50,
      "words",
      options,
    );

    expect(appleIpsum).not.toBe(apricotIpsum);
  });
});
