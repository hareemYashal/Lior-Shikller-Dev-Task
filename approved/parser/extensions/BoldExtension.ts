import { MarkdownExtension } from "../MarkdownParser";
import MarkdownIt from "markdown-it";

/**
 * Bold text extension for markdown parsing
 *
 * This extension handles **bold** and __bold__ markdown syntax.
 * We're using markdown-it's built-in strong rule since it already
 * handles this correctly - no need to reinvent the wheel here.
 */
export const BoldExtension: MarkdownExtension = {
  name: "bold",
  setup(md: MarkdownIt) {},
  // Optionally, we can add postProcess if needed for Tiptap conversion
};
