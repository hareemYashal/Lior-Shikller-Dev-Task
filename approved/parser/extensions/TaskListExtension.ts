import { MarkdownTaskListToken } from "@/types";
import { MarkdownExtension } from "../MarkdownParser";
import MarkdownIt from "markdown-it";
import markdownItTaskLists from "markdown-it-task-lists";

/**
 * Task list extension for markdown parsing
 *
 * This extension adds support for task lists (e.g., - [ ] Task, - [x] Done)
 * using markdown-it-task-lists.
 */
export const TaskListExtension: MarkdownExtension = {
  name: "task_list",
  setup(md: MarkdownIt) {
    md.use(markdownItTaskLists, {
      enabled: true,
      label: false,
      labelAfter: false,
    });
  },
  //Here we have added the postProcess function to convert the task list tokens to Tiptap tokens
  postProcess(tokens: MarkdownTaskListToken[]): MarkdownTaskListToken[] {
    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];

      if (
        token.type === "bullet_list_open" &&
        token.attrGet &&
        token.attrGet("class")?.includes("contains-task-list")
      ) {
        token.type = "task_list_open";
        token.tag = "ul";
      } else if (
        token.type === "bullet_list_close" &&
        token.tag === "ul" &&
        i > 0 &&
        tokens[i - 1].type === "task_list_item_close"
      ) {
        token.type = "task_list_close";
      } else if (
        token.type === "list_item_open" &&
        token.attrs &&
        token.attrs.find(
          (attr: [string, string]) =>
            attr[0] === "class" && attr[1]?.includes("task-list-item")
        )
      ) {
        token.type = "task_list_item_open";

        let isChecked = false;

        for (
          let j = i + 1;
          j < tokens.length && tokens[j].type !== "list_item_close";
          j++
        ) {
          if (tokens[j].type === "inline") {
            const children = tokens[j].children;

            if (children) {
              for (const child of children) {
                if (child.type === "html_inline") {
                  const content = child.content;
                  if (
                    content &&
                    content.includes('type="checkbox"') &&
                    content.includes("checked")
                  ) {
                    isChecked = true;
                    break;
                  }
                }
              }
            }
          }
        }
        if (!token.attrs) token.attrs = [];

        token.attrs = token.attrs.filter((attr) => attr[0] !== "data-checked");
        token.attrs.push(["data-checked", isChecked ? "true" : "false"]);
      } else if (
        token.type === "list_item_close" &&
        i > 0 &&
        tokens[i - 1].type &&
        tokens[i - 1].type.startsWith("task_list_item")
      ) {
        token.type = "task_list_item_close";
      }
    }

    return tokens;
  },
};
