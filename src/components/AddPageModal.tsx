
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";

interface AddPageModalProps {
    onClose: () => void;
    onSuccess: () => void;
}

export default function AddPageModal({ onClose, onSuccess }: AddPageModalProps) {
    const [title, setTitle] = useState("");
    const [emoji, setEmoji] = useState("📄");
    const [loading, setLoading] = useState(false);
    const [mounted, setMounted] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Auto-generate slug
            const finalSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
            const uniqueSlug = finalSlug || `page-${Date.now()}`;

            const res = await fetch("/api/pages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title,
                    slug: uniqueSlug,
                    sidebar_emoji: emoji,
                    sidebar_label: title,
                    content: "<p>Start writing here...</p>",
                    sidebar_order: 100
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.details || "Failed to create page");
            }

            router.refresh();
            onSuccess();
        } catch (error: any) {
            console.error(error);
            alert(`Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    if (!mounted) return null;

    return createPortal(
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-[var(--notes-sidebar)] rounded-lg shadow-xl w-full max-w-sm border border-[var(--notes-border)]">
                <div className="p-4 border-b border-[var(--notes-border)] flex items-center justify-between">
                    <h2 className="text-[13px] font-bold text-[var(--notes-text)]">New Page</h2>
                    <button
                        onClick={onClose}
                        className="text-[var(--notes-text-muted)] hover:text-[var(--notes-text)]"
                    >
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    <div className="flex gap-3">
                        <div className="shrink-0">
                            <label className="block text-[11px] font-medium text-[var(--notes-text-muted)] mb-1.5">Icon</label>
                            <input
                                type="text"
                                value={emoji}
                                onChange={(e) => setEmoji(e.target.value)}
                                className="w-12 h-10 bg-[var(--notes-bg)] border border-[var(--notes-border)] rounded text-center text-lg focus:border-[var(--notes-link)] focus:outline-none transition-colors text-[var(--notes-text)]"
                                maxLength={2}
                            />
                        </div>
                        <div className="grow">
                            <label className="block text-[11px] font-medium text-[var(--notes-text-muted)] mb-1.5">
                                Page Title
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full bg-[var(--notes-bg)] border border-[var(--notes-border)] rounded px-2.5 py-1.5 text-[13px] text-[var(--notes-text)] focus:outline-none focus:border-[var(--notes-link)] transition-colors placeholder-[var(--notes-text-muted)]"
                                placeholder="e.g. Shopping List"
                                required
                                autoFocus
                            />
                        </div>
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-2 bg-[var(--notes-link)] text-[var(--notes-bg)] font-semibold rounded hover:bg-[var(--notes-link-hover)] transition-colors disabled:opacity-50 text-sm"
                        >
                            {loading ? "Creating..." : "Create Page"}
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
}
