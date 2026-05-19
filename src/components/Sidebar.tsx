"use client";

import Link from "next/link";
import Image from "next/image";
import SidebarAddButton from "@/components/SidebarAddButton";
import ThemeToggle from "@/components/ThemeToggle";
import { SidebarPage } from "@/lib/db";
import { usePathname } from "next/navigation";
import { track } from "@/lib/analytics";

interface SidebarProps {
    pages: SidebarPage[];
    isAuthenticated: boolean;
}

export default function Sidebar({ pages, isAuthenticated }: SidebarProps) {
    const pathname = usePathname();
    // derived active slug from pathname
    // pathname can be "/" (activeSlug = 'about' effectively if we consider home as about)
    // or "/slug"
    // The previous logic passed "activeSlug".
    // If pathname is "/", activeSlug is effectively checking if page.slug === 'about'
    // If pathname is "/foo", activeSlug is 'foo'

    const isActive = (slug: string) => {
        if (slug === 'about') {
            return pathname === '/';
        }
        return pathname === `/${slug}`;
    };

    // Hardcoded notes/pinned logic could be replaced by DB field 'pinned', but for now adhering to previous static structure
    // User had "about me" pinned. In DB we might not have pinned column yet, but we have "about" slug.
    const pinnedPages = pages.filter(p => p.slug === 'about');
    const otherPages = pages
        .filter(p => p.slug !== 'about')
        .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());

    return (
        <aside
            className="hidden md:flex flex-col bg-[var(--notes-sidebar)] border-r border-[var(--notes-border)] fixed h-full pt-3 max-w-none"
            style={{ width: '260px' }}
        >
            {/* Logo */}
            <div className="px-3 pb-2 w-full">
                <Link
                    href="/"
                    onClick={() => track("nav_click", { section: "logo", slug: "home" })}
                    className="flex items-center gap-2 px-1 hover:opacity-80 transition-opacity w-full"
                >
                    <Image src="/apple-notes-logo.webp" alt="Anuj World" width={28} height={28} className="rounded-md" />
                    <span className="text-sm font-medium text-[var(--notes-text)]">anuj's home</span>
                </Link>
            </div>

            {/* Add Page Button */}
            <div className="px-3 pb-1 w-full">
                <SidebarAddButton isAuthenticated={isAuthenticated} />
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto w-full max-w-none">
                {/* Pinned Section */}
                {pinnedPages.length > 0 && (
                    <div className="px-2 py-1.5 w-full">
                        <p className="text-[11px] text-[var(--notes-text-muted)] font-medium mb-1.5 px-1 flex items-center gap-1">
                            <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                            </svg>
                            Pinned
                        </p>
                        {pinnedPages.map((page) => (
                            <Link
                                key={page.slug}
                                href="/"
                                onClick={() => track("nav_click", { section: "pinned", slug: page.slug })}
                                className={`block w-full p-2 rounded-md mb-0.5 transition-colors group ${isActive(page.slug) ? 'bg-[var(--notes-sidebar-hover)]' : 'hover:bg-[var(--notes-sidebar-hover)]'}`}
                            >
                                <div className="flex items-center gap-2 mb-1 w-full min-w-0">
                                    <span className="text-[13px] shrink-0">{page.sidebar_emoji || "📌"}</span>
                                    <span
                                        className="text-[13px] font-bold text-[var(--notes-text)] flex-1 min-w-0 block truncate"
                                    >
                                        {page.title}
                                    </span>
                                </div>
                                <div className="w-full min-w-0">
                                    <p
                                        className="text-[11px] text-[var(--notes-text-secondary)] w-full block truncate"
                                    >
                                        <span className="text-[var(--notes-text-muted)]">{new Date(page.created_at).toLocaleDateString('en-US')}</span> {page.snippet}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {/* Other Pages */}
                <div className="px-2 py-1.5 w-full">
                    <p className="text-[11px] text-[var(--notes-text-muted)] font-medium mb-1.5 px-1 uppercase tracking-wide">
                        Pages
                    </p>
                    {otherPages.map((page) => (
                        <Link
                            key={page.slug}
                            href={`/${page.slug}`}
                            onClick={() => track("nav_click", { section: "pages", slug: page.slug })}
                            className={`block w-full p-2 rounded-md mb-0.5 transition-colors group ${isActive(page.slug) ? 'bg-[var(--notes-sidebar-hover)]' : 'hover:bg-[var(--notes-sidebar-hover)]'}`}
                        >
                            <div className="flex items-center gap-2 mb-1 w-full min-w-0 max-w-none">
                                <span className="text-[13px] shrink-0">{page.sidebar_emoji || "📄"}</span>
                                <span
                                    className={`text-[13px] font-bold transition-colors flex-1 min-w-0 block ${isActive(page.slug) ? 'text-[var(--notes-text)]' : 'text-[var(--notes-text)] group-hover:text-[var(--notes-link)]'}`}
                                    style={{
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis'
                                    }}
                                >
                                    {page.title}
                                </span>
                            </div>
                            <div className="w-full min-w-0 max-w-none">
                                <p
                                    className="text-[11px] text-[var(--notes-text-secondary)] w-full block group-hover:text-[var(--notes-text-muted)]"
                                    style={{
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis'
                                    }}
                                >
                                    <span className="text-[var(--notes-text-muted)]">{new Date(page.created_at).toLocaleDateString('en-US')}</span> {page.snippet}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </nav>

            {/* Footer links */}
            <div className="p-3 border-t border-[var(--notes-border)] flex items-center justify-between">
                <div className="flex gap-3 text-[11px] text-[var(--notes-text-muted)]">
                    <Link
                        href="https://twitter.com/realkhandalikar"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-[var(--notes-link)] transition-colors"
                    >
                        twitter
                    </Link>
                    <Link
                        href="https://www.linkedin.com/in/anuj-khandalikar-88ab5a158/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-[var(--notes-link)] transition-colors"
                    >
                        linkedin
                    </Link>
                    <Link
                        href="https://www.instagram.com/anuj.khandalikar/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-[var(--notes-link)] transition-colors"
                    >
                        instagram
                    </Link>
                    <Link
                        href="mailto:anujkhandalikar027@gmail.com"
                        className="hover:text-[var(--notes-link)] transition-colors"
                    >
                        email
                    </Link>
                </div>
                <ThemeToggle />
            </div>
        </aside>
    );
}
