const shouldCommitChip = (key, inputValue) =>
  Boolean(inputValue.trim()) && ["Enter", ",", "Tab"].includes(key);

export { shouldCommitChip };
