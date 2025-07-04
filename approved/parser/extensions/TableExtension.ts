import { MarkdownExtension } from "../MarkdownParser";
import MarkdownIt from "markdown-it";

/**
 * Table extension for markdown parsing
 *
 * This extension enables support for tables using markdown-it's table plugin.
 * Since it already handles this correctly - no need to reinvent the wheel here.
 */
export const TableExtension: MarkdownExtension = {
  name: "table",
  setup(md: MarkdownIt) {},
  // Optionally, we can add postProcess if needed for Tiptap conversion
};
