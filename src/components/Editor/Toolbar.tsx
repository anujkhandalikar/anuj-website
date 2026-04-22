"use client";

import { Editor } from "@tiptap/react";
import { useCallback, useState } from "react";

interface ToolbarProps {
  editor: Editor;
  onSave: () => void;
  isSaving: boolean;
  hasChanges: boolean;
}

export default function Toolbar({ editor, onSave, isSaving, hasChanges }: ToolbarProps) {
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");

  const setLink = useCallback(() => {
    if (linkUrl) {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: linkUrl })
        .run();
    }
    setShowLinkInput(false);
    setLinkUrl("");
  }, [editor, linkUrl]);

  const removeLink = useCallback(() => {
    editor.chain().focus().unsetLink().run();
  }, [editor]);

  const buttonClass = (active: boolean) =>
    `p-1.5 rounded text-sm hover:bg-[var(--notes-sidebar-selected)] transition-colors ${active
      ? "bg-[var(--notes-sidebar-selected)] text-[var(--notes-text)]"
      : "text-[var(--notes-text-muted)] hover:text-[var(--notes-text)]"
    }`;

  return (
    <div className="flex flex-wrap gap-1 p-2 mb-2 bg-[var(--notes-sidebar-hover)] rounded-lg sticky top-0 z-10">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={buttonClass(editor.isActive("bold"))}
        title="Bold (Cmd+B)"
      >
        <strong>B</strong>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={buttonClass(editor.isActive("italic"))}
        title="Italic (Cmd+I)"
      >
        <em>I</em>
      </button>

      <div className="w-px h-5 bg-[var(--notes-border)] mx-1" />

      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={buttonClass(editor.isActive("heading", { level: 1 }))}
        title="Heading 1"
      >
        H1
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={buttonClass(editor.isActive("heading", { level: 2 }))}
        title="Heading 2"
      >
        H2
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={buttonClass(editor.isActive("heading", { level: 3 }))}
        title="Heading 3"
      >
        H3
      </button>

      <div className="w-px h-5 bg-[var(--notes-border)] mx-1" />

      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={buttonClass(editor.isActive("bulletList"))}
        title="Bullet List"
      >
        • List
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={buttonClass(editor.isActive("orderedList"))}
        title="Numbered List"
      >
        1. List
      </button>

      <div className="w-px h-5 bg-[var(--notes-border)] mx-1" />

      {showLinkInput ? (
        <div className="flex items-center gap-1">
          <input
            type="url"
            placeholder="Enter URL..."
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && setLink()}
            className="px-2 py-1 bg-[var(--notes-bg)] border border-[var(--notes-border)] rounded text-[12px] text-[var(--notes-text)] w-40"
            autoFocus
          />
          <button
            onClick={setLink}
            className="px-2 py-1 bg-[var(--notes-link)] text-[var(--notes-bg)] rounded text-[12px]"
          >
            Add
          </button>
          <button
            onClick={() => {
              setShowLinkInput(false);
              setLinkUrl("");
            }}
            className="px-2 py-1 bg-[var(--notes-sidebar)] text-[var(--notes-text-muted)] rounded text-[12px]"
          >
            Cancel
          </button>
        </div>
      ) : (
        <>
          <button
            onClick={() => setShowLinkInput(true)}
            className={buttonClass(editor.isActive("link"))}
            title="Add Link"
          >
            🔗 Link
          </button>
          {editor.isActive("link") && (
            <button
              onClick={removeLink}
              className="px-2 py-1 bg-red-900/50 text-red-300 rounded text-[12px] hover:bg-red-900"
              title="Remove Link"
            >
              Unlink
            </button>
          )}
        </>
      )}

      <div className="w-px h-5 bg-[var(--notes-border)] mx-1" />

      <button
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        className={buttonClass(false)}
        title="Horizontal Rule"
      >
        ─
      </button>

      <div className="w-px h-5 bg-[var(--notes-border)] mx-1" />

      <button
        onClick={onSave}
        disabled={isSaving || !hasChanges}
        className={`px-2 py-1 text-sm rounded transition-colors ${isSaving
            ? "text-[var(--notes-text-muted)]"
            : !hasChanges
              ? "text-[var(--notes-text-muted)] opacity-50 cursor-not-allowed"
              : "text-[var(--notes-link)] hover:bg-[var(--notes-sidebar-selected)]"
          }`}
        title={!hasChanges ? "No changes to save" : "Save (Cmd+S)"}
      >
        {isSaving ? "Saving..." : "Save"}
      </button>
    </div>
  );
}
