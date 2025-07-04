import {
  MarkdownToken,
  TiptapMark,
  TiptapNode,
  ParserError,
  ParserResult,
} from "@/types";
import MarkdownIt from "markdown-it";
import { validateMarkdownInput, validateTiptapNode } from "./utils/validation";
import { ParserConfig, defaultParserConfig } from "./utils/config";

export interface MarkdownExtension {
  name: string;
  setup(md: MarkdownIt): void;
  postProcess?(tokens: MarkdownToken[]): MarkdownToken[];
}

function cleanEmptyTextNodes(node: TiptapNode): TiptapNode {
  if (Array.isArray(node.content)) {
    node.content = node.content
      .map(cleanEmptyTextNodes)
      .filter((n: TiptapNode) => !(n.type === "text" && n.text === ""));
  }
  return node;
}

function tokensToTiptapJSON(tokens: MarkdownToken[]): TiptapNode {
  const stack: TiptapNode[] = [];
  const current: TiptapNode = { type: "doc", content: [] };

  function pushNode(node: TiptapNode) {
    if (stack.length > 0) {
      const parent = stack[stack.length - 1];
      if (!parent.content) parent.content = [];
      parent.content.push(node);
    } else {
      if (!current.content) current.content = [];
      current.content.push(node);
    }
  }

  let i = 0;
  while (i < tokens.length) {
    const token = tokens[i];
    switch (token.type) {
      case "heading_open": {
        let level = 1;
        if (token.tag && token.tag.startsWith("h")) {
          const parsed = parseInt(token.tag.slice(1), 10);
          if (!isNaN(parsed)) {
            level = Math.max(1, Math.min(parsed, 6));
          }
        }
        const node = { type: "heading", attrs: { level }, content: [] };
        stack.push(node);
        i++;
        break;
      }
      case "heading_close": {
        const node = stack.pop();
        if (node) pushNode(node);
        i++;
        break;
      }
      case "paragraph_open": {
        const node = { type: "paragraph", content: [] };
        stack.push(node);
        i++;
        break;
      }
      case "paragraph_close": {
        const node = stack.pop();
        if (node) pushNode(node);
        i++;
        break;
      }
      case "inline": {
        const children = tokensToTiptapJSON(token.children || []);
        if (stack.length > 0) {
          const parent = stack[stack.length - 1];
          if (!parent.content) parent.content = [];
          if (children.content) {
            parent.content.push(...children.content);
          }
        } else {
          if (!current.content) current.content = [];
          if (children.content) {
            current.content.push(...children.content);
          }
        }
        i++;
        break;
      }
      case "text": {
        const node = { type: "text", text: token.content };
        if (stack.length > 0) {
          const parent = stack[stack.length - 1];
          if (!parent.content) parent.content = [];
          parent.content.push(node);
        } else {
          if (!current.content) current.content = [];
          current.content.push(node);
        }
        i++;
        break;
      }
      case "strong_open":
        stack.push({
          type: "strongMark",
          marks: [],
          content: [],
        } as TiptapNode);
        i++;
        break;
      case "strong_close": {
        const node = stack.pop();
        if (node) {
          const mark: TiptapMark = { type: "bold" };
          const marked = (node.content || []).map((n: TiptapNode) =>
            n.type === "text" ? { ...n, marks: [...(n.marks || []), mark] } : n
          );
          if (stack.length > 0) {
            const parent = stack[stack.length - 1];
            parent.content = [...(parent.content || []), ...marked];
          } else {
            current.content?.push(...marked);
          }
        }
        i++;
        break;
      }
      case "em_open":
        stack.push({ type: "emMark", marks: [], content: [] } as TiptapNode);
        i++;
        break;
      case "em_close": {
        const node = stack.pop();
        if (node) {
          const mark: TiptapMark = { type: "italic" };
          const marked = (node.content || []).map((n: TiptapNode) =>
            n.type === "text" ? { ...n, marks: [...(n.marks || []), mark] } : n
          );
          if (stack.length > 0) {
            const parent = stack[stack.length - 1];
            parent.content = [...(parent.content || []), ...marked];
          } else {
            current.content?.push(...marked);
          }
        }
        i++;
        break;
      }
      case "code_inline": {
        const node = {
          type: "text",
          marks: [{ type: "code" }],
          text: token.content,
        };
        pushNode(node);
        i++;
        break;
      }
      case "blockquote_open": {
        const node = { type: "blockquote", content: [] };
        stack.push(node);
        i++;
        break;
      }
      case "blockquote_close": {
        const node = stack.pop();
        if (node) pushNode(node);
        i++;
        break;
      }
      case "bullet_list_open": {
        const node = { type: "bulletList", content: [] };
        stack.push(node);
        i++;
        break;
      }
      case "bullet_list_close": {
        const node = stack.pop();
        if (node) pushNode(node);
        i++;
        break;
      }
      case "ordered_list_open": {
        const node = { type: "orderedList", content: [] };
        stack.push(node);
        i++;
        break;
      }
      case "ordered_list_close": {
        const node = stack.pop();
        if (node) pushNode(node);
        i++;
        break;
      }
      case "list_item_open": {
        const node = { type: "listItem", content: [] };
        stack.push(node);
        i++;
        break;
      }
      case "list_item_close": {
        const node = stack.pop();
        if (node) pushNode(node);
        i++;
        break;
      }
      case "fence": {
        const node = {
          type: "codeBlock",
          attrs: { language: token.info || null },
          content: [{ type: "text", text: token.content }],
        };
        pushNode(node);
        i++;
        break;
      }
      case "link_open": {
        const href =
          token.attrs?.find((a: [string, string]) => a[0] === "href")?.[1] ||
          "";
        const node: TiptapNode = {
          type: "text",
          marks: [{ type: "link", attrs: { href } }],
          text: "",
        };
        stack.push(node);
        i++;
        break;
      }
      case "link_close": {
        const node = stack.pop();
        if (node && node.text === "" && node.content) {
          node.text = node.content
            .map((n: TiptapNode) => n.text || "")
            .join("");
          delete node.content;
        }
        if (node) pushNode(node);
        i++;
        break;
      }
      case "s_open": {
        const node: TiptapNode = {
          type: "text",
          marks: [{ type: "strike" }],
          text: "",
        };
        stack.push(node);
        i++;
        break;
      }
      case "s_close": {
        const node = stack.pop();
        if (node && node.text === "" && node.content) {
          node.text = node.content
            .map((n: TiptapNode) => n.text || "")
            .join("");
          delete node.content;
        }
        if (node) pushNode(node);
        i++;
        break;
      }
      case "table_open":
        stack.push({ type: "table", content: [] });
        i++;
        break;
      case "table_close": {
        const node = stack.pop();
        if (node) pushNode(node);
        i++;
        break;
      }
      case "thead_open":
      case "tbody_open":
        i++;
        break;
      case "thead_close":
      case "tbody_close":
        i++;
        break;
      case "tr_open":
        stack.push({ type: "tableRow", content: [] });
        i++;
        break;
      case "tr_close": {
        const node = stack.pop();
        if (node) pushNode(node);
        i++;
        break;
      }
      case "th_open":
        stack.push({ type: "tableHeader", content: [] });
        i++;
        break;
      case "th_close": {
        const node = stack.pop();
        if (node) pushNode(node);
        i++;
        break;
      }
      case "td_open":
        stack.push({ type: "tableCell", content: [] });
        i++;
        break;
      case "td_close": {
        const node = stack.pop();
        if (node) pushNode(node);
        i++;
        break;
      }
      case "task_list_open": {
        const node = { type: "taskList", content: [] };
        stack.push(node);
        i++;
        break;
      }
      case "task_list_close": {
        const node = stack.pop();
        if (node) pushNode(node);
        i++;
        break;
      }
      case "task_list_item_open": {
        const checked = token.attrs
          ? token.attrs.find(
              (attr: [string, string]) => attr[0] === "data-checked"
            )?.[1] === "true"
          : false;
        const node = { type: "taskItem", attrs: { checked }, content: [] };
        stack.push(node);
        i++;
        break;
      }
      case "task_list_item_close": {
        const node = stack.pop();
        if (node) pushNode(node);
        i++;
        break;
      }
      default: {
        i++;
        break;
      }
    }
  }
  return cleanEmptyTextNodes(current);
}

