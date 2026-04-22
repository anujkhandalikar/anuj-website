
"use client";

import { useState } from "react";
import Link from "next/link";

interface EditableSectionProps {
    slug: string;
    initialContent: string;
    isAuthenticated: boolean;
}

export default function EditableSection({ slug, initialContent, isAuthenticated }: EditableSectionProps) {
    // We use initialContent to render immediately.
    // In a real robust app, we might re-fetch here or rely on parent revalidation,
    // but for now, trusting the parent's server fetch is fastest.

    return (
        <div className="group relative">
            {/* Edit Button - Apple style pencil icon */}
            {isAuthenticated && (
                <Link
                    href={`/edit/${slug}`}
                    className="absolute -right-8 top-0 p-1.5 rounded-full bg-[var(--notes-sidebar-hover)] text-[var(--notes-text-secondary)] hover:text-[var(--notes-text)] hover:bg-[var(--notes-sidebar)] opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-sm"
                    title="Edit this section"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                </Link>
            )}

            {/* Content Renderer */}
            <div
                dangerouslySetInnerHTML={{ __html: initialContent }}
                // These utility classes ensure the injected HTML has the same base styles as the parent container
                // Note: The specific classes (text colors, etc.) are inside the HTML string in the DB.
                className="prose prose-invert max-w-none page-content"
            />
        </div>
    );
}
