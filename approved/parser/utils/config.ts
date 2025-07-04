import { ParserErrorCode } from "@/types";

/**
 * Configuration options for the Markdown parser
 */
export interface ParserConfig {
  /**
   * Whether to throw errors or return them in the result
   * @default false
   */
  throwOnError: boolean;
  
  /**
   * Whether to validate the output Tiptap JSON structure
   * @default true
   */
  validateOutput: boolean;
  
  /**
   * Error codes that are considered critical and should prevent parsing
   */
  criticalErrorCodes: ParserErrorCode[];
  
  /**
   * Maximum size of markdown input in characters
   * @default 500000 (500KB)
   */
  maxInputSize: number;
  
  /**
   * Whether to collect performance statistics
   * @default true
   */
  collectStats: boolean;
}

/**
 * Default configuration for the Markdown parser
 */
export const defaultParserConfig: ParserConfig = {
  throwOnError: false,
  validateOutput: true,
  criticalErrorCodes: ['INVALID_MARKDOWN'],
  maxInputSize: 500000,
  collectStats: true
};
