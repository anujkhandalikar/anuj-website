
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TipTapEditor from "@/components/Editor/TipTapEditor";
import Link from "next/link";
import useSWR from "swr";
import { Page } from "@/lib/db";
import React from 'react';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

// Unwrap params Promise for Next.js 15
async function getSlug(params: Promise<{ slug: string }>): Promise<string> {
    const resolvedParams = await params;
    return resolvedParams.slug;
}

export default function EditPage({ params }: { params: Promise<{ slug: string }> }) {
    const [slug, setSlug] = useState<string | null>(null);
    const router = useRouter();
    const editorRef = React.useRef<{ save: () => Promise<void> }>(null);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        getSlug(params).then(setSlug);
    }, [params]);

    const { data: page, error, mutate } = useSWR<Page>(
        slug ? `/api/pages/${slug}` : null,
        fetcher
    );

    const handleSave = async (content: string) => {
        if (!slug) return;

        try {
            const res = await fetch(`/api/pages/${slug}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content }),
            });

            if (!res.ok) {
                throw new Error("Failed to save");
            }

            // Update local data
            mutate({ ...page!, content, updated_at: new Date().toISOString() }, false);
        } catch (error) {
            console.error("Save error:", error);
            alert("Failed to save changes");
        }
    };

    const handleManualSaveClick = async () => {
        if (editorRef.current) {
            setIsSaving(true);
            await editorRef.current.save();
            setIsSaving(false);
        }
    };

    const handleExit = () => {
        router.push("/");
    };

    if (!slug) return <div className="p-8 text-[#999]">Loading...</div>;
    if (error) return <div className="p-8 text-red-400">Error loading page</div>;
    if (!page) return <div className="p-8 text-[#999]">Loading...</div>;

    return (
        <div className="min-h-screen bg-[var(--notes-bg)] text-[var(--notes-text)]">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--notes-border)] sticky top-0 bg-[var(--notes-bg)] z-10">
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleExit}
                        className="text-[var(--notes-text-secondary)] hover:text-[var(--notes-text)] transition-colors"
                    >
                        ← Back
                    </button>
                    <div className="h-4 w-px bg-[var(--notes-border)]" />
                    <h1 className="font-medium text-[var(--notes-text)] flex items-center gap-2">
                        <span>{page.sidebar_emoji}</span>
                        {page.title}
                    </h1>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--notes-sidebar-hover)] text-[var(--notes-text-secondary)]">
                        Editing
                    </span>
                </div>
            </div>

            {/* Editor Container */}
            <div className="max-w-[700px] mx-auto px-6 py-10">
                <TipTapEditor
                    ref={editorRef}
                    content={page.content}
                    onSave={handleSave}
                    editable={true}
                />
            </div>
        </div>
    );
}
