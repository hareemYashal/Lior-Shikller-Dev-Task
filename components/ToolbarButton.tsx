import { ToolbarButtonProps } from "@/types";

const ToolbarButton = ({
  onClick,
  active,
  disabled,
  children,
  title,
}: ToolbarButtonProps) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`
      px-3 py-1.5 text-sm font-medium rounded transition-colors
      ${
        active
          ? "bg-blue-600 text-white"
          : "bg-gray-700 text-gray-300 hover:bg-gray-600"
      }
      ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
    `}
    >
      {children}
    </button>
  );
};

export default ToolbarButton;
