export type MarkdownToken = {
  type: string;
  tag: string;
  content?: string;
  children?: MarkdownToken[];
  attrs?: [string, string][];
  attrGet?: (name: string) => string | null;
  attrIndex?: (name: string) => number;
  attrPush?: (attr: [string, string]) => void;
  attrSet?: (name: string, value: string) => void;
  attrJoin?: (name: string, value: string) => void;
  map?: [number, number];
  level?: number;
  nesting?: number;
  markup?: string;
  info?: string;
};

export type TiptapNode = {
  type: string;
  attrs?: Record<string, unknown>;
  content?: TiptapNode[];
  marks?: TiptapMark[];
  text?: string;
};

export type TiptapMark = {
  type: string;
  attrs?: Record<string, unknown>;
};

export type MarkdownTaskListToken = {
  type: string;
  tag: string;
  content?: string;
  attrs?: [string, string][];
  children?: MarkdownToken[];
  attrGet?: (name: string) => string | null;
};

export type ToolbarButtonProps = {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  title?: string;
};

export type ParserErrorCode = 
  | 'INVALID_MARKDOWN' 
  | 'EXTENSION_ERROR' 
  | 'VALIDATION_ERROR' 
  | 'UNKNOWN_TOKEN' 
  | 'TIPTAP_TO_MARKDOWN_ERROR' 
  | 'CONVERSION_ERROR';

export type ParserError = {
  code: ParserErrorCode;
  message: string;
  details?: unknown;
  tokenIndex?: number;
  tokenType?: string;
  extensionName?: string;
};

export type ParserResult = {
  document: TiptapNode;
  errors: ParserError[];
  warnings: ParserError[];
  stats: {
    parseTime: number;
    tokenCount: number;
  };
};
