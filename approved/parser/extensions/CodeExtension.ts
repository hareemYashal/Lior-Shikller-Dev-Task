import { MarkdownExtension } from "../MarkdownParser";

/**
 * Inline code extension for markdown parsing
 *
 * This extension handles inline code wrapped in backticks (`code`) using markdown-it's built-in rule.
 * Since it already handles this correctly - no need to reinvent the wheel here.
 */
export const CodeExtension: MarkdownExtension = {
  name: "code",
  setup() {},
  // Optionally, we can add postProcess if needed for Tiptap conversion
};
