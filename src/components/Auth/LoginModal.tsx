"use client";

import { useState } from "react";

interface LoginModalProps {
  onSuccess: () => void;
  onClose: () => void;
}

export default function LoginModal({ onSuccess, onClose }: LoginModalProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }

      onSuccess();
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-[var(--notes-sidebar)] rounded-lg shadow-xl w-full max-w-sm border border-[var(--notes-border)]">
        <div className="p-4 border-b border-[var(--notes-border)] flex items-center justify-between">
          <h2 className="text-[13px] font-bold text-[var(--notes-text)]">Admin Access</h2>
          <button
            onClick={onClose}
            className="text-[var(--notes-text-muted)] hover:text-[var(--notes-text)]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-4">
          <div>
            <label className="block text-[11px] font-medium text-[var(--notes-text-muted)] mb-1.5">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full px-3 py-2 bg-[var(--notes-bg)] border border-[var(--notes-border)] rounded-md text-[var(--notes-text)] placeholder-[var(--notes-text-muted)] text-[13px] focus:outline-none focus:border-[var(--notes-link)] mb-3"
              autoFocus
            />
          </div>
          {error && <p className="text-red-400 text-sm mb-3">{error}</p>}
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-[13px] bg-[var(--notes-bg)] text-[var(--notes-text-muted)] rounded hover:bg-[var(--notes-hover)] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !password}
              className="px-3 py-1.5 text-[13px] bg-[var(--notes-link)] text-[#1e1e1e] font-medium rounded hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Checking..." : "Login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
