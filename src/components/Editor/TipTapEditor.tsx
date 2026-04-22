import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import {
  useCallback,
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";
import Toolbar from "./Toolbar";

interface TipTapEditorProps {
  content: string;
  onSave: (content: string) => Promise<void>;
  editable?: boolean;
}

export interface TipTapEditorRef {
  save: () => Promise<void>;
}

const TipTapEditor = forwardRef<TipTapEditorRef, TipTapEditorProps>(
  ({ content, onSave, editable = true }, ref) => {
    const [isSaving, setIsSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const [hasChanges, setHasChanges] = useState(false);
    const originalContentRef = useRef(content);

    const editor = useEditor({
      immediatelyRender: false,
      extensions: [
        StarterKit.configure({
          heading: {
            levels: [1, 2, 3],
          },
        }),
        Link.configure({
          openOnClick: false,
          HTMLAttributes: {
            class: "text-[#e0a84c] hover:underline cursor-pointer",
          },
        }),
      ],
      content,
      editable,
      editorProps: {
        attributes: {
          class:
            "prose prose-invert max-w-none focus:outline-none min-h-[200px]",
        },
      },
      onUpdate: ({ editor }) => {
        // Check if content has changed from original
        const currentContent = editor.getHTML();
        setHasChanges(currentContent !== originalContentRef.current);
      },
    });

    const handleManualSave = useCallback(async () => {
      if (!editor || !hasChanges) return;
      setIsSaving(true);
      try {
        const html = editor.getHTML();
        await onSave(html);
        setLastSaved(new Date());
        // Update the original content reference after successful save
        originalContentRef.current = html;
        setHasChanges(false);
      } catch (error) {
        console.error("Save failed:", error);
      } finally {
        setIsSaving(false);
      }
    }, [editor, onSave, hasChanges]);

    useImperativeHandle(ref, () => ({
      save: handleManualSave,
    }));

    // Debounced auto-save
    useEffect(() => {
      if (!editor || !editable || !hasChanges) return;

      const timeoutId = setTimeout(async () => {
        const html = editor.getHTML();
        if (html !== originalContentRef.current) {
          setIsSaving(true);
          try {
            await onSave(html);
            setLastSaved(new Date());
            // Update the original content reference after successful save
            originalContentRef.current = html;
            setHasChanges(false);
          } catch (error) {
            console.error("Auto-save failed:", error);
          } finally {
            setIsSaving(false);
          }
        }
      }, 2000);

      return () => clearTimeout(timeoutId);
    }, [hasChanges, editor, onSave, editable]);

    // Keyboard shortcut for save (Cmd/Ctrl + S)
    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if ((e.metaKey || e.ctrlKey) && e.key === "s") {
          e.preventDefault();
          if (hasChanges) {
            handleManualSave();
          }
        }
      };

      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }, [handleManualSave, hasChanges]);

    if (!editor) {
      return null;
    }

    return (
      <div className="relative">
        {editable && (
          <>
            <Toolbar
              editor={editor}
              onSave={handleManualSave}
              isSaving={isSaving}
              hasChanges={hasChanges}
            />
            <div className="flex items-center gap-2 text-[11px] text-[#666] mb-4">
              {isSaving ? (
                <span>Saving...</span>
              ) : lastSaved ? (
                <span>Saved ✓</span>
              ) : hasChanges ? (
                <span className="text-[var(--notes-link)]">Unsaved changes</span>
              ) : null}
            </div>
          </>
        )}
        <EditorContent editor={editor} />
      </div>
    );
  }
);

TipTapEditor.displayName = "TipTapEditor";

export default TipTapEditor;

