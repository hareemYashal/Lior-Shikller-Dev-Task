import { MarkdownExtension } from "../MarkdownParser";
import MarkdownIt from "markdown-it";

/**
 * Link extension for markdown parsing
 *
 * This extension handles [text](url) Markdown links using markdown-it’s default link rule.
 * Since it already handles this correctly - no need to reinvent the wheel here.
 */
export const LinkExtension: MarkdownExtension = {
  name: "link",
  setup(md: MarkdownIt) {},
  // Optionally, we can add postProcess if needed for Tiptap conversion
};
