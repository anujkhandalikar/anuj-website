import { useEdit } from "@/lib/EditContext";
import dynamic from "next/dynamic";
import { useCallback, useRef, useState } from "react";
import type { TipTapEditorRef } from "./TipTapEditor";

const TipTapEditor = dynamic(() => import("./TipTapEditor"), {
  ssr: false,
  loading: () => <div className="animate-pulse bg-[#3a3a3a] h-40 rounded" />,
});

interface EditableSectionProps {
  slug: string;
  content: string;
  className?: string;
}

export default function EditableSection({
  slug,
  content,
  className = "",
}: EditableSectionProps) {
  const { isEditMode } = useEdit();
  const editorRef = useRef<TipTapEditorRef>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = useCallback(
    async (newContent: string) => {
      const res = await fetch(`/api/pages/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newContent }),
      });

      if (!res.ok) {
        throw new Error("Failed to save");
      }
    },
    [slug]
  );

  const handleManualSave = async () => {
    if (editorRef.current) {
      setIsSaving(true);
      await editorRef.current.save();
      setIsSaving(false);
    }
  };

  if (isEditMode) {
    return (
      <div className={`${className} relative group`}>
        <div className="absolute -left-3 top-0 bottom-0 w-1 bg-[#e0a84c] rounded opacity-50" />
        <TipTapEditor
          ref={editorRef}
          content={content}
          onSave={handleSave}
          editable={true}
        />
      </div>
    );
  }

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
