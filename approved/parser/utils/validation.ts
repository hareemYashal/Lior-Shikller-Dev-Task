import { TiptapNode, TiptapMark, ParserError } from "@/types";

/**
 * Validates a TiptapNode structure to ensure it meets the expected schema
 * @param node The TiptapNode to validate
 * @returns An array of validation errors, empty if valid
 */
export function validateTiptapNode(node: TiptapNode): ParserError[] {
  const errors: ParserError[] = [];
  
  // Check required properties
  if (!node.type) {
    errors.push({
      code: 'VALIDATION_ERROR',
      message: 'Node is missing required "type" property',
      details: node
    });
  }

  // Validate content array if present
  if (node.content) {
    if (!Array.isArray(node.content)) {
      errors.push({
        code: 'VALIDATION_ERROR',
        message: '"content" property must be an array',
        details: node
      });
    } else {
      // Recursively validate all child nodes
      node.content.forEach((childNode, index) => {
        const childErrors = validateTiptapNode(childNode);
        childErrors.forEach(error => {
          errors.push({
            ...error,
            message: `Error in content[${index}]: ${error.message}`
          });
        });
      });
    }
  }

  // Validate marks array if present
  if (node.marks) {
    if (!Array.isArray(node.marks)) {
      errors.push({
        code: 'VALIDATION_ERROR',
        message: '"marks" property must be an array',
        details: node
      });
    } else {
      // Validate each mark
      node.marks.forEach((mark: TiptapMark, index) => {
        if (!mark.type) {
          errors.push({
            code: 'VALIDATION_ERROR',
            message: `Mark at index ${index} is missing required "type" property`,
            details: mark
          });
        }
      });
    }
  }

  // Validate text nodes
  if (node.type === 'text' && node.text === undefined) {
    errors.push({
      code: 'VALIDATION_ERROR',
      message: 'Text node is missing required "text" property',
      details: node
    });
  }

  return errors;
}

/**
 * Validates markdown input
 * @param markdown The markdown string to validate
 * @returns An array of validation errors, empty if valid
 */
export function validateMarkdownInput(markdown: string): ParserError[] {
  const errors: ParserError[] = [];
  
  if (typeof markdown !== 'string') {
    errors.push({
      code: 'INVALID_MARKDOWN',
      message: 'Input must be a string',
      details: typeof markdown
    });
    return errors;
  }

  // Check for extremely large input that might cause performance issues
  if (markdown.length > 500000) { // 500KB limit
    errors.push({
      code: 'INVALID_MARKDOWN',
      message: 'Markdown input exceeds maximum allowed size (500KB)',
      details: { size: markdown.length }
    });
  }

  // Check for potentially problematic patterns
  if (markdown.includes('\0')) {
    errors.push({
      code: 'INVALID_MARKDOWN',
      message: 'Markdown contains null characters',
      details: 'Input contains null bytes which may cause parsing issues'
    });
  }

  return errors;
}
