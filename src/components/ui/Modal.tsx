"use client";

import { useEffect, useRef, useState, ReactNode } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  maxWidth?: string;
}

export function Modal({
  open,
  onClose,
  title,
  children,
  maxWidth = "max-w-lg",
}: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (open) {
      setVisible(true);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleAnimationEnd = () => {
    if (!open) setVisible(false);
  };

  if (!visible && !open) return null;

  return (
    <div
      ref={overlayRef}
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-200 ${
        open ? "opacity-100" : "opacity-0"
      }`}
      onTransitionEnd={handleAnimationEnd}
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className={`relative bg-white rounded-2xl shadow-2xl ${maxWidth} w-full transform transition-all duration-200 ${
          open ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        {title && (
          <div className="flex items-center justify-between px-6 pt-6 pb-2">
            <h3 className="text-lg font-heading font-bold text-gray-900">
              {title}
            </h3>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-surface-100 transition-colors"
              aria-label="Close modal"
            >
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        )}
        <div className="p-6 pt-2">{children}</div>
      </div>
    </div>
  );
}
