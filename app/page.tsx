"use client";
import React, { useState } from "react";
import { MarkdownParser } from "../parser/MarkdownParser";
import * as extensions from "../parser/extensions";
import { TiptapEditor } from "../components/TiptapEditor";
import { TiptapNode, ParserError } from "@/types";

export default function HomePage() {
  const [markdown, setMarkdown] = useState(
    "# Task List Example\n\n- [x] Completed task\n- [ ] Pending task\n- [x] Another completed task\n\n## Formatting\n\n**Bold text** and *italic text*\n\n> Blockquote example\n\n```js\nconsole.log('Code block')\n```\n"
  );
  const [tiptapJSON, setTiptapJSON] = useState<TiptapNode>({
    type: "doc",
    content: [],
  });
  const [parserErrors, setParserErrors] = useState<ParserError[]>([]);
  const [parserWarnings, setParserWarnings] = useState<ParserError[]>([]);
  const [parseStats, setParseStats] = useState<{
    parseTime: number;
    tokenCount: number;
  }>({ parseTime: 0, tokenCount: 0 });

  const parser = React.useMemo(() => {
    const p = new MarkdownParser({
      validateOutput: true,
      collectStats: true,
      throwOnError: false,
    });
    Object.values(extensions).forEach((ext) => p.registerExtension(ext));
    return p;
  }, []);

  React.useEffect(() => {
    try {
      const result = parser.parse(markdown);
      setTiptapJSON(result.document);
      setParserErrors(result.errors);
      setParserWarnings(result.warnings);
      setParseStats(result.stats);
    } catch (error) {
      console.error("Parsing failed:", error);
      setTiptapJSON({ type: "doc", content: [] });
      setParserErrors([
        {
          code: "CONVERSION_ERROR",
          message: error instanceof Error ? error.message : String(error),
        },
      ]);
    }
  }, [markdown, parser]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
      {/* Main content area - full height with side-by-side layout */}
      <div className="flex flex-col lg:flex-row flex-1 h-screen overflow-hidden">
        {/* Editor panel */}
        <div className="w-full lg:w-1/2 min-h-[calc(100vh-4rem)] flex flex-col border-r border-gray-700">
          <div className="bg-gray-800 px-4 py-3 border-b border-gray-700 flex items-center">
            <div className="flex space-x-2 mr-3">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <h2 className="text-sm font-medium text-gray-300">markdown</h2>
          </div>
          <textarea
            className="flex-1 w-full bg-gray-900 text-gray-100 p-4 resize-none focus:outline-none font-mono text-sm"
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            placeholder="Enter markdown here..."
            spellCheck="false"
          />
        </div>

        {/* Preview panel */}
        <div className="w-full lg:w-1/2 h-full flex flex-col">
          <div className="bg-gray-800 px-4 py-3 border-b border-gray-700 flex items-center">
            <div className="flex space-x-2 mr-3">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <h2 className="text-sm font-medium text-gray-300">preview</h2>
          </div>
          <div className="flex-1 p-4 overflow-auto bg-gray-900">
            <div className="prose prose-invert max-w-none">
              <TiptapEditor content={tiptapJSON} />
            </div>
          </div>
        </div>
      </div>

      {/* Status bar */}
      {/* Status bar with parser stats */}
      <div className="bg-gray-800 border-t border-gray-700 px-4 py-2 text-xs text-gray-400 flex justify-between">
        <div>Markdown to Tiptap</div>
        <div className="flex space-x-4">
          <div className="flex space-x-2">
            <span>Parse time: {parseStats.parseTime.toFixed(2)}ms</span>
            <span>Tokens: {parseStats.tokenCount}</span>
          </div>
          <div>Dark Theme</div>
        </div>
      </div>

      {/* Error and warning display */}
      {parserErrors.length > 0 && (
        <div className="bg-red-900/50 border border-red-700 rounded-md p-3 m-4">
          <h3 className="text-red-300 font-medium mb-2">Parsing Errors:</h3>
          <ul className="text-red-200 text-sm space-y-1">
            {parserErrors.map((error, index) => (
              <li key={index}>
                <span className="font-mono bg-red-900/30 px-1 rounded">
                  {error.code}
                </span>
                : {error.message}
              </li>
            ))}
          </ul>
        </div>
      )}

      {parserWarnings.length > 0 && (
        <div className="bg-yellow-900/50 border border-yellow-700 rounded-md p-3 m-4">
          <h3 className="text-yellow-300 font-medium mb-2">Warnings:</h3>
          <ul className="text-yellow-200 text-sm space-y-1">
            {parserWarnings.map((warning, index) => (
              <li key={index}>
                <span className="font-mono bg-yellow-900/30 px-1 rounded">
                  {warning.code}
                </span>
                : {warning.message}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
