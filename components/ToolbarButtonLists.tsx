import ToolbarButton from "./ToolbarButton";

interface ToolbarButtonListsProps {
  editable: boolean;
  // eslint-disable-next-line
  editor: any;
  setLink: () => void;
  insertTable: () => void;
}

const ToolbarSeparator = () => <div className="w-px h-6 bg-gray-600 mx-1" />;

const ToolbarButtonLists = ({
  editor,
  editable,
  setLink,
  insertTable,
}: ToolbarButtonListsProps) => {
  return (
    <div>
      {/* -----Toolbar - only show when editable----- */}
      {editable && (
        <div className="bg-gray-800 border border-gray-700 rounded-md p-2 flex flex-wrap gap-1 mb-2">
          {/* -----Text formatting----- */}
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            active={editor.isActive("bold")}
            title="Bold (Ctrl+B)"
          >
            <strong>B</strong>
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            active={editor.isActive("italic")}
            title="Italic (Ctrl+I)"
          >
            <em>I</em>
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            active={editor.isActive("strike")}
            title="Strikethrough"
          >
            <s>S</s>
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleCode().run()}
            active={editor.isActive("code")}
            title="Inline code"
          >
            {"</>"}
          </ToolbarButton>

          <ToolbarButton
            onClick={setLink}
            active={editor.isActive("link")}
            title="Add link"
          >
            🔗
          </ToolbarButton>

          <ToolbarSeparator />

          {/* -----Headings----- */}
          <ToolbarButton
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            active={editor.isActive("heading", { level: 1 })}
            title="Heading 1"
          >
            H1
          </ToolbarButton>

          <ToolbarButton
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            active={editor.isActive("heading", { level: 2 })}
            title="Heading 2"
          >
            H2
          </ToolbarButton>

          <ToolbarButton
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            active={editor.isActive("heading", { level: 3 })}
            title="Heading 3"
          >
            H3
          </ToolbarButton>

          <ToolbarSeparator />

          {/* -----Lists-----*/}
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            active={editor.isActive("bulletList")}
            title="Bullet list"
          >
            • List
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            active={editor.isActive("orderedList")}
            title="Numbered list"
          >
            1. List
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleTaskList().run()}
            active={editor.isActive("taskList")}
            title="Task list"
          >
            ☑ Task
          </ToolbarButton>

          <ToolbarSeparator />

          {/* -----Blocks----- */}
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            active={editor.isActive("blockquote")}
            title="Blockquote"
          >
            &quot;
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            active={editor.isActive("codeBlock")}
            title="Code block"
          >
            {"</>"}
          </ToolbarButton>

          <ToolbarButton onClick={insertTable} title="Insert table">
            ⊞ Table
          </ToolbarButton>
        </div>
      )}
    </div>
  );
};

export default ToolbarButtonLists;
