const hasClipboardSupport = (browserNavigator) =>
  typeof browserNavigator?.clipboard?.writeText === "function";

export { hasClipboardSupport };
