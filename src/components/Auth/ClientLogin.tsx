
"use client";

import { useState, useEffect } from "react";
import LoginModal from "@/components/Auth/LoginModal";
import { useRouter } from "next/navigation";

export default function ClientLogin({ isAuthenticated }: { isAuthenticated: boolean }) {
    const [showLogin, setShowLogin] = useState(false);
    const router = useRouter();

    const handleLoginSuccess = () => {
        setShowLogin(false);
        router.refresh();
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Cmd+E to toggle login
            if ((e.metaKey || e.ctrlKey) && e.key === "e") {
                e.preventDefault();
                if (!isAuthenticated) {
                    setShowLogin(true);
                }
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isAuthenticated]);

    if (!showLogin) return null;

    return <LoginModal onSuccess={handleLoginSuccess} onClose={() => setShowLogin(false)} />;
}
