import { MarkdownExtension } from "../MarkdownParser";
import MarkdownIt from "markdown-it";

/**
 * Code block extension for markdown parsing
 *
 * This extension handles fenced code blocks (```) using markdown-it's default rules.
 * Since it already handles this correctly - no need to reinvent the wheel here.
 */
export const CodeBlockExtension: MarkdownExtension = {
  name: "code_block",
  setup(md: MarkdownIt) {},
  // Optionally, we can add postProcess if needed for Tiptap conversion
};
