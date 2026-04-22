
"use client";

import { useState } from "react";
import AddPageModal from "@/components/AddPageModal";

export default function SidebarAddButton({ isAuthenticated }: { isAuthenticated: boolean }) {
    const [showModal, setShowModal] = useState(false);

    if (!isAuthenticated) return null;

    return (
        <>
            <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-1 text-[12px] text-[#999] hover:text-[#e0a84c] transition-colors w-full px-2 py-1 rounded hover:bg-[#3a3a3a]"
            >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Page
            </button>

            {showModal && (
                <AddPageModal
                    onClose={() => setShowModal(false)}
                    onSuccess={() => setShowModal(false)}
                />
            )}
        </>
    );
}
