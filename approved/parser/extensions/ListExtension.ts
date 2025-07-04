import { MarkdownExtension } from "../MarkdownParser";
import MarkdownIt from "markdown-it";

/**
 * List extension for markdown parsing
 *
 * This extension handles ordered and unordered lists (- item , 1. item) using markdown-it’s default rules.
 * Since it already handles this correctly - no need to reinvent the wheel here.
 */
export const ListExtension: MarkdownExtension = {
  name: "list",
  setup(md: MarkdownIt) {},
  // Optionally, we can add postProcess if needed for Tiptap conversion
};
