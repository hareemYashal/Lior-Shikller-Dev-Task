import { MarkdownExtension } from "../MarkdownParser";
import MarkdownIt from "markdown-it";

/**
 * Heading extension for markdown parsing
 *
 * This extension handles Markdown headings (#, ##, ###, etc.) using markdown-it's default rules.
 * Since it already handles this correctly - no need to reinvent the wheel here.
 */
export const HeadingExtension: MarkdownExtension = {
  name: "heading",
  setup(md: MarkdownIt) {},
  // Optionally,we can add postProcess if needed for Tiptap conversion
};
