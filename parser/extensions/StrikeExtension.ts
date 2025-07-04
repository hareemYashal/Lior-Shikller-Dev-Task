import { MarkdownExtension } from "../MarkdownParser";
import MarkdownIt from "markdown-it";

/**
 * Strike extension for markdown parsing
 *
 * This extension handles strikethrough text (~~strikethrough~~) using markdown-it's default rule syntax.
 */
export const StrikeExtension: MarkdownExtension = {
  name: "strike",
  setup(md: MarkdownIt) {
    md.enable("strikethrough"); // Ensure strikethrough is enabled
  },
  // Optionally, we can add postProcess if needed for Tiptap conversion
};
