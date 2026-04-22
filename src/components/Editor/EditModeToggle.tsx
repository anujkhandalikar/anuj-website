"use client";

import { useState } from "react";
import { useEdit } from "@/lib/EditContext";
import LoginModal from "@/components/Auth/LoginModal";

export default function EditModeToggle() {
  const { isAuthenticated, isEditMode, setIsEditMode, checkAuth, logout } =
    useEdit();
  const [showLogin, setShowLogin] = useState(false);

  const handleEditClick = () => {
    if (!isAuthenticated) {
      setShowLogin(true);
    } else {
      setIsEditMode(true);
    }
  };

  const handleLoginSuccess = () => {
    setShowLogin(false);
    checkAuth().then(() => {
      setIsEditMode(true);
    });
  };

  const handleDone = () => {
    setIsEditMode(false);
  };

  const handleLogout = async () => {
    await logout();
  };

  // Don't show anything if not authenticated and not in edit mode
  if (!isAuthenticated && !showLogin) {
    return (
      <div className="hidden md:block">
        {/* Hidden trigger - triple click on date or Cmd+E */}
        <button
          onClick={handleEditClick}
          className="fixed top-4 right-4 z-50 px-3 py-1.5 text-[11px] text-transparent hover:text-[#666] transition-colors"
          title="Edit (Cmd+E)"
        >
          Edit
        </button>
        {showLogin && (
          <LoginModal
            onSuccess={handleLoginSuccess}
            onClose={() => setShowLogin(false)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="hidden md:block">
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
        {isEditMode ? (
          <>
            <span className="text-[11px] text-[#e0a84c] flex items-center gap-1">
              ✏️ Editing
            </span>
            <button
              onClick={handleDone}
              className="px-3 py-1.5 bg-[#e0a84c] text-[#1e1e1e] rounded-md text-[12px] font-medium hover:bg-[#f0b85c] transition-colors"
            >
              Done
            </button>
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 bg-[var(--notes-sidebar-hover)] text-[var(--notes-text-secondary)] rounded-md text-[12px] hover:bg-[var(--notes-sidebar)] transition-colors"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <button
              onClick={handleEditClick}
              className="px-3 py-1.5 bg-[var(--notes-sidebar-hover)] text-[var(--notes-text-secondary)] rounded-md text-[12px] hover:bg-[var(--notes-sidebar)] hover:text-[var(--notes-text)] transition-colors"
            >
              Edit
            </button>
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 bg-[var(--notes-sidebar-hover)] text-[var(--notes-text-muted)] rounded-md text-[12px] hover:bg-[var(--notes-sidebar)] transition-colors"
            >
              Logout
            </button>
          </>
        )}
      </div>
      {showLogin && (
        <LoginModal
          onSuccess={handleLoginSuccess}
          onClose={() => setShowLogin(false)}
        />
      )}
    </div>
  );
}
