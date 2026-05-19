"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";

const INTERNAL_HOSTS = new Set([
    "anujk.in",
    "www.anujk.in",
    "anujkhandalikar.vercel.app",
]);

export default function OutboundLinkTracker() {
    useEffect(() => {
        function onClick(e: MouseEvent) {
            const target = e.target as HTMLElement | null;
            if (!target) return;
            const anchor = target.closest("a") as HTMLAnchorElement | null;
            if (!anchor) return;

            const href = anchor.getAttribute("href");
            if (!href) return;

            if (href.startsWith("mailto:")) {
                track("email_click", {
                    href,
                    page_path: window.location.pathname,
                });
                return;
            }

            if (!/^https?:\/\//i.test(href)) return;

            try {
                const url = new URL(href);
                if (INTERNAL_HOSTS.has(url.hostname)) return;
                track("outbound_click", {
                    href,
                    host: url.hostname,
                    page_path: window.location.pathname,
                });
            } catch {
                // ignore bad URLs
            }
        }

        document.addEventListener("click", onClick, { capture: true });
        return () => document.removeEventListener("click", onClick, { capture: true });
    }, []);

    return null;
}
