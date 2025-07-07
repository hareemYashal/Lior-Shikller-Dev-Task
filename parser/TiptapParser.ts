import { TiptapMark, TiptapNode } from "@/types";

export class TiptapToMarkdown {
  convert(doc: TiptapNode): string {
    if (doc.type !== "doc" || !doc.content) {
      return "";
    }

    return this.convertNodes(doc.content).trim();
  }

  private convertNodes(nodes: TiptapNode[]): string {
    return nodes.map((node) => this.convertNode(node)).join("");
  }

  private convertNode(node: TiptapNode): string {
    switch (node.type) {
      case "paragraph":
        return this.convertParagraph(node);
      case "heading":
        return this.convertHeading(node);
      case "text":
        return this.convertText(node);
      case "bulletList":
        return this.convertBulletList(node);
      case "orderedList":
        return this.convertOrderedList(node);
      case "listItem":
        return this.convertListItem(node);
      case "taskList":
        return this.convertTaskList(node);
      case "taskItem":
        return this.convertTaskItem(node);
      case "codeBlock":
        return this.convertCodeBlock(node);
      case "blockquote":
        return this.convertBlockquote(node);
      case "table":
        return this.convertTable(node);
      case "tableRow":
        return this.convertTableRow(node);
      case "tableCell":
      case "tableHeader":
        return this.convertTableCell(node);
      default:
        return node.content ? this.convertNodes(node.content) : "";
    }
  }

  private convertParagraph(node: TiptapNode): string {
    const content = node.content ? this.convertNodes(node.content) : "";
    return content + "\n\n";
  }

  private convertHeading(node: TiptapNode): string {
    const level = typeof node.attrs?.level === "number" ? node.attrs.level : 1;
    const prefix = "#".repeat(level);
    const content = node.content ? this.convertNodes(node.content) : "";
    return `${prefix} ${content}\n\n`;
  }

  private convertText(node: TiptapNode): string {
    if (!node.text) return "";

    let text = node.text;

    if (node.marks) {
      for (const mark of node.marks) {
        text = this.applyMark(text, mark);
      }
    }

    return text;
  }

  private applyMark(text: string, mark: TiptapMark): string {
    switch (mark.type) {
      case "bold":
        return `**${text}**`;
      case "italic":
        return `*${text}*`;
      case "code":
        return `\`${text}\``;
      case "strike":
        return `~~${text}~~`;
      case "link":
        const href = mark.attrs?.href || "";
        return `[${text}](${href})`;
      default:
        return text;
    }
  }

  private convertBulletList(node: TiptapNode): string {
    const items = node.content ? this.convertNodes(node.content) : "";
    return items + "\n";
  }

  private convertOrderedList(node: TiptapNode): string {
    if (!node.content) return "";

    return (
      node.content
        .map((item, index) => {
          const content = this.convertListItem(item, index + 1);
          return content;
        })
        .join("") + "\n"
    );
  }

  private convertListItem(node: TiptapNode, index?: number): string {
    const prefix = index ? `${index}. ` : "- ";
    const content = node.content ? this.convertNodes(node.content).trim() : "";
    return `${prefix}${content}\n`;
  }

  private convertTaskList(node: TiptapNode): string {
    const items = node.content ? this.convertNodes(node.content) : "";
    return items + "\n";
  }

  private convertTaskItem(node: TiptapNode): string {
    const checked = node.attrs?.checked ? "[x]" : "[ ]";
    const content = node.content ? this.convertNodes(node.content).trim() : "";
    return `- ${checked} ${content}\n`;
  }

  private convertCodeBlock(node: TiptapNode): string {
    const language = node.attrs?.language || "";
    const content = node.content ? this.convertNodes(node.content) : "";
    return `\`\`\`${language}\n${content}\`\`\`\n\n`;
  }

  private convertBlockquote(node: TiptapNode): string {
    if (!node.content) return "";

    const content = this.convertNodes(node.content);
    const lines = content.trim().split("\n");
    const quoted = lines.map((line) => `> ${line}`).join("\n");
    return quoted + "\n\n";
  }

  private convertTable(node: TiptapNode): string {
    if (!node.content) return "";

    const rows = node.content.map((row) => this.convertTableRow(row));

    if (rows.length > 0) {
      const firstRow = node.content[0];
      if (firstRow.content) {
        const separator =
          "|" + firstRow.content.map(() => " --- ").join("|") + "|\n";
        rows.splice(1, 0, separator);
      }
    }

    return rows.join("") + "\n";
  }

  private convertTableRow(node: TiptapNode): string {
    if (!node.content) return "";

    const cells = node.content.map((cell) => this.convertTableCell(cell));
    return "|" + cells.join("|") + "|\n";
  }

  private convertTableCell(node: TiptapNode): string {
    const content = node.content ? this.convertNodes(node.content).trim() : "";
    return ` ${content} `;
  }
}
