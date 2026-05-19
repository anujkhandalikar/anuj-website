type GtagParams = Record<string, string | number | boolean | undefined>;

declare global {
    interface Window {
        gtag?: (command: "event" | "config" | "js" | "set", action: string, params?: GtagParams) => void;
    }
}

export function track(event: string, params: GtagParams = {}) {
    if (typeof window === "undefined") return;
    if (typeof window.gtag !== "function") return;
    window.gtag("event", event, params);
}
