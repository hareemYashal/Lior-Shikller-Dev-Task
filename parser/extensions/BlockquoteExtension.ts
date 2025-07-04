import { MarkdownExtension } from "../MarkdownParser";
import MarkdownIt from "markdown-it";

/**
 * Blockquote extension for markdown parsing
 *
 * This extension handles blockquote syntax using markdown-it's default implementation,
 * which supports lines starting with `>` and nested blockquotes. Since it already
 * handles this correctly - no need to reinvent the wheel here.
 */
export const BlockquoteExtension: MarkdownExtension = {
  name: "blockquote",
  setup(md: MarkdownIt) {},
  // Optionally, we can add postProcess if needed for Tiptap conversion
};
