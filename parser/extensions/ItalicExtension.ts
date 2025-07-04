import { MarkdownExtension } from "../MarkdownParser";
import MarkdownIt from "markdown-it";

/**
 * Italic extension for markdown parsing
 *
 * This extension handles *italic* text using markdown-it's default emphasis rules.
 * Since it already handles this correctly - no need to reinvent the wheel here.
 */
export const ItalicExtension: MarkdownExtension = {
  name: "italic",
  setup(md: MarkdownIt) {},
  // Optionally, we can add postProcess if needed for Tiptap conversion
};