export class MarkdownParser {
  private md: MarkdownIt;
  private extensions: MarkdownExtension[] = [];
  private config: ParserConfig = defaultParserConfig;

  constructor(config?: Partial<ParserConfig>) {
    this.md = new MarkdownIt();
    if (config) {
      this.config = { ...this.config, ...config };
    }
  }

  registerExtension(extension: MarkdownExtension) {
    try {
      this.extensions.push(extension);
      extension.setup(this.md);
    } catch (error) {
      if (this.config.throwOnError) {
        throw new Error(
          `Failed to register extension ${extension.name}: ${
            error instanceof Error ? error.message : String(error)
          }`
        );
      }
      // Log the error but continue
      console.error(`Failed to register extension ${extension.name}:`, error);
    }
  }

  /**
   * Parse markdown string into Tiptap JSON with enhanced error handling
   * @param markdown The markdown string to parse
   * @returns ParserResult containing the document and any errors/warnings
   */
  parse(markdown: string): ParserResult {
    const result: ParserResult = {
      document: { type: "doc", content: [] },
      errors: [],
      warnings: [],
      stats: {
        parseTime: 0,
        tokenCount: 0,
      },
    };

    // Start timing
    const startTime = performance.now();

    // Validate input
    const inputErrors = validateMarkdownInput(markdown);
    if (inputErrors.length > 0) {
      result.errors.push(...inputErrors);

      // If we have critical errors and throwOnError is true, throw the first error
      if (
        this.config.throwOnError &&
        inputErrors.some((e) => this.config.criticalErrorCodes.includes(e.code))
      ) {
        const criticalError = inputErrors.find((e) =>
          this.config.criticalErrorCodes.includes(e.code)
        );
        throw new Error(`Markdown parsing failed: ${criticalError?.message}`);
      }

      // If we have errors but should continue, return empty document with errors
      if (
        result.errors.some((e) =>
          this.config.criticalErrorCodes.includes(e.code)
        )
      ) {
        return result;
      }
    }

    try {
      // Parse markdown to tokens
      let tokens = this.md.parse(markdown, {}) as MarkdownToken[];
      result.stats.tokenCount = tokens.length;

      // Process tokens through extensions
      for (const ext of this.extensions) {
        try {
          if (ext.postProcess) {
            tokens = ext.postProcess(tokens);
          }
        } catch (error) {
          const extensionError: ParserError = {
            code: "EXTENSION_ERROR",
            message: `Extension '${ext.name}' failed during post-processing: ${
              error instanceof Error ? error.message : String(error)
            }`,
            extensionName: ext.name,
            details: error,
          };

          result.errors.push(extensionError);

          if (this.config.throwOnError) {
            throw new Error(extensionError.message);
          }
        }
      }

      // Convert tokens to Tiptap JSON
      const document = tokensToTiptapJSON(tokens);

      // Validate output
      if (this.config.validateOutput) {
        const outputErrors = validateTiptapNode(document);
        if (outputErrors.length > 0) {
          result.warnings.push(...outputErrors);
        }
      }

      result.document = document;
    } catch (error) {
      result.errors.push({
        code: "CONVERSION_ERROR",
        message: `Failed to convert markdown to Tiptap JSON: ${
          error instanceof Error ? error.message : String(error)
        }`,
        details: error,
      });

      if (this.config.throwOnError) {
        throw error;
      }
    } finally {
      result.stats.parseTime = performance.now() - startTime;
    }

    return result;
  }

  /**
   * Get a simplified document without error handling (for backward compatibility)
   * @param markdown The markdown string to parse
   * @returns TiptapNode document
   * @deprecated Use parse() instead which provides error handling
   */
  parseSimple(markdown: string): TiptapNode {
    return this.parse(markdown).document;
  }
}
