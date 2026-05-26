
"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { SidebarPage } from "@/lib/db";
import ThemeToggle from "./ThemeToggle";
import { useEdit } from "@/lib/EditContext";
import LoginModal from "@/components/Auth/LoginModal";
import { track } from "@/lib/analytics";
import { usePathname } from "next/navigation";

interface MobileHeaderProps {
    pages: SidebarPage[];
}

export default function MobileHeader({ pages }: MobileHeaderProps) {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const lastTapRef = useRef<number>(0);
    const { isAuthenticated, isEditMode, setIsEditMode, checkAuth } = useEdit();
    const [showLogin, setShowLogin] = useState(false);

    if (pathname?.startsWith("/chotu")) return null;

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Handle double-tap on logo
    const handleLogoTap = (e: React.MouseEvent) => {
        const now = Date.now();
        const timeSinceLastTap = now - lastTapRef.current;

        if (timeSinceLastTap < 300 && timeSinceLastTap > 0) {
            // Double tap detected
            e.preventDefault();
            if (!isAuthenticated) {
                setShowLogin(true);
            } else {
                setIsEditMode(true);
            }
        }
        lastTapRef.current = now;
    };

    const handleLoginSuccess = () => {
        setShowLogin(false);
        checkAuth().then(() => {
            setIsEditMode(true);
        });
    };

    const handleDone = () => {
        setIsEditMode(false);
        setIsOpen(false);
    };

    const sortedPages = pages.sort((a, b) => (a.sidebar_order || 99) - (b.sidebar_order || 99));

    return (
        <div ref={dropdownRef} className="md:hidden">
            <header className="fixed top-0 left-0 right-0 bg-[var(--notes-sidebar)] border-b border-[var(--notes-border)] z-50 px-3 py-2.5">
                <div className="flex items-center justify-between">
                    {/* Logo - double tap to edit */}
                    <div
                        onClick={handleLogoTap}
                        className="flex items-center gap-1.5 hover:opacity-80 transition-opacity cursor-pointer"
                    >
                        <Image src="/apple-notes-logo.webp" alt="Notes" width={22} height={22} className="rounded-md" />
                        <span className="font-medium text-[13px] text-[var(--notes-text)]">anuj's home</span>
                        {isEditMode && (
                            <span className="ml-1 text-[10px] text-[#e0a84c]">✏️</span>
                        )}
                    </div>

                    {/* Right side: Theme toggle + Menu button */}
                    <div className="flex items-center gap-2">
                        <ThemeToggle />
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-1.5 rounded-md hover:bg-[var(--notes-hover)] transition-colors"
                            aria-label="Toggle menu"
                        >
                            {isOpen ? (
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--notes-text)]">
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            ) : (
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--notes-text)]">
                                    <line x1="3" y1="12" x2="21" y2="12" />
                                    <line x1="3" y1="6" x2="21" y2="6" />
                                    <line x1="3" y1="18" x2="21" y2="18" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </header>

            {/* Dropdown menu */}
            {isOpen && (
                <div className="fixed top-[45px] left-0 right-0 bg-[var(--notes-sidebar)] border-b border-[var(--notes-border)] z-40 shadow-lg">
                    <nav className="flex flex-col py-2">
                        {isEditMode && (
                            <button
                                onClick={handleDone}
                                className="px-4 py-2.5 text-[14px] text-left text-[#e0a84c] hover:bg-[var(--notes-hover)] transition-colors font-medium"
                            >
                                ✓ Done Editing
                            </button>
                        )}
                        {sortedPages.map((page) => (
                            <Link
                                key={page.slug}
                                href={page.slug === 'about' ? '/' : `/${page.slug}`}
                                onClick={() => {
                                    track("nav_click", { section: "mobile_menu", slug: page.slug });
                                    setIsOpen(false);
                                }}
                                className="px-4 py-2.5 text-[14px] text-[var(--notes-text-muted)] hover:bg-[var(--notes-hover)] hover:text-[var(--notes-link)] transition-colors"
                            >
                                {page.title}
                            </Link>
                        ))}
                    </nav>
                </div>
            )}

            {/* Login Modal */}
            {showLogin && (
                <LoginModal
                    onSuccess={handleLoginSuccess}
                    onClose={() => setShowLogin(false)}
                />
            )}
        </div>
    );
}

